"use client";

import * as React from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Campaign } from "@/types/campaign";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, UserMinus, UserCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  TabsContent,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  APPROVE_CAMPAIGN_PARTICIPANT,
  REJECT_CAMPAIGN_PARTICIPANT,
  ADD_USER_TO_CAMPAIGN,
  REMOVE_USER_FROM_CAMPAIGN,
  GET_CAMPAIGN
} from "../../../graphql/campaigns";

interface CampaignManageParticipantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
}

export function CampaignManageParticipantsDialog({
  open,
  onOpenChange,
  campaignId,
}: CampaignManageParticipantsDialogProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [userIdToAdd, setUserIdToAdd] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("current");

  // Fetch campaign data with participants
  const { data, loading, error, refetch } = useQuery(GET_CAMPAIGN, {
    variables: { id: campaignId },
    skip: !open || !campaignId,
  });

  // Add user to campaign mutation
  const [addUserToCampaign, { loading: addingUser }] = useMutation(ADD_USER_TO_CAMPAIGN, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "User added to campaign successfully",
      });
      setUserIdToAdd("");
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove user from campaign mutation
  const [removeUserFromCampaign, { loading: removingUser }] = useMutation(REMOVE_USER_FROM_CAMPAIGN, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "User removed from campaign",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Approve participant mutation
  const [approveParticipant, { loading: approvingUser }] = useMutation(APPROVE_CAMPAIGN_PARTICIPANT, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "User approved successfully",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reject participant mutation
  const [rejectParticipant, { loading: rejectingUser }] = useMutation(REJECT_CAMPAIGN_PARTICIPANT, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "User rejected successfully",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddUser = () => {
    if (!userIdToAdd) return;
    
    addUserToCampaign({
      variables: {
        campaignId,
        userId: userIdToAdd,
      },
    });
  };

  const handleRemoveUser = (userId: string) => {
    removeUserFromCampaign({
      variables: {
        campaignId,
        userId,
      },
    });
  };

  const handleApproveUser = (userId: string) => {
    approveParticipant({
      variables: {
        campaignId,
        userId,
      },
    });
  };

  const handleRejectUser = (userId: string) => {
    rejectParticipant({
      variables: {
        campaignId,
        userId,
      },
    });
  };

  // Функция за превод на потребителската роля
  const translateRole = (role: string) => {
    const roles: Record<string, string> = {
      "admin": "Administrator",
      "patient": "Patient",
      "parent": "Parent",
      "donor": "Donor",
    };
    return roles[role] || role;
  };

  if (loading) return null;
  
  const campaign = data?.getCampaign;
  const currentParticipants = campaign?.participants || [];
  const pendingParticipants = campaign?.pendingParticipants || [];

  // Filter participants by search term if provided
  const filteredCurrentParticipants = searchTerm 
    ? currentParticipants.filter((p: any) => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : currentParticipants;

  const filteredPendingParticipants = searchTerm
    ? pendingParticipants.filter((p: any) => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : pendingParticipants;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Campaign Participants</DialogTitle>
          <DialogDescription>
            {campaign?.title || "Campaign"} - View, add or remove participants
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="current">
              Current Participants ({currentParticipants.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pending Approval ({pendingParticipants.length})
              {pendingParticipants.length > 0 && (
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="add">Add Participants</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            {filteredCurrentParticipants.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCurrentParticipants.map((participant: any) => (
                    <TableRow key={participant.id || participant._id}>
                      <TableCell>{participant.name}</TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {translateRole(participant.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveUser(participant.id || participant._id)}
                          disabled={removingUser}
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-6 bg-muted/50 rounded-md">
                <p className="text-muted-foreground">No participants found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending">
            {filteredPendingParticipants.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPendingParticipants.map((participant: any) => (
                    <TableRow key={participant.id || participant._id}>
                      <TableCell>{participant.name}</TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {translateRole(participant.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleRejectUser(participant.id || participant._id)}
                            disabled={rejectingUser}
                          >
                            <UserMinus className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-black text-white hover:bg-black/80"
                            onClick={() => handleApproveUser(participant.id || participant._id)}
                            disabled={approvingUser}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-6 bg-muted/50 rounded-md">
                <p className="text-muted-foreground">No pending approval requests</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                <p>Enter a user ID to add them directly to the campaign.</p>
                <p>Note: In a production environment, this would typically use a user search feature to find and select users.</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  placeholder="User ID"
                  value={userIdToAdd}
                  onChange={(e) => setUserIdToAdd(e.target.value)}
                />
                <Button 
                  onClick={handleAddUser}
                  disabled={!userIdToAdd || addingUser}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 