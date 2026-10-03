import { ScoredOpportunity } from '../features/opportunity-engine/types';
import { IdeaItem, Project } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const api = {
  opportunities: {
    list: async (): Promise<ScoredOpportunity[]> => {
      const res = await fetch(`${API_BASE}/opportunities`);
      if (!res.ok) throw new Error('Failed to fetch opportunities');
      return res.json();
    },
    get: async (id: string): Promise<ScoredOpportunity> => {
      const res = await fetch(`${API_BASE}/opportunities/${id}`);
      if (!res.ok) throw new Error('Failed to fetch opportunity');
      return res.json();
    }
  },
  ideas: {
    list: async (): Promise<IdeaItem[]> => {
      const res = await fetch(`${API_BASE}/ideas`);
      if (!res.ok) throw new Error('Failed to fetch ideas');
      return res.json();
    },
    create: async (data: Partial<IdeaItem>): Promise<IdeaItem> => {
      const res = await fetch(`${API_BASE}/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create idea');
      return res.json();
    }
  },
  projects: {
    list: async (): Promise<Project[]> => {
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },
    create: async (data: Partial<Project>): Promise<Project> => {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create project');
      return res.json();
    },
    get: async (id: string): Promise<Project> => {
      const res = await fetch(`${API_BASE}/projects/${id}`);
      if (!res.ok) throw new Error('Failed to fetch project');
      return res.json();
    }
  }
};
