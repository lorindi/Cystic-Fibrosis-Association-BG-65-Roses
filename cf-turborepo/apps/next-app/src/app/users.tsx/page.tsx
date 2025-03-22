// apps/next-app/app/users/page.tsx
import { createAdapter } from '../../utils/adapter-factory';
import Link from 'next/link';

export default async function UsersPage() {
  const apiService = await createAdapter('nest');
  const users = await apiService.getUsers();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <Link href="/" className="text-blue-500 underline block mb-4">Back to Home</Link>
      
      <div className="grid gap-4">
        {users.map((user: {id: string; name: string; email: string; role: string}) => (
          <div key={user.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p>{user.email}</p>
            <p>Role: {user.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}