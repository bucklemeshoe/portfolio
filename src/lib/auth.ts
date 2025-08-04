export class AuthService {
  private static readonly SESSION_KEY = 'admin_authenticated';
  private static readonly PASSWORD = process.env.ADMIN_PASSWORD;

  static async authenticate(password: string): Promise<boolean> {
    if (password === this.PASSWORD) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(this.SESSION_KEY, 'true');
      }
      return true;
    }
    return false;
  }

  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(this.SESSION_KEY) === 'true';
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.SESSION_KEY);
    }
  }
}