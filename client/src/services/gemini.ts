import type { GrantSearchResult } from './grants';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-1.5-flash-latest';

export interface GeminiSummarizedGrant {
  title: string;
  funder: string;
  amount: string;
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
    '- Return a JSON array with each grant formatted as: { "title", "funder", "amount", "summary", "eligibility": string[], "deadline", "link" }.',
    '- amount should be a short human readable range (e.g. "$25,000 - $100,000 CAD" or "Up to $50,000 CAD").',
    '- Include up to 5 grants. Drop anything that is clearly a directory or announcement unless it contains a direct program with application instructions.',
    '- eligibility should be 2-4 concise bullet phrases.',
    '- summary should be at most two sentences, focused on what the program funds.',
    '- Ensure link points directly to the program application or official details page.',
    '- If no suitable grants are present, return an empty JSON array.',
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
          amount: String(item.amount ?? '').trim(),
          summary: String(item.summary ?? '').trim(),
          eligibility: Array.isArray(item.eligibility)
            ? item.eligibility.map((entry: unknown) => String(entry ?? '').trim()).filter(Boolean)
            : [],
          deadline: String(item.deadline ?? '').trim(),
          link: String(item.link ?? '').trim(),
        }))
        .filter((grant) => grant.title && grant.summary && grant.link);
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
      amount: '',
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
      amount: '',
      summary: text,
      eligibility: [],
      deadline: '',
      link: '',
    },
  ];
}
