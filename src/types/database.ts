export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface UserRole {
  user_id: string;
  role_id: string;
  roles: Role;
}

export interface UserRolesResponse {
  data: UserRole | null;
  error: Error | null;
} 