import * as React from "react";
import { useState } from "react";
import { User, UserRole, UserGroup } from "@/lib/apollo/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronDown, ChevronRight, X, PlusCircle, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  selectedUser: string | null;
  onSelectUser: (userId: string | null) => void;
  onViewProfile: (userId: string) => void;
  onEditDetails: (userId: string) => void;
  onDeactivateAccount: (userId: string) => void;
  translateRole: (role: string) => string;
  getRoleBadgeVariant: (role: string) => string;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  selectedUser,
  onSelectUser,
  onViewProfile,
  onEditDetails,
  onDeactivateAccount,
  translateRole,
  getRoleBadgeVariant
}) => {
  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
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
        {users?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
              No users found with the current filters
            </TableCell>
          </TableRow>
        ) : (
          users?.map((user: User) => (
            <React.Fragment key={user._id}>
              <TableRow 
                className="cursor-pointer hover:bg-muted/50" 
                onClick={() => {
                  if (selectedUser === user._id) {
                    onSelectUser(null);
                  } else {
                    onSelectUser(user._id);
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
                      <DropdownMenuItem onClick={() => onViewProfile(user._id)}>
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditDetails(user._id)}>
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => onDeactivateAccount(user._id)}
                      >
                        Deactivate Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              
              {/* Expandable row with additional info */}
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
                            onViewProfile(user._id);
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
  );
}; 