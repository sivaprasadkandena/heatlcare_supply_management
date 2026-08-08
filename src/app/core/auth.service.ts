import { Injectable, signal } from '@angular/core';
import { AppUser, SessionUser, UserRole } from './models';

interface RegistrationInput {
  name: string;
  organization: string;
  username: string;
  password: string;
  role: 'hospital' | 'pharmacy';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usersKey = 'medsync.users';
  private readonly sessionKey = 'medsync.session';
  readonly users = signal<AppUser[]>(this.read<AppUser[]>(this.usersKey, this.seedUsers()));
  readonly currentUser = signal<SessionUser | null>(this.read<SessionUser | null>(this.sessionKey, null));

  login(username: string, password: string): { success: boolean; message?: string } {
    const account = this.users().find((user) => user.username.toLowerCase() === username.trim().toLowerCase());
    if (!account || account.password !== password) return { success: false, message: 'Incorrect username or password.' };
    if (account.status === 'pending') return { success: false, message: 'Your registration is awaiting administrator approval.' };
    if (account.status === 'declined') return { success: false, message: 'This registration was declined. Contact MedSync support.' };
    const { password: _password, ...session } = account;
    this.currentUser.set(session);
    this.write(this.sessionKey, session);
    return { success: true };
  }

  register(input: RegistrationInput): { success: boolean; message: string } {
    const username = input.username.trim().toLowerCase();
    if (this.users().some((user) => user.username.toLowerCase() === username)) {
      return { success: false, message: 'That username is already in use.' };
    }
    const account: AppUser = {
      id: this.id('USR'),
      name: input.name.trim(),
      organization: input.organization.trim(),
      username,
      password: input.password,
      role: input.role,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.users.update((users) => [...users, account]);
    this.persistUsers();
    return { success: true, message: 'Registration submitted. An administrator must approve your organisation before you can sign in.' };
  }

  updateRegistration(userId: string, status: 'approved' | 'declined'): void {
    this.users.update((users) => users.map((user) => user.id === userId ? { ...user, status } : user));
    this.persistUsers();
  }

  deleteUser(userId: string): void {
    this.users.update((users) => users.filter((user) => user.id !== userId));
    this.persistUsers();
  }

  logout(): void {
    this.currentUser.set(null);
    this.remove(this.sessionKey);
  }

  userById(id: string): AppUser | undefined {
    return this.users().find((user) => user.id === id);
  }

  usersForRole(role: UserRole): AppUser[] {
    return this.users().filter((user) => user.role === role && user.status === 'approved');
  }

  private persistUsers(): void {
    this.write(this.usersKey, this.users());
  }

  private seedUsers(): AppUser[] {
    return [
      { id: 'admin-001', name: 'Arjun Nair', organization: 'MedSync Platform', username: 'admin', password: 'admin', role: 'admin', status: 'approved', createdAt: '2026-01-01T09:00:00.000Z' },
      { id: 'hospital-001', name: 'Dr. Meera Shah', organization: 'City General Hospital', username: 'hospital', password: 'hospital', role: 'hospital', status: 'approved', createdAt: '2026-01-14T09:00:00.000Z' },
      { id: 'pharmacy-001', name: 'Rohan Desai', organization: 'CarePoint Pharma', username: 'pharmacy', password: 'pharmacy', role: 'pharmacy', status: 'approved', createdAt: '2026-02-02T09:00:00.000Z' },
    ];
  }

  private read<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) as T : fallback;
    } catch {
      return fallback;
    }
  }

  private write(key: string, value: unknown): void {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(value));
  }

  private remove(key: string): void {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key);
  }

  private id(prefix: string): string {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
  }
}
