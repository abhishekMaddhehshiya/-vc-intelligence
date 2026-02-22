import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, Search, Play, Clock, Filter } from 'lucide-react';
import { SavedSearch } from '../types';
import { getSavedSearches, deleteSavedSearch } from '../utils/storage';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';

export default function SavedSearches() {
  const navigate = useNavigate();
  const [searches, setSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    setSearches(getSavedSearches());
  }, []);

  const handleDelete = (id: string) => {
    deleteSavedSearch(id);
    setSearches(getSavedSearches());
  };

  const handleRunSearch = (search: SavedSearch) => {
    const params = new URLSearchParams();
    if (search.query) params.set('q', search.query);
    if (search.filters.industry) params.set('industry', search.filters.industry);
    if (search.filters.location) params.set('location', search.filters.location);
    navigate(`/companies?${params.toString()}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Saved Searches</h1>
        <p className="text-neutral-500">
          Quickly re-run your saved search queries
        </p>
      </div>

      {searches.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved searches"
          description="Save your search queries from the Companies page to quickly re-run them later."
          action={{
            label: 'Go to Companies',
            onClick: () => navigate('/companies'),
          }}
        />
      ) : (
        <div className="grid gap-4">
          {searches.map((search) => (
            <div
              key={search.id}
              className="card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                      <Search className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">{search.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <Clock className="w-3.5 h-3.5" />
                        Saved {formatDate(search.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Search details */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {search.query && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 rounded-lg">
                        <Search className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-sm text-neutral-700">"{search.query}"</span>
                      </div>
                    )}
                    {search.filters.industry && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 rounded-lg">
                        <Filter className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-sm text-neutral-700">
                          Industry: {search.filters.industry}
                        </span>
                      </div>
                    )}
                    {search.filters.location && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 rounded-lg">
                        <Filter className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-sm text-neutral-700">
                          Location: {search.filters.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleRunSearch(search)}
                    icon={<Play className="w-4 h-4" />}
                  >
                    Run Search
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(search.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
