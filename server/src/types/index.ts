export interface EnrichmentSource {
  url: string;
  timestamp: string;
}

export interface EnrichmentData {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  signals: string[];
  sources: EnrichmentSource[];
}

export interface EnrichmentRequest {
  url: string;
}

export interface EnrichmentResponse {
  success: boolean;
  data?: EnrichmentData;
  error?: string;
}

export interface ScrapedContent {
  title: string;
  description: string;
  content: string;
  url: string;
}
