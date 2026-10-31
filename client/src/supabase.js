import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lsigiqfrfizybpfcywkz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaWdpcWZyZml6eWJwZmN5d2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MjY2MjUsImV4cCI6MjEwOTAwMjYyNX0.TklTXt_j4gHZKAZWdKyiNvBJiq7dZbco17DleJbSF_o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAuth = {
  // Sign Up with Email and Password
  async signUp({ email, password, name, phone, role, pharmacyName, licenseNumber }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone: phone || '',
          role: 'buyer',
          pharmacy_name: pharmacyName || '',
          license_number: licenseNumber || ''
        }
      }
    });
    if (error) throw error;
    return data;
  },

  // Sign In with Email and Password
  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  // Sign Out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current active session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get current user
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Resend confirmation email
  async resendConfirmation(email) {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email
    });
    if (error) throw error;
    return data;
  }
};
