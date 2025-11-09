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
    title: grant.title,
    sponsor: grant.sponsor,
    amount_min: grant.amount_min,
    amount_max: grant.amount_max,
    currency: grant.currency,
    deadline: grant.deadline,
    summary: truncate(grant.summary),
    eligibility: truncate(grant.eligibility),
    link: grant.link,
  }));

  return [
    'You are a grants analyst summarizing funding opportunities for a nonprofit.',
    'Review the following JSON array of grants and pick the best matches.',
    'Rules:',
    '- Return a JSON array with each grant formatted exactly like:',
    '[{"title":"Example Program","link":"https://example.org/program","funder":"Example Funder","amount_min":0,"amount_max":125000,"amount_display":"Up to $125,000 CAD","summary":"Two-sentence overview of the funding purpose.","eligibility":["Eligible org type 1","Eligible org type 2"],"deadline":"Rolling deadline"}]',
    '- amount_min and amount_max must be numbers (no strings). Use 0 for minimum when a lower bound is not provided. If only a single value like "up to $125,000" is mentioned, set amount_min to 0 and amount_max to 125000.',
    '- amount_display should be a concise human-readable string (e.g. "$25,000 - $100,000 CAD" or "Up to $50,000 CAD").',
    '- summary should be no more than two sentences describing what the program funds.',
    '- eligibility should be an array of 2-4 short bullet phrases; omit duplicative or irrelevant text.',
    '- deadline should capture the most relevant upcoming deadline or use "Rolling deadline" when unspecified.',
    '- Ensure link points directly to the program page or official application instructions.',
    '- Do not wrap the JSON in code fences or add explanatory text outside the JSON.',
    '- If no suitable grants are present, return an empty JSON array [] with no additional text.',
    '',
    'Raw grants JSON:',
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
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini summarization failed: ${response.status} ${detail}`);
  }

  const payload: GeminiGenerateContentResponse = await response.json();
  const text = extractTextFromResponse(payload);
  if (!text) {
    return [];
  }

  const parsed = tryParseJsonArray(text);
  if (parsed.length) {
    return parsed;
  }

  const urlMatches = Array.from(new Set(text.match(/https?:\/\/[^\s"'<>]+/g) ?? []));
  if (urlMatches.length) {
    return urlMatches.map((url, index) => ({
      title: `Grant Opportunity ${index + 1}`,
      funder: '',
      amount_display: '',
      amount_min: null,
      amount_max: null,
      summary: '',
      eligibility: [],
      deadline: '',
      link: url,
    }));
  }

  return [
    {
      title: 'Summary',
      funder: '',
      amount_display: '',
      amount_min: null,
      amount_max: null,
      summary: text,
      eligibility: [],
      deadline: '',
      link: '',
    },
  ];
}
