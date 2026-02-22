import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { Company } from '../types';
import Badge from './Badge';
import { TableRowSkeleton } from './Skeleton';

interface CompanyTableProps {
  companies: Company[];
  loading?: boolean;
  sortField: keyof Company;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Company) => void;
}

export default function CompanyTable({
  companies,
  loading = false,
  sortField,
  sortDirection,
  onSort,
}: CompanyTableProps) {
  const navigate = useNavigate();

  const SortIcon = ({ field }: { field: keyof Company }) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 text-neutral-300" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-primary-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-primary-600" />
    );
  };

  const headers = [
    { key: 'name' as const, label: 'Company' },
    { key: 'industry' as const, label: 'Industry' },
    { key: 'location' as const, label: 'Location' },
    { key: 'tags' as const, label: 'Tags', sortable: false },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              {headers.map((header) => (
                <th
                  key={header.key}
                  className={`px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider ${
                    header.sortable !== false ? 'cursor-pointer hover:text-neutral-700' : ''
                  }`}
                  onClick={header.sortable !== false ? () => onSort(header.key) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {header.label}
                    {header.sortable !== false && <SortIcon field={header.key} />}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Website
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
            ) : (
              companies.map((company) => (
                <tr
                  key={company.id}
                  className="table-row"
                  onClick={() => navigate(`/companies/${company.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">{company.name}</div>
                    <div className="text-sm text-neutral-500 truncate max-w-xs">
                      {company.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="primary">{company.industry}</Badge>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{company.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {company.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="neutral">
                          {tag}
                        </Badge>
                      ))}
                      {company.tags.length > 3 && (
                        <Badge variant="neutral">+{company.tags.length - 3}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm"
                    >
                      Visit
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
