import { supabase } from './supabase';

// @ts-ignore
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = response.statusText;
    try {
      const errData = await response.json();
      errorMsg = errData.detail || errData.error?.message || errorMsg;
    } catch (e) {
      // Ignored
    }
    
    if (response.status === 401) {
      console.error("Unauthorized API call. Token may be expired.");
      // Typically we might trigger a logout or token refresh here
    }
    
    throw new Error(errorMsg);
  }
  
  if (response.status === 204) return {};
  
  // Try parsing JSON if content exists
  try {
    return await response.json();
  } catch (e) {
    return {};
  }
}

export const apiClient = {
  get: (url: string) => fetchWithAuth(url),
  post: (url: string, body?: any) => fetchWithAuth(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: (url: string, body?: any) => fetchWithAuth(url, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: (url: string, body?: any) => fetchWithAuth(url, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: (url: string) => fetchWithAuth(url, { method: 'DELETE' }),
  
  profile: {
    update: (data: any) => fetchWithAuth('/profile', { method: 'PATCH', body: JSON.stringify(data) })
  },
  creatorDna: {
    update: (data: any) => fetchWithAuth('/creator-dna', { method: 'PUT', body: JSON.stringify(data) })
  },
  opportunities: {
    list: () => fetchWithAuth('/opportunities'),
  },
  projects: {
    list: () => fetchWithAuth('/projects'),
    create: (data: any) => fetchWithAuth('/projects', { method: 'POST', body: JSON.stringify(data) }),
  },
  ideas: {
    list: () => fetchWithAuth('/ideas'),
    create: (data: any) => fetchWithAuth('/ideas', { method: 'POST', body: JSON.stringify(data) }),
  },
  scripts: {
    get: (projectId: string) => fetchWithAuth(`/scripts/${projectId}`),
    update: (projectId: string, scriptData: any) => fetchWithAuth(`/scripts/${projectId}`, { method: 'PUT', body: JSON.stringify(scriptData) }),
    generateHooks: (data: any) => fetchWithAuth(`/scripts/generate-hooks`, { method: 'POST', body: JSON.stringify(data) }),
    regenerateSection: (data: any) => fetchWithAuth(`/scripts/regenerate-section`, { method: 'POST', body: JSON.stringify(data) }),
    revisions: (projectId: string) => fetchWithAuth(`/scripts/${projectId}/revisions`),
  },
  assets: {
    requestUpload: (data: any) => fetchWithAuth('/assets/request-upload', { method: 'POST', body: JSON.stringify(data) }),
    confirmUpload: (assetId: string) => fetchWithAuth(`/assets/${assetId}/confirm-upload`, { method: 'POST' }),
    listByProject: (projectId: string) => fetchWithAuth(`/assets/project/${projectId}`)
  },
  jobs: {
    getByResource: (resourceId: string) => fetchWithAuth(`/jobs/resource/${resourceId}`),
    get: (jobId: string) => fetchWithAuth(`/jobs/${jobId}`)
  },
  editor: {
    getDocument: (clipId: string) => fetchWithAuth(`/editor/${clipId}`),
    saveDocument: (clipId: string, data: any) => fetchWithAuth(`/editor/${clipId}`, { method: 'POST', body: JSON.stringify(data) }),
    aiEdit: (data: any) => fetchWithAuth(`/editor/ai-edit`, { method: 'POST', body: JSON.stringify(data) })
  },
  analytics: {
    getStats: (resourceId: string) => fetchWithAuth(`/analytics/stats/${resourceId}`),
    getInsights: () => fetchWithAuth(`/analytics/insights`)
  }
};
