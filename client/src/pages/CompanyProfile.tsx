import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Globe,
  MapPin,
  Building2,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ListPlus,
} from 'lucide-react';
import { Company, Note, List, EnrichmentState, Signal } from '../types';
import { companies, mockSignals } from '../data/companies';
import {
  getLists,
  getCompanyNotes,
  createNote,
  updateNote,
  deleteNote,
  addCompanyToList,
  removeCompanyFromList,
  getCachedEnrichment,
  saveEnrichment,
} from '../utils/storage';
import { enrichCompany } from '../utils/api';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import EnrichmentCard from '../components/EnrichmentCard';
import { ProfileSkeleton } from '../components/Skeleton';

export default function CompanyProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  const [showListModal, setShowListModal] = useState(false);
  const [enrichmentState, setEnrichmentState] = useState<EnrichmentState>({
    status: 'idle',
    data: null,
    error: null,
  });

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const foundCompany = companies.find((c) => c.id === id);
    
    setTimeout(() => {
      if (foundCompany) {
        setCompany(foundCompany);
        setNotes(getCompanyNotes(foundCompany.id));
        setLists(getLists());
        setSignals(mockSignals[foundCompany.id] || []);
        
        // Check for cached enrichment
        const cached = getCachedEnrichment(foundCompany.id);
        if (cached) {
          setEnrichmentState({
            status: 'success',
            data: cached,
            error: null,
          });
        }
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleEnrich = async () => {
    if (!company) return;

    setEnrichmentState({
      status: 'loading',
      data: null,
      error: null,
    });

    const response = await enrichCompany(company.website);

    if (response.success && response.data) {
      saveEnrichment(company.id, response.data);
      setEnrichmentState({
        status: 'success',
        data: response.data,
        error: null,
      });
    } else {
      setEnrichmentState({
        status: 'error',
        data: null,
        error: response.error || 'Failed to enrich company data',
      });
    }
  };

  const handleReEnrich = async () => {
    setEnrichmentState({
      status: 'loading',
      data: enrichmentState.data,
      error: null,
    });
    await handleEnrich();
  };

  const handleAddNote = () => {
    if (!company || !newNote.trim()) return;
    const note = createNote(company.id, newNote);
    setNotes([...notes, note]);
    setNewNote('');
  };

  const handleUpdateNote = (noteId: string) => {
    if (!editingNoteContent.trim()) return;
    const updated = updateNote(noteId, editingNoteContent);
    if (updated) {
      setNotes(notes.map((n) => (n.id === noteId ? updated : n)));
    }
    setEditingNoteId(null);
    setEditingNoteContent('');
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    setNotes(notes.filter((n) => n.id !== noteId));
  };

  const handleToggleList = (listId: string) => {
    if (!company) return;
    const list = lists.find((l) => l.id === listId);
    if (!list) return;

    if (list.companyIds.includes(company.id)) {
      removeCompanyFromList(listId, company.id);
    } else {
      addCompanyToList(listId, company.id);
    }
    setLists(getLists());
  };

  const getSignalIcon = (type: Signal['type']) => {
    const icons = {
      funding: '💰',
      hiring: '👥',
      product: '🚀',
      partnership: '🤝',
      news: '📰',
    };
    return icons[type];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">Company Not Found</h2>
        <p className="text-neutral-500 mb-4">The company you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/companies')}>Back to Companies</Button>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* Back button */}
      <Link
        to="/companies"
        className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Companies
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">{company.name}</h1>
          <div className="flex items-center gap-4 text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                {company.website.replace('https://', '')}
              </a>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {company.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              {company.industry}
            </span>
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowListModal(true)}
          icon={<ListPlus className="w-4 h-4" />}
        >
          Save to List
        </Button>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Overview</h2>
            <p className="text-neutral-600 leading-relaxed mb-4">{company.description}</p>
            <div className="flex flex-wrap gap-2">
              {company.tags.map((tag) => (
                <Badge key={tag} variant="neutral" size="md">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Enrichment */}
          <EnrichmentCard
            enrichmentState={enrichmentState}
            onEnrich={handleEnrich}
            onReEnrich={handleReEnrich}
          />

          {/* Signals Timeline */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Signals Timeline</h2>
            {signals.length > 0 ? (
              <div className="space-y-4">
                {signals.map((signal) => (
                  <div
                    key={signal.id}
                    className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg"
                  >
                    <span className="text-2xl">{getSignalIcon(signal.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-neutral-900">{signal.title}</h3>
                        <span className="text-sm text-neutral-400">
                          {formatDate(signal.date)}
                        </span>
                      </div>
                      <p className="text-neutral-600 text-sm">{signal.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-8">
                No signals recorded for this company yet.
              </p>
            )}
          </div>
        </div>

        {/* Right column - Notes & Lists */}
        <div className="space-y-6">
          {/* Company in Lists */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">In Lists</h2>
            {lists.filter((l) => l.companyIds.includes(company.id)).length > 0 ? (
              <div className="space-y-2">
                {lists
                  .filter((l) => l.companyIds.includes(company.id))
                  .map((list) => (
                    <Link
                      key={list.id}
                      to="/lists"
                      className="block px-3 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      {list.name}
                    </Link>
                  ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">Not added to any lists yet.</p>
            )}
          </div>

          {/* Notes */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notes</h2>
            
            {/* Add note */}
            <div className="mb-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="input min-h-[80px] resize-none"
              />
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                size="sm"
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Note
              </Button>
            </div>

            {/* Notes list */}
            {notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 bg-neutral-50 rounded-lg">
                    {editingNoteId === note.id ? (
                      <div>
                        <textarea
                          value={editingNoteContent}
                          onChange={(e) => setEditingNoteContent(e.target.value)}
                          className="input min-h-[60px] resize-none mb-2"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateNote(note.id)}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingNoteId(null);
                              setEditingNoteContent('');
                            }}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-neutral-700 text-sm mb-2">{note.content}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-neutral-400">
                            {formatDate(note.updatedAt)}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditingNoteId(note.id);
                                setEditingNoteContent(note.content);
                              }}
                              className="p-1 hover:bg-neutral-200 rounded transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-neutral-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm text-center py-4">
                No notes yet. Add your first note above.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add to List Modal */}
      <Modal
        isOpen={showListModal}
        onClose={() => setShowListModal(false)}
        title="Save to List"
      >
        <div className="space-y-3">
          {lists.length > 0 ? (
            lists.map((list) => {
              const isInList = list.companyIds.includes(company.id);
              return (
                <button
                  key={list.id}
                  onClick={() => handleToggleList(list.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                    isInList
                      ? 'bg-primary-50 border-primary-200 text-primary-700'
                      : 'bg-white border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-medium">{list.name}</p>
                    <p className="text-sm text-neutral-500">
                      {list.companyIds.length} companies
                    </p>
                  </div>
                  {isInList && <Check className="w-5 h-5 text-primary-600" />}
                </button>
              );
            })
          ) : (
            <div className="text-center py-6">
              <p className="text-neutral-500 mb-4">No lists created yet.</p>
              <Button onClick={() => navigate('/lists')}>Create a List</Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
