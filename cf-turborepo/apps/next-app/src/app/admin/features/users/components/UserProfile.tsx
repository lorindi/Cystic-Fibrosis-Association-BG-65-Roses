import React from "react";
import { User, UserRole, UserGroup } from "@/lib/apollo/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  loading: boolean;
  currentUserRole: UserRole;
  onRoleChange: (userId: string, role: UserRole) => Promise<void>;
  onAddToGroup: (userId: string, group: UserGroup) => Promise<void>;
  onRemoveFromGroup: (userId: string, group: UserGroup) => Promise<void>;
  translateRole: (role: string) => string;
  getRoleBadgeVariant: (role: string) => string;
  addToGroupLoading: boolean;
  removeFromGroupLoading: boolean;
  setRoleLoading: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  open,
  onOpenChange,
  user,
  loading,
  currentUserRole,
  onRoleChange,
  onAddToGroup,
  onRemoveFromGroup,
  translateRole,
  getRoleBadgeVariant,
  addToGroupLoading,
  removeFromGroupLoading,
  setRoleLoading,
}) => {
  const isCurrentUserAdmin = currentUserRole === UserRole.ADMIN;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            User Profile
          </DialogTitle>
          <DialogDescription>
            Detailed information about {user?.name}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : user ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                {user.profile?.avatar ? (
                  <AvatarImage src={user.profile.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="text-xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center mt-1">
                  <Badge variant={getRoleBadgeVariant(user.role)}>{translateRole(user.role)}</Badge>
                  {user.isEmailVerified && (
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
                    key={user.role}
                    variant="default"
                    size="sm"
                  >
                    {translateRole(user.role)}
                  </Button>
                  
                  {/* Показваме останалите роли като опции, но без ADMIN */}
                  {Object.values(UserRole)
                    .filter(role => role !== user.role && role !== UserRole.ADMIN)
                    .map((role: UserRole) => (
                      <Button 
                        key={role}
                        variant="outline" 
                        size="sm"
                        onClick={() => onRoleChange(user._id, role as UserRole)}
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
            {user.groups && user.groups.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Groups</h4>
                <div className="flex flex-wrap gap-2">
                  {user.groups.map((group: UserGroup) => (
                    <div key={group} className="flex items-center">
                      <Badge variant="secondary" className="mr-2">{group}</Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full" 
                        onClick={() => onRemoveFromGroup(user._id, group as UserGroup)}
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
                  .filter(group => !user?.groups?.includes(group))
                  .map((group: UserGroup) => (
                    <Button 
                      key={group}
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => onAddToGroup(user._id, group as UserGroup)}
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
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 