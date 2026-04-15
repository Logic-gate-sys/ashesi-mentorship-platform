// tests/ABAC.test.ts
import { describe, it, expect } from 'vitest';
import { checkAccess, User, Resource } from '../app/_utils/abac'; // relative path

describe('ABAC Utilities', () => {
  const admin: User = { id: '1', role: 'ADMIN' };
  const student: User = { id: '2', role: 'STUDENT' };
  const alumni: User = { id: '3', role: 'ALUMNI' };
  const resource: Resource = { ownerId: '2' };

  it('ADMIN can access any resource', () => {
    expect(checkAccess(admin, resource, 'delete')).toBe(true);
  });

  it('STUDENT can read their own resource', () => {
    expect(checkAccess(student, resource, 'read')).toBe(true);
  });

  it('STUDENT cannot update resource they do not own', () => {
    expect(checkAccess(student, resource, 'update')).toBe(false);
  });

  it('ALUMNI can update their own resource', () => {
    const alumniResource: Resource = { ownerId: '3' };
    expect(checkAccess(alumni, alumniResource, 'update')).toBe(true);
  });
});