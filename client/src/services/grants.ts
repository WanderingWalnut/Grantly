import { API_BASE_URL } from '../config/env';

export interface GrantSearchFilters {
  province?: string;
  min_amount?: number;
  deadline_before?: string;
  max_results?: number;
}

export interface GrantSearchOrganization {
  legal_name: string;
  operating_name?: string;
  org_structure?: string;
  naics_code?: string;
  sector_tags?: string[];
  address?: {
    street?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    country?: string;
  };
}

export interface GrantSearchRequest {
  organization: GrantSearchOrganization;
  filters?: GrantSearchFilters;
}

export interface GrantSearchResult {
  title: string;
  link: string;
  summary?: string | null;
  eligibility?: string | null;
  deadline?: string | null;
  amount_min?: number | null;
  amount_max?: number | null;
  currency?: string | null;
  sponsor?: string | null;
  program?: string | null;
  region?: string | null;
  tags?: string[] | null;
  source_citations?: string[] | null;
}

export interface GrantSearchResponse {
  mode: 'mock' | 'live';
  count: number;
  results: GrantSearchResult[];
  generated_at: string;
}

export async function searchGrants(request: GrantSearchRequest): Promise<GrantSearchResponse> {
  const endpoint = new URL('/api/grants/search', API_BASE_URL).toString();
  const init: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  };

  const response = await fetch(new Request(endpoint, init));

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Failed to fetch grants: ${response.status} ${detail}`);
  }

  return response.json();
}

export function buildDefaultGrantSearchRequest(): GrantSearchRequest {
  return {
    organization: {
      legal_name: 'Northern Heritage Society',
      operating_name: 'NHS Alberta',
      org_structure: 'nonprofit',
      naics_code: '712120',
      sector_tags: ['heritage', 'culture', 'museum'],
      address: {
        province: 'AB',
      },
    },
    filters: {
      province: 'AB',
      min_amount: 10000,  // Lowered from 25000 to get more results
      max_results: 10,     // Increased from 3 to 10
    },
  };
}

