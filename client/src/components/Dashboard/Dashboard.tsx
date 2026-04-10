import { useEffect, useState } from 'react';
import { PlusCircle, FileText, Trash2, Copy, Edit2 } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { api } from '../../lib/api';

export const Dashboard = () => {
  const { projects, setProjects, setActiveProject, setLoading } = useProjectStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async () => {
    if (!newProjectName.trim()) return;
    const newId = crypto.randomUUID();
    const newProject = {
      id: newId,
      name: newProjectName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config: { font: 'Inter', toolbarType: 'minimal', logo: null },
      pages: [
        { id: crypto.randomUUID(), name: 'Home', route: '/', blocks: [] }
      ]
    };
    
    await api.saveProject(newProject);
    setNewProjectName('');
    setIsCreating(false);
    loadProjects();
  };

  const handleLoad = async (id: string) => {
    try {
      const project = await api.getProject(id);
      setActiveProject(project);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Wirklich löschen?')) return;
    await api.deleteProject(id);
    loadProjects();
  };

  const handleDuplicate = async (id: string, currentName: string) => {
    const newName = prompt('Neuer Name für das Duplikat:', `Kopie von ${currentName}`);
    if (!newName) return;
    
    try {
      await api.duplicateProject(id, newName);
      loadProjects();
    } catch (e) {
      console.error(e);
      alert('Fehler beim Duplizieren des Projekts.');
    }
  };

  const handleRename = async (id: string, currentName: string) => {
    const newName = prompt('Projektname ändern:', currentName);
    if (!newName || newName.trim() === '' || newName === currentName) return;
    
    try {
      const project = await api.getProject(id);
      project.name = newName;
      await api.saveProject(project);
      loadProjects();
    } catch (e) {
      console.error(e);
      alert('Fehler beim Umbenennen des Projekts.');
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto w-full text-left">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold m-0">Meine Projekte</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
        >
          <PlusCircle size={20} /> Neues Projekt
        </button>
      </div>

      {isCreating && (
        <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200 flex gap-4 items-center">
          <input 
            type="text" 
            placeholder="Projektname..." 
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            autoFocus
          />
          <button onClick={handleCreate} className="bg-black text-white px-6 py-3 rounded-lg font-medium">
            Erstellen
          </button>
          <button onClick={() => setIsCreating(false)} className="text-gray-500 px-4 py-3">
            Abbrechen
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
               onClick={() => handleLoad(p.id)}>
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">{p.name}</h3>
            <p className="text-sm text-gray-500">
              Erstellt: {new Date(p.createdAt).toLocaleDateString()}
            </p>
            
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); handleRename(p.id, p.name); }}
                className="text-gray-300 hover:text-green-500 transition-colors"
                title="Umbenennen"
              >
                <Edit2 size={20} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDuplicate(p.id, p.name); }}
                className="text-gray-300 hover:text-blue-500 transition-colors"
                title="Duplizieren"
              >
                <Copy size={20} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                className="text-gray-300 hover:text-red-500 transition-colors"
                title="Löschen"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && !isCreating && (
          <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">
            Noch keine Projekte vorhanden. Klicke oben auf "Neues Projekt".
          </div>
        )}
      </div>
    </div>
  );
};
