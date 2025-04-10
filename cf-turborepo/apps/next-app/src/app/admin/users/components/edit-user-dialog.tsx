import { useState, useEffect } from "react";
import { User, UserRole, UserGroup } from "@/types/user";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, X, UserCircle, MapPin, Users } from "lucide-react";
import { useMutation } from "@apollo/client";
import { 
  UPDATE_USER, 
  SET_USER_ROLE, 
  ADD_USER_TO_GROUP, 
  REMOVE_USER_FROM_GROUP 
} from "@/graphql/mutations/user.mutations";
import { 
  UpdateUserMutation, 
  UpdateUserMutationVariables, 
  SetUserRoleMutation, 
  SetUserRoleMutationVariables
} from "@/graphql/generated/graphql";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type GroupType = "initiatives" | "recipes" | "campaigns" | "news" | "conferences" | "events" | "blog";

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email"),
  phoneNumber: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional()
  }).optional(),
  bio: z.string().optional()
});

// Extract type from the schema
type UserFormValues = z.infer<typeof formSchema>;

export function EditUserDialog({ user, open, onOpenChange, onSuccess }: EditUserDialogProps) {
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole | string>("");
  const [activeTab, setActiveTab] = useState("profile");
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: {
        street: "",
        city: "",
        postalCode: ""
      },
      bio: ""
    }
  });
  
  const [updateUser, { loading: updateLoading }] = useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UPDATE_USER);
  const [setUserRole, { loading: roleLoading }] = useMutation<SetUserRoleMutation, SetUserRoleMutationVariables>(
    SET_USER_ROLE
  );
  const [addUserToGroup, { loading: addToGroupLoading }] = useMutation(ADD_USER_TO_GROUP);
  const [removeUserFromGroup, { loading: removeFromGroupLoading }] = useMutation(REMOVE_USER_FROM_GROUP);
  
  const groupsLoading = addToGroupLoading || removeFromGroupLoading;

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      // Convert user data to match our form schema
      const userData = {
        name: user.name,
        email: user.email,
        // Cast properties that might not exist in the User type but we need for our form
        phoneNumber: (user as any).phoneNumber || "",
        address: {
          street: (user as any).address?.street || "",
          city: (user as any).address?.city || "",
          postalCode: (user as any).address?.postalCode || ""
        },
        bio: (user as any).bio || ""
      };

      form.reset(userData);
      
      // Filter groups to only include valid GroupType values
      const validGroups = user.groups ? 
        user.groups.filter((group): group is GroupType => 
          ["initiatives", "recipes", "campaigns", "news", "conferences", "events", "blog"].includes(group)
        ) : [];
      
      setGroups(validGroups);
      setSelectedRole(user.role);
    }
  }, [user, form]);

  const handleRoleChange = (role: UserRole | string) => {
    // Admin can't be changed to other roles
    if (user?.role === "admin") return;
    setSelectedRole(role);
  };

  const handleRemoveGroup = (group: GroupType) => {
    if (user?._id && typeof user._id === 'string') {
      removeUserFromGroup({
        variables: {
          userId: user._id,
          group: group
        }
      }).then(() => {
        setGroups(groups.filter(g => g !== group));
      }).catch(error => {
        console.error("Error removing user from group:", error);
        toast({
          title: "Error",
          description: "Failed to remove user from group.",
          variant: "destructive"
        });
      });
    }
  };

  const handleAddGroup = (group: GroupType) => {
    if (!groups.includes(group) && user?._id && typeof user._id === 'string') {
      addUserToGroup({
        variables: {
          userId: user._id,
          group: group
        }
      }).then(() => {
        setGroups([...groups, group]);
      }).catch(error => {
        console.error("Error adding user to group:", error);
        toast({
          title: "Error",
          description: "Failed to add user to group.",
          variant: "destructive"
        });
      });
    }
  };

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
    if (!user?._id) return;
    
    try {
      // Подготвяме ProfileUpdateInput обекта само с валидни стойности
      const profileInput: any = {
        bio: data.bio,
        contact: {
          phone: data.phoneNumber || ""
        }
      };
      
      // Добавяме адрес само ако има град (задължително поле)
      if (data.address?.city) {
        profileInput.address = {
          city: data.address.city!,
          street: data.address.street || "",
          postalCode: data.address.postalCode || ""
        };
      }
      
      // Update profile with the fields that are part of ProfileUpdateInput
      await updateUser({
        variables: {
          id: user._id,
          input: profileInput
        }
      });
      
      // Update role if it changed
      if (selectedRole !== user.role) {
        await setUserRole({
          variables: {
            userId: user._id,
            role: selectedRole as UserRole
          }
        });
      }
      
      toast({
        title: "User updated",
        description: "User information has been successfully updated."
      });
      
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const availableGroups: GroupType[] = ["initiatives", "recipes", "campaigns", "news", "conferences", "events", "blog"];
  const remainingGroups = availableGroups.filter(group => !groups.includes(group));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
          <DialogDescription>
            {user ? `Update information for ${user.name}` : "Update user information"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4 justify-evenly">
                <TabsTrigger value="profile" className="flex items-center gap-1">
                  <UserCircle className="w-4 h-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Contact</span>
                </TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Roles & Groups</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="min-h-[320px]">
                <TabsContent value="profile" className="mt-0 h-full">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea placeholder="User bio" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="contact" className="mt-0 h-full">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
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
                    
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input placeholder="Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address.postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="Postal code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="roles" className="mt-0 h-full overflow-y-auto">
                  <div className="grid gap-6">
                    {/* Roles Section */}
                    {user && (
                      <div className="space-y-4">
                        <FormLabel>Roles</FormLabel>
                        <div className="flex flex-wrap gap-2 justify-evenly">
                          <Button 
                            type="button"
                            variant={selectedRole === "admin" ? "default" : "outline"} 
                            className="rounded-full" 
                            size="sm"
                            disabled={user.role !== "admin"}
                            onClick={() => handleRoleChange("admin")}
                          >
                            Administrator
                          </Button>
                          <Button 
                            type="button"
                            variant={selectedRole === "patient" ? "default" : "outline"} 
                            className="rounded-full" 
                            size="sm"
                            disabled={user.role === "admin"}
                            onClick={() => handleRoleChange("patient")}
                          >
                            Patient
                          </Button>
                          <Button 
                            type="button"
                            variant={selectedRole === "parent" ? "default" : "outline"} 
                            className="rounded-full" 
                            size="sm"
                            disabled={user.role === "admin"}
                            onClick={() => handleRoleChange("parent")}
                          >
                            Parent
                          </Button>
                          <Button 
                            type="button"
                            variant={selectedRole === "donor" ? "default" : "outline"} 
                            className="rounded-full" 
                            size="sm"
                            disabled={user.role === "admin"}
                            onClick={() => handleRoleChange("donor")}
                          >
                            Donor
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Groups Section */}
                    <div className="space-y-4">
                      <FormLabel>Current Groups</FormLabel>
                      <div className="flex flex-wrap gap-2 justify-evenly">
                        {groups.length === 0 && (
                          <span className="text-sm text-muted-foreground">No groups assigned</span>
                        )}
                        {groups.map(group => (
                          <Badge key={group} variant="secondary" className="flex items-center gap-1">
                            {group}
                            <button type="button" onClick={() => handleRemoveGroup(group)}>
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <FormLabel>Add to Group</FormLabel>
                      <div className="flex flex-wrap gap-2 justify-evenly">
                        {remainingGroups.length === 0 && (
                          <span className="text-sm text-muted-foreground">All available groups added</span>
                        )}
                        {remainingGroups.map(group => (
                          <Button 
                            key={group} 
                            type="button"
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleAddGroup(group)}
                          >
                            <PlusCircle className="w-3 h-3" />
                            {group}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={updateLoading || roleLoading || groupsLoading}>
                {updateLoading || roleLoading || groupsLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 