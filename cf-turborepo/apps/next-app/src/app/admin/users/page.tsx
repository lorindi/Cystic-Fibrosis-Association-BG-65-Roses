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
import { UserRole } from '@/types/user';
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<string>("all");
  const router = useRouter();
  
  const { users, loading, error, refetch } = useUsers({
    limit: pageSize,
    offset: (page - 1) * pageSize
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Преобразуваме GraphQL User типа към нашия локален User тип
  const usersData: User[] = users.map(user => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role as string,
    groups: user.groups as string[] || [],
    isEmailVerified: user.isEmailVerified,
    isActive: user.isActive || false,
    deactivatedAt: user.deactivatedAt || undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt || user.createdAt,
    profile: undefined // Опростяваме за да избегнем дълбоко вложени типове
  }));

  // Филтрираме данните преди да ги предадем на таблицата
  const filteredUsers = usersData.filter(user => {
    switch(filterValue) {
      case 'active':
        return user.isActive === true;
      case 'deactivated':
        return user.isActive === false;
      case 'admin':
        return user.role === 'admin';
      case 'patient':
        return user.role === 'patient';
      case 'parent':
        return user.role === 'parent';
      case 'donor':
        return user.role === 'donor';
      default:
        return true; // 'all' или празна стойност
    }
  });

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const combinedFilters = [
    { label: "All Users", value: "all" },
    { label: "Active Users", value: "active" },
    { label: "Deactivated Users", value: "deactivated" },
    { label: "Administrators", value: "admin" },
    { label: "Patients", value: "patient" },
    { label: "Parents", value: "parent" },
    { label: "Donors", value: "donor" },
  ];

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    setPage(1); // Връщаме се на първата страница при смяна на филтъра
  };

  const handleUserUpdated = () => {
    // Refresh data after update
    refetch();
  };

  const userActions = [
    {
      label: "Edit Profile",
      onClick: (user: User) => {
        setEditingUser(user);
        setDialogOpen(true);
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <UserStats users={usersData} />
      </div>

      <DataTable 
        columns={createColumns(columns)} 
        data={filteredUsers} 
        searchKey="email"
        customFilter={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <Filter className="mr-2 h-4 w-4" />
                {filterValue === "all" ? "Filter" : `Filtered: ${combinedFilters.find(f => f.value === filterValue)?.label}`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={filterValue}
                onValueChange={handleFilterChange}
              >
                {combinedFilters.map((option) => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        }
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

