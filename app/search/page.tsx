'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { FileText, FolderOpen, User } from 'lucide-react';

type SearchResults = {
  projects: Array<{ id: string; title: string; description?: string }>;
  tasks: Array<{ id: string; title: string; description?: string; project: { title: string } }>;
  clients: Array<{ id: string; name: string; company?: string }>;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResults>({ projects: [], tasks: [], clients: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">Projects ({results.projects.length})</h2>
                <div className="space-y-2">
                  {results.projects.map(project => (
                    <Link key={project.id} href={`/projects/${project.id}`} className="block p-4 border rounded-lg hover:bg-gray-100">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5" />
                        <span>{project.title}</span>
                      </div>
                      {project.description && <p className="text-sm text-gray-600">{project.description}</p>}
                    </Link>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4">Tasks ({results.tasks.length})</h2>
                <div className="space-y-2">
                  {results.tasks.map(task => (
                    <Link key={task.id} href={`/tasks/${task.id}`} className="block p-4 border rounded-lg hover:bg-gray-100">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <span>{task.title}</span>
                      </div>
                      {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
                      <p className="text-xs text-gray-500">Project: {task.project.title}</p>
                    </Link>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="text-xl font-semibold mb-4">Clients ({results.clients.length})</h2>
                <div className="space-y-2">
                  {results.clients.map(client => (
                    <Link key={client.id} href={`/clients/${client.id}`} className="block p-4 border rounded-lg hover:bg-gray-100">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <span>{client.name}</span>
                      </div>
                      {client.company && <p className="text-sm text-gray-600">{client.company}</p>}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 