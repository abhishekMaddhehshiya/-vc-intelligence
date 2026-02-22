import { Sparkles, AlertCircle, ExternalLink, Clock, RefreshCw } from 'lucide-react';
import { EnrichmentState } from '../types';
import Button from './Button';
import Badge from './Badge';
import { EnrichmentSkeleton } from './Skeleton';

interface EnrichmentCardProps {
  enrichmentState: EnrichmentState;
  onEnrich: () => void;
  onReEnrich: () => void;
}

export default function EnrichmentCard({
  enrichmentState,
  onEnrich,
  onReEnrich,
}: EnrichmentCardProps) {
  const { status, data, error } = enrichmentState;

  // Idle state - show enrich button
  if (status === 'idle' && !data) {
    return (
      <div className="card p-6">
        <div className="text-center py-8">
          <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            AI-Powered Enrichment
          </h3>
          <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
            Get detailed insights about this company including what they do, key signals, and
            relevant keywords.
          </p>
          <Button onClick={onEnrich} icon={<Sparkles className="w-4 h-4" />}>
            Enrich Company Data
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (status === 'loading') {
    return <EnrichmentSkeleton />;
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="card p-6">
        <div className="text-center py-8">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Enrichment Failed</h3>
          <p className="text-neutral-500 mb-6 max-w-sm mx-auto">{error || 'Something went wrong while enriching this company.'}</p>
          <Button onClick={onEnrich} variant="secondary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Success state - show enriched data
  if (data) {
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
      <div className="card animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-transparent">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span className="font-semibold text-neutral-900">AI Enrichment</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(data.enrichedAt)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReEnrich}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Re-run
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-700 mb-2">Summary</h4>
            <p className="text-neutral-600 leading-relaxed">{data.summary}</p>
          </div>

          {/* What They Do */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-700 mb-2">What They Do</h4>
            <ul className="space-y-2">
              {data.whatTheyDo.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-neutral-600">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Keywords */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-700 mb-2">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {data.keywords.map((keyword, index) => (
                <Badge key={index} variant="primary" size="md">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* Signals */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-700 mb-2">Derived Signals</h4>
            <div className="space-y-2">
              {data.signals.map((signal, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <span className="text-amber-600">⚡</span>
                  <span className="text-sm text-amber-900">{signal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          {data.sources && data.sources.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 mb-2">Sources</h4>
              <div className="space-y-2">
                {data.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors group"
                  >
                    <span className="text-sm text-primary-600 truncate group-hover:underline">
                      {source.url}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-neutral-400">{formatDate(source.timestamp)}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
