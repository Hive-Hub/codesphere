export interface TeacherProfile {
  teacher_id: number;
  name: string;
  email: string;
  college: string;
  department: string;
  subject: string;
  created_at?: string;
}

const TOKEN_KEY = 'codesphere_teacher_token';
const PROFILE_KEY = 'codesphere_teacher_profile';

export const teacherAuthStore = {
  getToken: (): string | null => {
    try {
      return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token: string) => {
    try {
      sessionStorage.setItem(TOKEN_KEY, token);
    } catch {}
  },

  getProfile: (): TeacherProfile | null => {
    try {
      const raw = sessionStorage.getItem(PROFILE_KEY) || localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setProfile: (profile: TeacherProfile) => {
    try {
      sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {}
  },

  clear: () => {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(PROFILE_KEY);
    } catch {}
  }
};
