const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lsigiqfrfizybpfcywkz.supabase.co';
// Prefer the current publishable key, while keeping deployments that still
// provide the project's legacy anon key working.
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || import.meta.env.VITE_SUPABASE_ANON_KEY
  || 'sb_publishable_nSqLvKybBig4tB00qNxx2w_6Vs0Lc5x';

let clientPromise;
const getClient = () => {
  clientPromise ||= import('@supabase/supabase-js').then(({ createClient }) => createClient(supabaseUrl, supabaseAnonKey));
  return clientPromise;
};

export const supabaseAuth = {
  async signUp({ email, password, name, phone, pharmacyName, licenseNumber }) {
    const client = await getClient();
    const { data, error } = await client.auth.signUp({
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

  async signIn({ email, password }) {
    const client = await getClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const client = await getClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const client = await getClient();
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getUser() {
    const client = await getClient();
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  async onAuthStateChange(callback) {
    const client = await getClient();
    const { data, error } = client.auth.onAuthStateChange(callback);
    if (error) throw error;
    return data.subscription;
  },

  async resendConfirmation(email) {
    const client = await getClient();
    const { data, error } = await client.auth.resend({ type: 'signup', email });
    if (error) throw error;
    return data;
  }
};
