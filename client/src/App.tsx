import { useState } from 'react';
import { Dashboard } from './components/Dashboard/Dashboard';
import { EditorLayout } from './components/Editor/EditorLayout';
import { useProjectStore } from './store/useProjectStore';

function App() {
  const { activeProject } = useProjectStore();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 w-full relative">
      {!activeProject ? (
        <Dashboard />
      ) : (
        <EditorLayout />
      )}
    </div>
  );
}

export default App;
