import { API_BASE_URL } from '../config/env';

export interface GrantPdfLinkRequest {
  grant_url: string;
}

export interface GrantPdfLinkResponse {
  session_id: string;
  live_view_url: string;
  pdf_link: string;
}

export async function fetchGrantPdfLink(grantUrl: string): Promise<GrantPdfLinkResponse> {
  const endpoint = new URL('/api/grants/pdf-link', API_BASE_URL).toString();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ grant_url: grantUrl } satisfies GrantPdfLinkRequest),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || 'Failed to retrieve Browserbase session.');
  }

  return response.json() as Promise<GrantPdfLinkResponse>;
}

