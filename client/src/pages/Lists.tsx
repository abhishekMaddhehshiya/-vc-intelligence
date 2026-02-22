import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Download,
  FileJson,
  FileSpreadsheet,
  ListTodo,
  Building2,
  X,
} from 'lucide-react';
import { List, Company } from '../types';
import { companies as allCompanies } from '../data/companies';
import {
  getLists,
  createList,
  deleteList,
  removeCompanyFromList,
  exportToJSON,
  exportToCSV,
} from '../utils/storage';
import Button from '../components/Button';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';

export default function Lists() {
  const navigate = useNavigate();
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  useEffect(() => {
    setLists(getLists());
  }, []);

  const refreshLists = () => {
    const updatedLists = getLists();
    setLists(updatedLists);
    if (selectedList) {
      setSelectedList(updatedLists.find((l) => l.id === selectedList.id) || null);
    }
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName, newListDescription);
      setNewListName('');
      setNewListDescription('');
      setShowCreateModal(false);
      refreshLists();
    }
  };

  const handleDeleteList = (listId: string) => {
    deleteList(listId);
    if (selectedList?.id === listId) {
      setSelectedList(null);
    }
    refreshLists();
  };

  const handleRemoveCompany = (listId: string, companyId: string) => {
    removeCompanyFromList(listId, companyId);
    refreshLists();
  };

  const getCompanyById = (id: string): Company | undefined => {
    return allCompanies.find((c) => c.id === id);
  };

  const handleExport = (format: 'json' | 'csv') => {
    if (!selectedList) return;

    const companiesData = selectedList.companyIds
      .map((id) => getCompanyById(id))
      .filter((c): c is Company => c !== undefined);

    if (format === 'json') {
      exportToJSON(
        {
          list: selectedList,
          companies: companiesData,
        },
        `${selectedList.name.toLowerCase().replace(/\s+/g, '-')}-export`
      );
    } else {
      exportToCSV(
        companiesData.map((c) => ({
          name: c.name,
          website: c.website,
          industry: c.industry,
          location: c.location,
          description: c.description,
          tags: c.tags,
        })),
        `${selectedList.name.toLowerCase().replace(/\s+/g, '-')}-export`
      );
    }
    setShowExportModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Lists</h1>
          <p className="text-neutral-500">Organize companies into custom lists</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} icon={<Plus className="w-4 h-4" />}>
          Create List
        </Button>
      </div>

      {lists.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No lists yet"
          description="Create your first list to start organizing companies."
          action={{
            label: 'Create List',
            onClick: () => setShowCreateModal(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lists sidebar */}
          <div className="space-y-3">
            {lists.map((list) => (
              <button
                key={list.id}
                onClick={() => setSelectedList(list)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedList?.id === list.id
                    ? 'bg-primary-50 border-primary-200 shadow-sm'
                    : 'bg-white border-neutral-200 hover:border-primary-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-neutral-900">{list.name}</h3>
                  <Badge variant="neutral">{list.companyIds.length}</Badge>
                </div>
                {list.description && (
                  <p className="text-sm text-neutral-500 mb-2 line-clamp-2">
                    {list.description}
                  </p>
                )}
                <p className="text-xs text-neutral-400">
                  Updated {formatDate(list.updatedAt)}
                </p>
              </button>
            ))}
          </div>

          {/* List details */}
          <div className="lg:col-span-2">
            {selectedList ? (
              <div className="card">
                {/* List header */}
                <div className="p-6 border-b border-neutral-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-neutral-900 mb-1">
                        {selectedList.name}
                      </h2>
                      {selectedList.description && (
                        <p className="text-neutral-500">{selectedList.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowExportModal(true)}
                        disabled={selectedList.companyIds.length === 0}
                        icon={<Download className="w-4 h-4" />}
                      >
                        Export
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteList(selectedList.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Companies in list */}
                <div className="p-6">
                  {selectedList.companyIds.length > 0 ? (
                    <div className="space-y-3">
                      {selectedList.companyIds.map((companyId) => {
                        const company = getCompanyById(companyId);
                        if (!company) return null;
                        return (
                          <div
                            key={company.id}
                            className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors group"
                          >
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => navigate(`/companies/${company.id}`)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white border border-neutral-200 rounded-lg flex items-center justify-center">
                                  <Building2 className="w-5 h-5 text-neutral-400" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                                    {company.name}
                                  </h4>
                                  <p className="text-sm text-neutral-500">
                                    {company.industry} • {company.location}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveCompany(selectedList.id, company.id)
                              }
                              className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-lg transition-all"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Building2 className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-500 mb-4">No companies in this list yet.</p>
                      <Button
                        variant="secondary"
                        onClick={() => navigate('/companies')}
                      >
                        Browse Companies
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <ListTodo className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500">Select a list to view its contents.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create List Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New List"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              List Name
            </label>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="e.g., Top Fintech Startups"
              className="input"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Description (optional)
            </label>
            <textarea
              value={newListDescription}
              onChange={(e) => setNewListDescription(e.target.value)}
              placeholder="Add a description for this list..."
              className="input min-h-[80px] resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateList} disabled={!newListName.trim()}>
              Create List
            </Button>
          </div>
        </div>
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export List"
        size="sm"
      >
        <div className="space-y-3">
          <button
            onClick={() => handleExport('csv')}
            className="w-full flex items-center gap-4 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
            <div className="text-left">
              <p className="font-medium text-neutral-900">Export as CSV</p>
              <p className="text-sm text-neutral-500">Compatible with Excel, Sheets</p>
            </div>
          </button>
          <button
            onClick={() => handleExport('json')}
            className="w-full flex items-center gap-4 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <FileJson className="w-8 h-8 text-primary-600" />
            <div className="text-left">
              <p className="font-medium text-neutral-900">Export as JSON</p>
              <p className="text-sm text-neutral-500">Full data with metadata</p>
            </div>
          </button>
        </div>
      </Modal>
    </div>
  );
}
