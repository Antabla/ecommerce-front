export interface User {
  name: string;
  email: string;
  role: 'admin' | 'client';
  token: string;
}
