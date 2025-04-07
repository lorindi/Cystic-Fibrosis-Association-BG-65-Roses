'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, GET_USERS_BY_ROLE, GET_USER } from "@/lib/apollo/queries";
import { SET_USER_ROLE, ADD_USER_TO_GROUP, REMOVE_USER_FROM_GROUP } from "@/lib/apollo/mutations";
import { User, UserRole, UserGroup } from "@/lib/apollo/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search,
  PlusCircle,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// Импортираме компонентите от features/users
import {
  UsersTable,
  UserProfile,
  EditUserForm,
  UserStats,
  DeactivateUserDialog,
  userFormSchema
} from "../features/users";
import type { UserFormValues } from "../features/users";

export default function UsersContent() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  
  // Fake current user - в реалния случай това ще идва от auth context или подобен източник
  const currentUserRole = UserRole.ADMIN; // За тестови цели приемаме, че сме админ
  
  // Fetch users data
  const { data: allUsersData, loading: allUsersLoading, error: allUsersError } = useQuery(GET_USERS);
  
  // Fetch users by role if a role is selected
  const { data: filteredUsersData, loading: filteredUsersLoading } = useQuery(GET_USERS_BY_ROLE, {
    variables: { role: selectedRole },
    skip: !selectedRole,
  });

  // Fetch single user details when needed for profile view
  const { data: userData, loading: userLoading, refetch: refetchUserData } = useQuery(GET_USER, {
    variables: { id: selectedUser },
    skip: !selectedUser,
  });

  const [setUserRole, { loading: setRoleLoading }] = useMutation(SET_USER_ROLE, {
    refetchQueries: selectedUser 
      ? [{ query: GET_USERS }, { query: GET_USER, variables: { id: selectedUser } }]
      : [{ query: GET_USERS }],
    onCompleted: () => {
      // Актуализирай данните за текущия потребител, ако гледаме профила
      if (viewProfileOpen && selectedUser) {
        // Изпълни повторна заявка за актуализиране на данните в профила
        refetchUserData();
      }
    }
  });

  // Set up the ADD_USER_TO_GROUP mutation
  const [addUserToGroup, { loading: addToGroupLoading }] = useMutation(ADD_USER_TO_GROUP, {
    refetchQueries: selectedUser 
      ? [{ query: GET_USERS }, { query: GET_USER, variables: { id: selectedUser } }]
      : [{ query: GET_USERS }],
    onCompleted: () => {
      // Актуализирай данните за текущия потребител, ако гледаме профила
      if (viewProfileOpen && selectedUser) {
        refetchUserData();
      }
    }
  });

  // Set up the REMOVE_USER_FROM_GROUP mutation
  const [removeUserFromGroup, { loading: removeFromGroupLoading }] = useMutation(REMOVE_USER_FROM_GROUP, {
    refetchQueries: selectedUser 
      ? [{ query: GET_USERS }, { query: GET_USER, variables: { id: selectedUser } }]
      : [{ query: GET_USERS }],
    onCompleted: () => {
      // Актуализирай данните за текущия потребител, ако гледаме профила
      if (viewProfileOpen && selectedUser) {
        refetchUserData();
      }
    }
  });

  // Use filtered data if a role is selected, otherwise use all users
  const users = selectedRole ? filteredUsersData?.getUsersByRole : allUsersData?.getUsers;
  const isLoading = allUsersLoading || filteredUsersLoading || setRoleLoading;
  const selectedUserData = userData?.getUser;

  // Handle form submission
  function onSubmit(data: UserFormValues) {
    console.log("Form submitted:", data);
    // Тук може да имплементирате мутацията за обновяване на потребителя
    setEditDetailsOpen(false);
  }

  // Error handling
  if (allUsersError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error loading users: {allUsersError.message}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Filter users by search term
  const filteredUsers = users?.filter((user: User) => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  // Counts for stats cards
  const userCounts = {
    total: allUsersData?.getUsers?.length || 0,
    patient: allUsersData?.getUsers?.filter((u: User) => u.role === UserRole.PATIENT).length || 0,
    parent: allUsersData?.getUsers?.filter((u: User) => u.role === UserRole.PARENT).length || 0,
    donor: allUsersData?.getUsers?.filter((u: User) => u.role === UserRole.DONOR).length || 0,
  };

  // Calculate percentages
  const getPercentage = (count: number) => {
    return userCounts.total > 0 ? Math.round((count / userCounts.total) * 100) : 0;
  };

  // Function to handle role change
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await setUserRole({
        variables: {
          userId,
          role: newRole
        }
      });
      // Успешно обновихме ролята, данните вече са обновени чрез onCompleted
    } catch (error) {
      console.error("Error changing user role:", error);
      // You could add toast notifications here
    }
  };

  // Functions to handle user actions
  const handleViewProfile = (userId: string) => {
    setSelectedUser(userId);
    
    // Логваме за дебъгване
    console.log("Selected user ID:", userId);
    
    // Правим директен refetch на данните преди да отворим модала
    refetchUserData({ id: userId }).then(result => {
      console.log("Refetched user data:", result.data?.getUser);
      if (result.data?.getUser) {
        // Данните са заредени, отваряме модала
        setViewProfileOpen(true);
      } else {
        console.error("Failed to load user data after direct refetch");
      }
    }).catch(error => {
      console.error("Error refetching user data:", error);
    });
  };

  const handleEditDetails = (userId: string) => {
    setSelectedUser(userId);
    setEditDetailsOpen(true);
  };

  const handleDeactivateAccount = (userId: string) => {
    setSelectedUser(userId);
    setDeactivateDialogOpen(true);
  };

  const confirmDeactivateAccount = async () => {
    // Here you would call the actual deactivation mutation
    console.log("Deactivating user with ID:", selectedUser);
    // Close dialog and reset
    setDeactivateDialogOpen(false);
    setSelectedUser(null);
  };

  // Function for role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return "destructive";
      case UserRole.PATIENT:
        return "default";
      case UserRole.PARENT:
        return "secondary";
      case UserRole.DONOR:
        return "outline";
      default:
        return "default";
    }
  };

  // Function to translate role to display name
  const translateRole = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return "Administrator";
      case UserRole.PATIENT:
        return "Patient";
      case UserRole.PARENT:
        return "Parent";
      case UserRole.DONOR:
        return "Donor";
      default:
        return role;
    }
  };

  // Function to handle adding user to a group
  const handleAddToGroup = async (userId: string, group: UserGroup) => {
    try {
      await addUserToGroup({
        variables: {
          userId,
          group
        }
      });
    } catch (error) {
      console.error("Error adding user to group:", error);
      // You could add toast notifications here
    }
  };

  // Function to handle removing user from a group
  const handleRemoveFromGroup = async (userId: string, group: UserGroup) => {
    try {
      await removeUserFromGroup({
        variables: {
          userId,
          group
        }
      });
    } catch (error) {
      console.error("Error removing user from group:", error);
      // You could add toast notifications here
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter by Role
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={selectedRole || ""} onValueChange={(value) => setSelectedRole(value || null)}>
                    <DropdownMenuRadioItem value="">All Users</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={UserRole.PATIENT}>Patients</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={UserRole.PARENT}>Parents</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={UserRole.DONOR}>Donors</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={UserRole.ADMIN}>Administrators</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="rounded-md border">
              <UsersTable 
                users={filteredUsers}
                isLoading={isLoading}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
                onViewProfile={handleViewProfile}
                onEditDetails={handleEditDetails}
                onDeactivateAccount={handleDeactivateAccount}
                translateRole={translateRole}
                getRoleBadgeVariant={getRoleBadgeVariant}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <UserStats 
        totalUsers={userCounts.total}
        patientCount={userCounts.patient}
        parentCount={userCounts.parent}
        donorCount={userCounts.donor}
        getPercentage={getPercentage}
      />

      {/* View Profile Dialog */}
      <UserProfile 
        open={viewProfileOpen}
        onOpenChange={(isOpen) => {
          setViewProfileOpen(isOpen);
          // Ако модалът се затваря, нулираме избрания потребител
          if (!isOpen) {
            setSelectedUser(null);
          }
        }}
        user={selectedUserData}
        loading={userLoading}
        currentUserRole={currentUserRole}
        onRoleChange={handleRoleChange}
        onAddToGroup={handleAddToGroup}
        onRemoveFromGroup={handleRemoveFromGroup}
        translateRole={translateRole}
        getRoleBadgeVariant={getRoleBadgeVariant}
        addToGroupLoading={addToGroupLoading}
        removeFromGroupLoading={removeFromGroupLoading}
        setRoleLoading={setRoleLoading}
      />

      {/* Edit User Form Dialog */}
      <EditUserForm 
        open={editDetailsOpen}
        onOpenChange={setEditDetailsOpen}
        user={selectedUserData}
        loading={userLoading}
        onSubmit={onSubmit}
      />
      
      {/* Deactivate Account Dialog */}
      <DeactivateUserDialog 
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
        onConfirm={confirmDeactivateAccount}
      />
    </div>
  );
} 