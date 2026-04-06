// app/_utils/abac.ts

export type Role = 'STUDENT' | 'ALUMNI' | 'ADMIN';

export interface User {
  id: string;
  role: Role;
  [key: string]: any;
}

export interface Resource {
  ownerId?: string;
  [key: string]: any;
}

/**
 * Simple ABAC function example
 * @param user - the user trying to access
 * @param resource - the resource being accessed
 * @param action - the action user wants to perform
 */
export function checkAccess(user: User, resource: Resource, action: string): boolean {
  // ADMINs can do anything
  if (user.role === 'ADMIN') return true;

  // STUDENT can only read their own resources
  if (user.role === 'STUDENT' && action === 'read') {
    return resource.ownerId === user.id;
  }

  // ALUMNI example: can update their own profile
  if (user.role === 'ALUMNI' && action === 'update') {
    return resource.ownerId === user.id;
  }

  return false; // default deny
}