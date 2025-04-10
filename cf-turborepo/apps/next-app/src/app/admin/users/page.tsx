'use client';

import { useUsers } from '@/hooks/admin/useUsers';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table/data-table';
import { createColumns } from '@/components/ui/data-table/columns';
import { useState } from 'react';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';
import { UserStats } from "./components/user-stats"
import { EditUserDialog } from "./components/edit-user-dialog";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  
  const { users, loading, error } = useUsers({
    limit: pageSize,
    offset: (page - 1) * pageSize
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const roleFilters = [
    { label: "Administrator", value: "admin" },
    { label: "Patient", value: "patient" },
    { label: "Parent", value: "parent" },
    { label: "Donor", value: "donor" },
  ];

  const userActions = [
    {
      label: "Edit Profile",
      onClick: (user: User) => {
        setEditingUser(user);
        setDialogOpen(true);
      },
    },
    {
      label: "Deactivate Account",
      onClick: (user: User) => {
        // Тук ще добавим логика за деактивиране
        console.log("Deactivate user:", user._id);
      },
      variant: "destructive" as const,
    },
  ];

  const handleUserUpdated = () => {
    // Refresh data after update
    router.refresh();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <UserStats users={users} />
      </div>
      <DataTable 
        columns={createColumns(columns)} 
        data={users} 
        searchKey="email"
        filters={[
          {
            key: "role",
            label: "Role",
            options: roleFilters,
          }
        ]}
        actions={userActions}
        pagination={{
          page,
          pageSize,
          onPageChange: setPage,
          onPageSizeChange: handlePageSizeChange
        }}
      />
      
      <EditUserDialog 
        user={editingUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleUserUpdated}
      />
    </div>
  );
}

