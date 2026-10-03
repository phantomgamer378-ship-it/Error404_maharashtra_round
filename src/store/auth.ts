import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar: string | null;
  bio: string | null;
  language: string | null;
}

interface CreatorDNA {
  id: string;
  user_id: string;
  niche: string[];
  topics: string[];
  audience: string;
  tone: string;
  communication_style: string;
  platforms: string[];
  goals: string[];
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  dna: CreatorDNA | null;
  isLoading: boolean;
  isOnboarded: boolean;
  
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setDna: (dna: CreatorDNA | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  dna: null,
  isLoading: true,
  isOnboarded: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        set({ user: null, profile: null, dna: null, isLoading: false, isOnboarded: false });
        return;
      }

      set({ user: session.user });

      // In a real app, this would fetch from /api/v1/me which combines this data
      // For Phase 2, we simulate fetching the profile & dna status from DB
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
        
      const { data: dna } = await supabase
        .from('creator_dna')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      set({ 
        profile: profile || null, 
        dna: dna || null,
        isOnboarded: !!profile && !!dna,
        isLoading: false
      });
      
    } catch (error) {
      console.error('Auth initialization failed:', error);
      set({ isLoading: false });
    }
  },

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setDna: (dna) => set({ dna }),
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, dna: null, isOnboarded: false });
  }
}));

// Setup listener for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    useAuthStore.getState().initialize();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.getState().setUser(null);
  }
});
