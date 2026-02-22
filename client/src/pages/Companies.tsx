import { useState, useMemo } from 'react';
import { Bookmark } from 'lucide-react';
import { Company } from '../types';
import { companies as mockCompanies, industries, locations } from '../data/companies';
import { createSavedSearch } from '../utils/storage';
import SearchInput from '../components/SearchInput';
import Select from '../components/Select';
import CompanyTable from '../components/CompanyTable';
import Pagination from '../components/Pagination';
import Button from '../components/Button';
import Modal from '../components/Modal';

const ITEMS_PER_PAGE = 10;

export default function Companies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [industry, setIndustry] = useState('All Industries');
  const [location, setLocation] = useState('All Locations');
  const [sortField, setSortField] = useState<keyof Company>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchName, setSearchName] = useState('');

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    let result = [...mockCompanies];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          company.description.toLowerCase().includes(query) ||
          company.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by industry
    if (industry !== 'All Industries') {
      result = result.filter((company) => company.industry === industry);
    }

    // Filter by location
    if (location !== 'All Locations') {
      result = result.filter((company) => company.location === location);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (Array.isArray(aVal) && Array.isArray(bVal)) {
        return sortDirection === 'asc' 
          ? aVal.length - bVal.length 
          : bVal.length - aVal.length;
      }
      
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, industry, location, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: keyof Company) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSaveSearch = () => {
    if (searchName.trim()) {
      createSavedSearch(searchName, searchQuery, {
        industry: industry !== 'All Industries' ? industry : undefined,
        location: location !== 'All Locations' ? location : undefined,
      });
      setShowSaveModal(false);
      setSearchName('');
    }
  };

  const hasActiveFilters = searchQuery || industry !== 'All Industries' || location !== 'All Locations';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Companies</h1>
        <p className="text-neutral-500">
          Discover and analyze venture-backed companies
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, description, or tags..."
            autoFocus
          />
        </div>
        <div className="flex gap-4">
          <div className="w-48">
            <Select
              value={industry}
              onChange={(value) => {
                setIndustry(value);
                setCurrentPage(1);
              }}
              options={industries}
            />
          </div>
          <div className="w-48">
            <Select
              value={location}
              onChange={(value) => {
                setLocation(value);
                setCurrentPage(1);
              }}
              options={locations}
            />
          </div>
          {hasActiveFilters && (
            <Button
              variant="secondary"
              onClick={() => setShowSaveModal(true)}
              icon={<Bookmark className="w-4 h-4" />}
            >
              Save Search
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-neutral-500">
          {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'} found
        </p>
      </div>

      {/* Table */}
      <CompanyTable
        companies={paginatedCompanies}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredCompanies.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      {/* Save Search Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Save Search"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Search Name
            </label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="e.g., Fintech startups in SF"
              className="input"
              autoFocus
            />
          </div>
          <div className="text-sm text-neutral-500">
            <p className="font-medium mb-1">Current filters:</p>
            <ul className="space-y-1">
              {searchQuery && <li>Query: "{searchQuery}"</li>}
              {industry !== 'All Industries' && <li>Industry: {industry}</li>}
              {location !== 'All Locations' && <li>Location: {location}</li>}
            </ul>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSearch} disabled={!searchName.trim()}>
              Save Search
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
