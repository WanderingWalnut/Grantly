import type { GrantSearchResult } from './grants';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';

export interface GeminiSummarizedGrant {
  title: string;
  funder: string;
  amount_display: string;
  amount_min: number | null;
  amount_max: number | null;
  summary: string;
  eligibility: string[];
  deadline: string;
  link: string;
}

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

const MAX_INPUT_GRANTS = 12;
const MAX_FIELD_LENGTH = 800;

const truncate = (value: string | null | undefined, maxLength = MAX_FIELD_LENGTH): string => {
  if (!value) return '';
  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
};

const buildPrompt = (results: GrantSearchResult[]): string => {
  const compactResults = results.slice(0, MAX_INPUT_GRANTS).map((grant) => ({
    title: grant.title || 'Untitled Grant',
    link: grant.link,
    snippet: truncate(grant.summary || ''),
    raw_eligibility: truncate(grant.eligibility || ''),
    raw_deadline: grant.deadline || null,
    raw_amount_min: grant.amount_min,
    raw_amount_max: grant.amount_max,
    raw_sponsor: grant.sponsor || null,
  }));

  return [
    'You are a grants analyst extracting structured data from Perplexity grant search results.',
    'Analyze the snippet text from each grant and extract the following information:',
    '',
    'CRITICAL: Return ONLY a JSON array. No markdown, no code fences, no explanatory text, no backticks.',
    'Start your response with [ and end with ].',
    '',
    'For each grant, extract and return:',
    '- title: The grant program name (use the provided title if snippet is unclear)',
    '- link: The exact URL provided',
    '- funder: Organization name sponsoring the grant (extract from snippet if not provided)',
    '- amount_min: Minimum amount as a number (use 0 if only maximum is mentioned, null if no amount found)',
    '- amount_max: Maximum amount as a number (null if no amount found)',
    '- amount_display: Human-readable string like "$0 - $125,000 CAD" or "Up to $50,000 CAD"',
    '  * Parse phrases like "up to $125,000" → amount_min: 0, amount_max: 125000, amount_display: "Up to $125,000 CAD"',
    '  * Parse "$25,000 - $100,000" → amount_min: 25000, amount_max: 100000, amount_display: "$25,000 - $100,000 CAD"',
    '  * Parse "$50,000" → amount_min: 50000, amount_max: 50000, amount_display: "$50,000 CAD"',
    '- summary: Condensed description in 2-3 sentences about what the program funds',
    '- eligibility: Array of 2-4 short eligibility requirement phrases (extract from snippet)',
    '- deadline: Specific deadline date if mentioned, or "Rolling deadline" if unspecified',
    '',
    'Example output format (return ONLY the JSON array, nothing else):',
    '[{"title":"Community Heritage Program","link":"https://example.org/program","funder":"Heritage Foundation","amount_min":0,"amount_max":125000,"amount_display":"Up to $125,000 CAD","summary":"This program supports community heritage projects. Funding is available for preservation and educational initiatives.","eligibility":["Registered nonprofits","Heritage organizations","Community groups"],"deadline":"March 31, 2024"}]',
    '',
    'Input grants:',
    JSON.stringify(compactResults, null, 2),
  ].join('\n');
};

const extractTextFromResponse = (payload: GeminiGenerateContentResponse): string => {
  const { candidates } = payload;
  if (!candidates?.length) return '';

  return candidates
    .flatMap(candidate => candidate.content?.parts ?? [])
    .map(part => part.text ?? '')
    .join('')
    .trim();
};

const extractJsonArray = (text: string): string | null => {
  if (!text) return null;
  
  // Try to parse directly first (in case responseMimeType worked)
  try {
    const parsed = JSON.parse(text.trim());
    if (Array.isArray(parsed)) {
      return text.trim();
    }
  } catch {
    // Not valid JSON, continue to regex extraction
  }
  
  // Fallback: extract JSON array from text (handles markdown code fences)
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  return arrayMatch ? arrayMatch[0] : null;
};

const tryParseJsonArray = (text: string): GeminiSummarizedGrant[] => {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => ({
          title: String(item.title ?? '').trim(),
          funder: String(item.funder ?? '').trim(),
          amount_display: String(item.amount_display ?? item.amount ?? '').trim(),
          amount_min:
            typeof item.amount_min === 'number'
              ? item.amount_min
              : item.amount_min != null
              ? Number(item.amount_min)
              : null,
          amount_max:
            typeof item.amount_max === 'number'
              ? item.amount_max
              : item.amount_max != null
              ? Number(item.amount_max)
              : null,
          summary: String(item.summary ?? '').trim(),
          eligibility: Array.isArray(item.eligibility)
            ? item.eligibility.map((entry: unknown) => String(entry ?? '').trim()).filter(Boolean)
            : [],
          deadline: String(item.deadline ?? '').trim(),
          link: String(item.link ?? '').trim(),
        }))
        .filter((grant) => grant.title && grant.link);
    }
  } catch {
    // swallow parse errors; fallback handled by caller
  }
  return [];
};

export async function summarizeGrantResultsWithGemini(
  results: GrantSearchResult[],
): Promise<GeminiSummarizedGrant[]> {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing Gemini API key. Set VITE_GEMINI_API_KEY in your environment.');
  }

  if (!results.length) {
    return [];
  }

  const prompt = buildPrompt(results);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini summarization failed: ${response.status} ${detail}`);
  }

  const payload: GeminiGenerateContentResponse = await response.json();
  const text = extractTextFromResponse(payload);
  const arrayText = extractJsonArray(text);
  if (!arrayText) {
    // If Gemini fails to return valid JSON, return empty array (no fallback to raw data)
    console.warn('Gemini did not return valid JSON array. Response:', text.substring(0, 200));
    return [];
  }

  const parsed = tryParseJsonArray(arrayText);
  if (parsed.length) {
    return parsed;
  }

  // If parsing succeeded but array is empty, return empty array (no fallback)
  return [];
}
