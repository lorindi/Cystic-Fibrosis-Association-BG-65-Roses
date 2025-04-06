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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users as UsersIcon,
  Search,
  MoreHorizontal,
  PlusCircle,
  Filter,
  Loader2,
  X,
  ChevronRight,
  ChevronDown,
  Calendar,
  Users,
  BadgeDollarSign,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React from "react";

// Добавяме схема за валидиране на формата в началото на файла, преди компонента
const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name should be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  birthDate: z.string().optional(),
  diagnosisYear: z.string().optional(),
  childName: z.string().optional(),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  bio: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function UsersContent() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [manageGroupsOpen, setManageGroupsOpen] = useState(false);
  
  // Fake current user - в реалния случай това ще идва от auth context или подобен източник
  const currentUserRole = UserRole.ADMIN; // За тестови цели приемаме, че сме админ
  const isCurrentUserAdmin = currentUserRole === UserRole.ADMIN;
  
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
        // Изпълни повторна заявка за актуализиране на данните в профила
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
        // Изпълни повторна заявка за актуализиране на данните в профила
        refetchUserData();
      }
    }
  });

  // Use filtered data if a role is selected, otherwise use all users
  const users = selectedRole ? filteredUsersData?.getUsersByRole : allUsersData?.getUsers;
  const isLoading = allUsersLoading || filteredUsersLoading || setRoleLoading;
  const selectedUserData = userData?.getUser;

  // Form
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      birthDate: "",
      diagnosisYear: "",
      childName: "",
      companyName: "",
      phone: "",
      street: "",
      city: "",
      postalCode: "",
      bio: "",
    },
  });

  // Effect to update form values when selected user changes
  React.useEffect(() => {
    if (selectedUserData) {
      form.reset({
        name: selectedUserData.name || "",
        email: selectedUserData.email || "",
        birthDate: selectedUserData.profile?.birthDate 
          ? new Date(selectedUserData.profile.birthDate).toISOString().split('T')[0] 
          : "",
        diagnosisYear: selectedUserData.profile?.diagnosisYear?.toString() || "",
        childName: selectedUserData.profile?.childName || "",
        companyName: selectedUserData.profile?.companyName || "",
        phone: selectedUserData.profile?.contact?.phone || "",
        street: selectedUserData.profile?.address?.street || "",
        city: selectedUserData.profile?.address?.city || "",
        postalCode: selectedUserData.profile?.address?.postalCode || "",
        bio: selectedUserData.profile?.bio || "",
      });
    }
  }, [selectedUserData, form]);

  // Handle form submission
  function onSubmit(data: z.infer<typeof userFormSchema>) {
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
    setViewProfileOpen(true);
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

  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (e) {
      return dateString;
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
      // Ако добавяме група от профила, актуализирайте го
      if (viewProfileOpen && userId === selectedUser) {
        await refetchUserData();
      }
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
      // Ако премахваме група от профила, актуализирайте го
      if (viewProfileOpen && userId === selectedUser) {
        await refetchUserData();
      }
    } catch (error) {
      console.error("Error removing user from group:", error);
      // You could add toast notifications here
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Users</h2>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage system users</CardDescription>
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
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No users found with the current filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers?.map((user: User) => (
                        <React.Fragment key={user._id}>
                          <TableRow 
                            className="cursor-pointer hover:bg-muted/50" 
                            onClick={() => {
                              if (selectedUser === user._id) {
                                setSelectedUser(null);
                              } else {
                                setSelectedUser(user._id);
                              }
                            }}
                          >
                            <TableCell className="pr-0 w-[50px]">
                              <div className="flex items-center justify-center text-muted-foreground">
                                {selectedUser === user._id ? 
                                  <ChevronDown className="h-4 w-4 text-primary" /> : 
                                  <ChevronRight className="h-4 w-4" />
                                }
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{user._id.substring(0, 8)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  {user.profile?.avatar ? (
                                    <AvatarImage src={user.profile.avatar} alt={user.name} />
                                  ) : null}
                                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRoleBadgeVariant(user.role)}>
                                {translateRole(user.role)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div className={`h-2 w-2 rounded-full mr-2 ${
                                  user.isEmailVerified ? "bg-green-500" : "bg-yellow-500"
                                }`} />
                                {user.isEmailVerified ? "Verified" : "Pending"}
                              </div>
                            </TableCell>
                            <TableCell>{user.createdAt ? formatDate(user.createdAt) : "N/A"}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleViewProfile(user._id)}>
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditDetails(user._id)}>
                                    Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeactivateAccount(user._id)}
                                  >
                                    Deactivate Account
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                          
                          {/* Expandable row with groups info */}
                          {selectedUser === user._id && (
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell colSpan={6} className="p-4 bg-muted/20">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium">Допълнителна информация</h4>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-6 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewProfile(user._id);
                                      }}
                                    >
                                      View Profile
                                    </Button>
                                  </div>
                                  
                                  <div className="grid gap-3 mt-2">
                                    {user.profile?.contact?.phone && (
                                      <div>
                                        <h5 className="text-sm font-medium">Телефон:</h5>
                                        <p className="text-sm text-muted-foreground">{user.profile.contact.phone}</p>
                                      </div>
                                    )}
                                    
                                    {user.profile?.address && (
                                      <div>
                                        <h5 className="text-sm font-medium">Адрес:</h5>
                                        <p className="text-sm text-muted-foreground">
                                          {user.profile.address.street}, {user.profile.address.city} {user.profile.address.postalCode}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {user.profile?.bio && (
                                      <div>
                                        <h5 className="text-sm font-medium">Биография:</h5>
                                        <p className="text-sm text-muted-foreground">{user.profile.bio}</p>
                                      </div>
                                    )}
                                    
                                    {(!user.profile?.contact?.phone && !user.profile?.address && !user.profile?.bio) && (
                                      <p className="text-sm text-muted-foreground">Няма допълнителна информация за този потребител.</p>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-primary/10">
                  <UsersIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="mt-3 text-xl font-semibold">Total Users</h3>
              <p className="text-3xl font-bold mt-1">{userCounts.total}</p>
              {/* <p className="text-xs text-muted-foreground mt-1">+12% from last month</p> */}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="mt-3 text-xl font-semibold">Patients</h3>
              <p className="text-3xl font-bold mt-1">{userCounts.patient}</p>
              <p className="text-xs text-muted-foreground mt-1">{getPercentage(userCounts.patient)}% of all users</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <UsersIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="mt-3 text-xl font-semibold">Parents</h3>
              <p className="text-3xl font-bold mt-1">{userCounts.parent}</p>
              <p className="text-xs text-muted-foreground mt-1">{getPercentage(userCounts.parent)}% of all users</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-amber-100">
                  <UsersIcon className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <h3 className="mt-3 text-xl font-semibold">Donors</h3>
              <p className="text-3xl font-bold mt-1">{userCounts.donor}</p>
              <p className="text-xs text-muted-foreground mt-1">{getPercentage(userCounts.donor)}% of all users</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Profile Dialog */}
      <Dialog open={viewProfileOpen} onOpenChange={setViewProfileOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              User Profile
            </DialogTitle>
            <DialogDescription>
              Detailed information about {selectedUserData?.name}
            </DialogDescription>
          </DialogHeader>

          {userLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : selectedUserData ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  {selectedUserData.profile?.avatar ? (
                    <AvatarImage src={selectedUserData.profile.avatar} alt={selectedUserData.name} />
                  ) : null}
                  <AvatarFallback className="text-xl">{selectedUserData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUserData.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUserData.email}</p>
                  <div className="flex items-center mt-1">
                    <Badge variant={getRoleBadgeVariant(selectedUserData.role)}>{translateRole(selectedUserData.role)}</Badge>
                    {selectedUserData.isEmailVerified && (
                      <Badge variant="outline" className="ml-2">Verified</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Change user role */}
              {isCurrentUserAdmin && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {/* Показваме текущата роля, но със запълнен цвят */}
                    <Button 
                      key={selectedUserData.role}
                      variant="default"
                      size="sm"
                    >
                      {translateRole(selectedUserData.role)}
                    </Button>
                    
                    {/* Показваме останалите роли като опции, но без ADMIN */}
                    {Object.values(UserRole)
                      .filter(role => role !== selectedUserData.role && role !== UserRole.ADMIN)
                      .map((role: UserRole) => (
                        <Button 
                          key={role}
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRoleChange(selectedUserData._id, role as UserRole)}
                          disabled={setRoleLoading}
                        >
                          {translateRole(role)}
                        </Button>
                      ))
                    }
                  </div>
                </div>
              )}

              {/* Groups management */}
              {selectedUserData.groups && selectedUserData.groups.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Groups</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUserData.groups.map((group: UserGroup) => (
                      <div key={group} className="flex items-center">
                        <Badge variant="secondary" className="mr-2">{group}</Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full" 
                          onClick={() => handleRemoveFromGroup(selectedUserData._id, group as UserGroup)}
                          disabled={removeFromGroupLoading}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove from {group}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add UI to add user to groups they're not already in */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Add to Group</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.values(UserGroup)
                    .filter(group => !selectedUserData?.groups?.includes(group))
                    .map((group: UserGroup) => (
                      <Button 
                        key={group}
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                        onClick={() => handleAddToGroup(selectedUserData._id, group as UserGroup)}
                        disabled={addToGroupLoading}
                      >
                        <PlusCircle className="h-3 w-3 mr-1" /> {group}
                      </Button>
                    ))
                  }
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              No user data available
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setViewProfileOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Details Dialog */}
      <Dialog open={editDetailsOpen} onOpenChange={setEditDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User Details</DialogTitle>
            <DialogDescription>
              Update information for {selectedUserData?.name}
            </DialogDescription>
          </DialogHeader>
          
          {userLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {selectedUserData?.role === UserRole.PATIENT && (
                    <>
                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="diagnosisYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Diagnosis Year</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Year of diagnosis"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  
                  {selectedUserData?.role === UserRole.PARENT && (
                    <FormField
                      control={form.control}
                      name="childName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child's Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Child's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {selectedUserData?.role === UserRole.DONOR && (
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <FormLabel>Address</FormLabel>
                  
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Street" {...field} className="mb-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Postal code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="User bio"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditDetailsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Deactivate Account Dialog */}
      <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the user account. The user will no longer be able to log in
              and their data will be hidden from the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeactivateAccount} className="bg-red-600">
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 