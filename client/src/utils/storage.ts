import { List, Note, SavedSearch, EnrichmentData } from '../types';

const STORAGE_KEYS = {
  LISTS: 'vc-intelligence-lists',
  NOTES: 'vc-intelligence-notes',
  SAVED_SEARCHES: 'vc-intelligence-saved-searches',
  ENRICHMENTS: 'vc-intelligence-enrichments',
};

// Lists
export const getLists = (): List[] => {
  const data = localStorage.getItem(STORAGE_KEYS.LISTS);
  return data ? JSON.parse(data) : [];
};

export const saveLists = (lists: List[]): void => {
  localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
};

export const createList = (name: string, description: string): List => {
  const lists = getLists();
  const newList: List = {
    id: crypto.randomUUID(),
    name,
    description,
    companyIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  lists.push(newList);
  saveLists(lists);
  return newList;
};

export const updateList = (id: string, updates: Partial<List>): List | null => {
  const lists = getLists();
  const index = lists.findIndex((l) => l.id === id);
  if (index === -1) return null;
  
  lists[index] = {
    ...lists[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveLists(lists);
  return lists[index];
};

export const deleteList = (id: string): void => {
  const lists = getLists().filter((l) => l.id !== id);
  saveLists(lists);
};

export const addCompanyToList = (listId: string, companyId: string): void => {
  const lists = getLists();
  const list = lists.find((l) => l.id === listId);
  if (list && !list.companyIds.includes(companyId)) {
    list.companyIds.push(companyId);
    list.updatedAt = new Date().toISOString();
    saveLists(lists);
  }
};

export const removeCompanyFromList = (listId: string, companyId: string): void => {
  const lists = getLists();
  const list = lists.find((l) => l.id === listId);
  if (list) {
    list.companyIds = list.companyIds.filter((id) => id !== companyId);
    list.updatedAt = new Date().toISOString();
    saveLists(lists);
  }
};

// Notes
export const getNotes = (): Note[] => {
  const data = localStorage.getItem(STORAGE_KEYS.NOTES);
  return data ? JSON.parse(data) : [];
};

export const saveNotes = (notes: Note[]): void => {
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
};

export const getCompanyNotes = (companyId: string): Note[] => {
  return getNotes().filter((n) => n.companyId === companyId);
};

export const createNote = (companyId: string, content: string): Note => {
  const notes = getNotes();
  const newNote: Note = {
    id: crypto.randomUUID(),
    companyId,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.push(newNote);
  saveNotes(notes);
  return newNote;
};

export const updateNote = (id: string, content: string): Note | null => {
  const notes = getNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return null;
  
  notes[index] = {
    ...notes[index],
    content,
    updatedAt: new Date().toISOString(),
  };
  saveNotes(notes);
  return notes[index];
};

export const deleteNote = (id: string): void => {
  const notes = getNotes().filter((n) => n.id !== id);
  saveNotes(notes);
};

// Saved Searches
export const getSavedSearches = (): SavedSearch[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SAVED_SEARCHES);
  return data ? JSON.parse(data) : [];
};

export const saveSavedSearches = (searches: SavedSearch[]): void => {
  localStorage.setItem(STORAGE_KEYS.SAVED_SEARCHES, JSON.stringify(searches));
};

export const createSavedSearch = (
  name: string,
  query: string,
  filters: SavedSearch['filters']
): SavedSearch => {
  const searches = getSavedSearches();
  const newSearch: SavedSearch = {
    id: crypto.randomUUID(),
    name,
    query,
    filters,
    createdAt: new Date().toISOString(),
  };
  searches.push(newSearch);
  saveSavedSearches(searches);
  return newSearch;
};

export const deleteSavedSearch = (id: string): void => {
  const searches = getSavedSearches().filter((s) => s.id !== id);
  saveSavedSearches(searches);
};

// Enrichments Cache
export const getEnrichmentCache = (): Record<string, EnrichmentData> => {
  const data = localStorage.getItem(STORAGE_KEYS.ENRICHMENTS);
  return data ? JSON.parse(data) : {};
};

export const getCachedEnrichment = (companyId: string): EnrichmentData | null => {
  const cache = getEnrichmentCache();
  return cache[companyId] || null;
};

export const saveEnrichment = (companyId: string, data: EnrichmentData): void => {
  const cache = getEnrichmentCache();
  cache[companyId] = data;
  localStorage.setItem(STORAGE_KEYS.ENRICHMENTS, JSON.stringify(cache));
};

// Export utilities
export const exportToJSON = (data: unknown, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (data: Record<string, unknown>[], filename: string): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        const stringValue = Array.isArray(value) ? value.join('; ') : String(value ?? '');
        return `"${stringValue.replace(/"/g, '""')}"`;
      }).join(',')
    ),
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
