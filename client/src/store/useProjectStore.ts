import { create } from 'zustand';
import type { Project, ProjectOverview } from '../types';

interface ProjectState {
  projects: ProjectOverview[];
  activeProject: Project | null;
  isLoading: boolean;
  selectedBlockId: string | null;
  
  setProjects: (projects: ProjectOverview[]) => void;
  setActiveProject: (project: Project | null) => void;
  setLoading: (loading: boolean) => void;
  setSelectedBlockId: (id: string | null) => void;
  updateBlock: (blockId: string, newProps: Record<string, any>) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  activeProject: null,
  isLoading: false,
  selectedBlockId: null,

  setProjects: (projects) => set({ projects }),
  setActiveProject: (activeProject) => set({ activeProject, selectedBlockId: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setSelectedBlockId: (selectedBlockId) => set({ selectedBlockId }),
  
  updateBlock: (blockId, newProps) => set((state) => {
    if (!state.activeProject) return state;
    
    // We only support single page right now
    const pages = [...state.activeProject.pages];
    const pageIndex = 0;
    
    const newBlocks = pages[pageIndex].blocks.map(b => 
      b.id === blockId ? { ...b, props: { ...b.props, ...newProps } } : b
    );
    
    pages[pageIndex] = { ...pages[pageIndex], blocks: newBlocks };
    
    return {
      activeProject: {
        ...state.activeProject,
        pages
      }
    };
  })
}));
