import type { GrantSearchResult } from './grants';
import { GEMINI_API_KEY } from '../config/env';

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
const BATCH_SIZE = 3; // Process grants in batches of 3 to avoid Gemini limits

const truncate = (value: string | null | undefined, maxLength = MAX_FIELD_LENGTH): string => {
  if (!value) return '';
  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
};

const buildPrompt = (results: GrantSearchResult[]): string => {
  const compactResults = results.slice(0, MAX_INPUT_GRANTS).map((grant) => ({
    title: grant.title || 'Untitled Grant',
    link: grant.link,
    snippet: truncate(grant.summary || 'No description available. Research this grant program for details.'),
    raw_eligibility: truncate(grant.eligibility || 'See program link for eligibility requirements'),
    raw_deadline: grant.deadline || null,
    raw_amount_min: grant.amount_min,
    raw_amount_max: grant.amount_max,
    raw_sponsor: grant.sponsor || 'Government of Alberta',
  }));

  return [
    'You are a grants analyst extracting structured data from Perplexity grant search results.',
    'Analyze the snippet text from each grant and extract the following information:',
    '',
    'DEDUPLICATION REQUIREMENT:',
    'Before processing, identify duplicate grants that represent the EXACT SAME program. Grants are duplicates ONLY if they:',
    '- Have identical or nearly identical program names AND the same link/URL',
    '- Are from the same funder with identical titles (ignore minor formatting differences)',
    '',
    'IMPORTANT: Different programs from the same funder are NOT duplicates. For example:',
    '- "Medical Services Grant" and "Healthcare Innovation Grant" are DIFFERENT programs (keep both)',
    '- "Community Facility Enhancement - Health" and "Rural Healthcare Access" are DIFFERENT programs (keep both)',
    '- "Mental Health Programs" and "Healthcare Innovation" are DIFFERENT programs (keep both)',
    '',
    'For true duplicate grants, keep ONLY ONE entry:',
    '- Prefer the FIRST occurrence with the most complete information',
    '- Merge the best details if needed',
    '- DO NOT over-deduplicate: when in doubt, keep both grants as separate entries',
    '',
    'CRITICAL: Return ONLY a JSON array. No markdown, no code fences, no explanatory text, no backticks.',
    'Start your response with [ and end with ].',
    '',
    'IMPORTANT: Even if data is incomplete or minimal, ALWAYS return valid JSON for each grant.',
    'Use placeholder values or generic descriptions rather than omitting grants.',
    'Every grant in the input MUST have a corresponding entry in the output array unless it is a true duplicate.',
    '',
    'For each UNIQUE grant (after deduplication), extract and return:',
    '- title: The grant program name (use the most complete/accurate title from duplicates)',
    '- link: The exact URL provided (use the most direct program page URL if duplicates have different links)',
    '- funder: Organization name sponsoring the grant (use raw_sponsor if provided, otherwise extract from snippet)',
    '- amount_min: Minimum amount as a number (use 0 if only maximum is mentioned, null if no amount found)',
    '- amount_max: Maximum amount as a number (null if no amount found)',
    '- amount_display: Human-readable string like "$0 - $125,000 CAD" or "Up to $50,000 CAD"',
    '  * Parse phrases like "up to $125,000" → amount_min: 0, amount_max: 125000, amount_display: "Up to $125,000 CAD"',
    '  * Parse "$25,000 - $100,000" → amount_min: 25000, amount_max: 100000, amount_display: "$25,000 - $100,000 CAD"',
    '  * Parse "$50,000" → amount_min: 50000, amount_max: 50000, amount_display: "$50,000 CAD"',
    '  * If no amount found in snippet, use "Contact program for details"',
    '- summary: Condensed description in 2-3 sentences about what the program funds. If snippet is minimal, create a generic description based on the title (e.g., "This program provides funding for [topic from title]. Contact the program for more details.")',
    '- eligibility: Array of 2-4 short eligibility requirement phrases. If raw_eligibility is minimal, use generic eligibility like ["Non-profit organizations", "Community groups", "Charitable organizations"]',
    '- deadline: Specific deadline date if mentioned in snippet, or "Rolling deadline" if unspecified',
    '',
    'Example output format (return ONLY the JSON array, nothing else):',
    '[{"title":"Community Heritage Program","link":"https://example.org/program","funder":"Heritage Foundation","amount_min":0,"amount_max":125000,"amount_display":"Up to $125,000 CAD","summary":"This program supports community heritage projects. Funding is available for preservation and educational initiatives.","eligibility":["Registered nonprofits","Heritage organizations","Community groups"],"deadline":"March 31, 2024"}]',
    '',
    'Input grants (analyze for duplicates and return only unique programs):',
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

/**
 * Process a single batch of grants through Gemini API
 */
async function processBatch(
  batch: GrantSearchResult[],
  batchNumber: number,
  totalBatches: number,
): Promise<GeminiSummarizedGrant[]> {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing Gemini API key. Set VITE_GEMINI_API_KEY in your environment.');
  }

  console.log(`📊 Gemini: Processing batch ${batchNumber}/${totalBatches} (${batch.length} grants)`);

  const prompt = buildPrompt(batch);
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const requestBody = {
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
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  console.log(`📥 Batch ${batchNumber} response:`, response.status, response.statusText);

  if (!response.ok) {
    const detail = await response.text();
    console.error(`❌ Batch ${batchNumber} error:`, detail);
    throw new Error(`Gemini batch ${batchNumber} failed: ${response.status} ${detail}`);
  }

  const payload: GeminiGenerateContentResponse = await response.json();
  const text = extractTextFromResponse(payload);
  
  const arrayText = extractJsonArray(text);
  if (!arrayText) {
    console.error(`❌ Batch ${batchNumber}: Gemini did not return valid JSON array.`);
    return [];
  }

  const parsed = tryParseJsonArray(arrayText);
  console.log(`✅ Batch ${batchNumber}: Processed ${parsed.length} grants`);
  return parsed;
}

export async function summarizeGrantResultsWithGemini(
  results: GrantSearchResult[],
): Promise<GeminiSummarizedGrant[]> {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing Gemini API key. Set VITE_GEMINI_API_KEY in your environment.');
  }

  if (!results.length) {
    return [];
  }

  console.log(`📊 Gemini: Processing ${results.length} grants for deduplication and summarization`);
  console.log('Grant titles:', results.map(r => r.title));

  // Split results into batches of BATCH_SIZE
  const batches: GrantSearchResult[][] = [];
  for (let i = 0; i < results.length; i += BATCH_SIZE) {
    batches.push(results.slice(i, i + BATCH_SIZE));
  }

  console.log(`📦 Split into ${batches.length} batches of up to ${BATCH_SIZE} grants each`);

  // Process batches sequentially to avoid rate limits
  const allProcessedGrants: GeminiSummarizedGrant[] = [];
  
  for (let i = 0; i < batches.length; i++) {
    try {
      const batchResults = await processBatch(batches[i], i + 1, batches.length);
      allProcessedGrants.push(...batchResults);
      
      // Add a small delay between batches to avoid rate limiting
      if (i < batches.length - 1) {
        console.log('⏳ Waiting 500ms before next batch...');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`❌ Error processing batch ${i + 1}:`, error);
      // Continue with other batches even if one fails
    }
  }

  // Remove duplicates across batches (by link)
  const uniqueGrants = new Map<string, GeminiSummarizedGrant>();
  for (const grant of allProcessedGrants) {
    if (!uniqueGrants.has(grant.link)) {
      uniqueGrants.set(grant.link, grant);
    }
  }

  const finalResults = Array.from(uniqueGrants.values());
  console.log(`✅ Gemini: Successfully processed ${finalResults.length} unique grants after deduplication`);
  console.log('Returned grant titles:', finalResults.map(g => g.title));

  return finalResults;
}
