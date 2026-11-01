import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://lsigiqfrfizybpfcywkz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || process.env.VITE_SUPABASE_ANON_KEY
  || 'sb_publishable_nSqLvKybBig4tB00qNxx2w_6Vs0Lc5x';

let supabaseInstance = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

export const supabase = getSupabase();

export const supabaseAuth = {
  async signUp({ email, password, name, phone, role = 'buyer' }) {
    const client = getSupabase();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone: phone || '',
          role
        }
      }
    });
    if (error) throw error;
    return data;
  },

  async signIn({ email, password }) {
    const client = getSupabase();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const client = getSupabase();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const client = getSupabase();
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getUser() {
    const client = getSupabase();
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  async onAuthStateChange(callback) {
    const client = getSupabase();
    const { data } = client.auth.onAuthStateChange(callback);
    return data.subscription;
  },

  async resendConfirmation(email) {
    const client = getSupabase();
    const { data, error } = await client.auth.resend({ type: 'signup', email });
    if (error) throw error;
    return data;
  }
};
