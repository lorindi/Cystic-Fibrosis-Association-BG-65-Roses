'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, GET_USERS_BY_ROLE, GET_USER } from "@/lib/apollo/queries";
import { SET_USER_ROLE } from "@/lib/apollo/mutations";
import { User, UserRole } from "@/lib/apollo/types";
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
  X
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

export default function UsersContent() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  
  // Fetch users data
  const { data: allUsersData, loading: allUsersLoading, error: allUsersError } = useQuery(GET_USERS);
  
  // Fetch users by role if a role is selected
  const { data: filteredUsersData, loading: filteredUsersLoading } = useQuery(GET_USERS_BY_ROLE, {
    variables: { role: selectedRole },
    skip: !selectedRole,
  });

  // Fetch single user details when needed for profile view
  const { data: userData, loading: userLoading } = useQuery(GET_USER, {
    variables: { id: selectedUser },
    skip: !selectedUser,
  });

  const [setUserRole, { loading: setRoleLoading }] = useMutation(SET_USER_ROLE, {
    refetchQueries: [{ query: GET_USERS }],
  });

  // Use filtered data if a role is selected, otherwise use all users
  const users = selectedRole ? filteredUsersData?.getUsersByRole : allUsersData?.getUsers;
  const isLoading = allUsersLoading || filteredUsersLoading || setRoleLoading;
  const selectedUserData = userData?.getUser;

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
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No users found with the current filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers?.map((user: User) => (
                        <TableRow key={user._id}>
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
                                <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                {Object.values(UserRole).map((role) => (
                                  <DropdownMenuItem 
                                    key={role}
                                    onClick={() => handleRoleChange(user._id, role as UserRole)}
                                    disabled={user.role === role || setRoleLoading}
                                  >
                                    {role === user.role ? `Current: ${translateRole(role)}` : translateRole(role)}
                                  </DropdownMenuItem>
                                ))}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Joined</h4>
                  <p>{selectedUserData.createdAt ? formatDate(selectedUserData.createdAt) : "N/A"}</p>
                </div>
                {selectedUserData.profile?.birthDate && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Date of Birth</h4>
                    <p>{formatDate(selectedUserData.profile.birthDate)}</p>
                  </div>
                )}
                {selectedUserData.profile?.diagnosed !== undefined && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Diagnosis Status</h4>
                    <p>{selectedUserData.profile.diagnosed ? "Diagnosed with CF" : "Not diagnosed"}</p>
                  </div>
                )}
                {selectedUserData.profile?.diagnosisYear && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Diagnosis Year</h4>
                    <p>{selectedUserData.profile.diagnosisYear}</p>
                  </div>
                )}
                {selectedUserData.profile?.childName && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Child's Name</h4>
                    <p>{selectedUserData.profile.childName}</p>
                  </div>
                )}
                {selectedUserData.profile?.companyName && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Company</h4>
                    <p>{selectedUserData.profile.companyName}</p>
                  </div>
                )}
              </div>

              {selectedUserData.profile?.address && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Address</h4>
                  <p>{selectedUserData.profile.address.street}</p>
                  <p>{selectedUserData.profile.address.city} {selectedUserData.profile.address.postalCode}</p>
                </div>
              )}

              {selectedUserData.profile?.contact && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h4>
                  {selectedUserData.profile.contact.phone && (
                    <p className="mb-1">
                      <span className="font-medium">Phone:</span> {selectedUserData.profile.contact.phone}
                    </p>
                  )}
                  {selectedUserData.profile.contact.alternativeEmail && (
                    <p className="mb-1">
                      <span className="font-medium">Alternative Email:</span> {selectedUserData.profile.contact.alternativeEmail}
                    </p>
                  )}
                  {selectedUserData.profile.contact.emergencyContact && (
                    <div className="mt-2">
                      <h5 className="text-sm font-medium">Emergency Contact</h5>
                      <p className="ml-2">{selectedUserData.profile.contact.emergencyContact.name} ({selectedUserData.profile.contact.emergencyContact.relation})</p>
                      <p className="ml-2">{selectedUserData.profile.contact.emergencyContact.phone}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedUserData.profile?.bio && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Bio</h4>
                  <p className="text-sm">{selectedUserData.profile.bio}</p>
                </div>
              )}
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
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input 
                    id="name" 
                    defaultValue={selectedUserData?.name || ""}
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input 
                    id="email" 
                    defaultValue={selectedUserData?.email || ""}
                    placeholder="Email address"
                  />
                </div>
                
                {selectedUserData?.role === UserRole.PATIENT && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="birthDate" className="text-sm font-medium">
                        Date of Birth
                      </label>
                      <Input 
                        id="birthDate" 
                        type="date"
                        defaultValue={selectedUserData?.profile?.birthDate ? 
                          new Date(selectedUserData.profile.birthDate).toISOString().split('T')[0] : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="diagnosisYear" className="text-sm font-medium">
                        Diagnosis Year
                      </label>
                      <Input 
                        id="diagnosisYear" 
                        type="number"
                        defaultValue={selectedUserData?.profile?.diagnosisYear || ""}
                        placeholder="Year of diagnosis"
                      />
                    </div>
                  </>
                )}
                
                {selectedUserData?.role === UserRole.PARENT && (
                  <div className="space-y-2">
                    <label htmlFor="childName" className="text-sm font-medium">
                      Child's Name
                    </label>
                    <Input 
                      id="childName" 
                      defaultValue={selectedUserData?.profile?.childName || ""}
                      placeholder="Child's name"
                    />
                  </div>
                )}
                
                {selectedUserData?.role === UserRole.DONOR && (
                  <div className="space-y-2">
                    <label htmlFor="companyName" className="text-sm font-medium">
                      Company Name
                    </label>
                    <Input 
                      id="companyName" 
                      defaultValue={selectedUserData?.profile?.companyName || ""}
                      placeholder="Company name"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input 
                  id="phone" 
                  defaultValue={selectedUserData?.profile?.contact?.phone || ""}
                  placeholder="Phone number"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <Input 
                  id="street" 
                  defaultValue={selectedUserData?.profile?.address?.street || ""}
                  placeholder="Street"
                  className="mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    id="city" 
                    defaultValue={selectedUserData?.profile?.address?.city || ""}
                    placeholder="City"
                  />
                  <Input 
                    id="postalCode" 
                    defaultValue={selectedUserData?.profile?.address?.postalCode || ""}
                    placeholder="Postal code"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </label>
                <textarea 
                  id="bio" 
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  defaultValue={selectedUserData?.profile?.bio || ""}
                  placeholder="User bio"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setEditDetailsOpen(false)} variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </DialogFooter>
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