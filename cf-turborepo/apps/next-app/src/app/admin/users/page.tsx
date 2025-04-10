'use client';

import { useUsers } from '@/hooks/admin/useUsers';
import { User } from '@/types/user';

export default function UsersPage() {
  const { users, loading, error } = useUsers();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Users</h1>
      <div className="grid gap-4">
        {users.map((user: User) => (
          <div key={user._id} className="p-4 border rounded">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>Role: {user.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

