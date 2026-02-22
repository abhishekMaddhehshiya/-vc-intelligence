export interface Company {
  id: string;
  name: string;
  website: string;
  industry: string;
  location: string;
  description: string;
  tags: string[];
}

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
  enrichedAt: string;
}

export interface Signal {
  id: string;
  type: 'funding' | 'hiring' | 'product' | 'partnership' | 'news';
  title: string;
  description: string;
  date: string;
}

export interface Note {
  id: string;
  companyId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  id: string;
  name: string;
  description: string;
  companyIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilters;
  createdAt: string;
}

export interface SearchFilters {
  industry?: string;
  location?: string;
}

export type EnrichmentStatus = 'idle' | 'loading' | 'success' | 'error';

export interface EnrichmentState {
  status: EnrichmentStatus;
  data: EnrichmentData | null;
  error: string | null;
}
