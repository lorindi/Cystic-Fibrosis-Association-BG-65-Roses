"use client";

import * as React from "react";
import { useQuery } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Search, Plus, X, UserPlus } from "lucide-react";
import { GET_USERS_BY_ROLE } from "@/app/admin/graphql/users";
import { REMOVE_USER_FROM_CAMPAIGN } from "@/app/admin/graphql/campaigns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types/user";

interface CampaignParticipantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: any;
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
}

export function CampaignParticipantsDialog({
  open,
  onOpenChange,
  campaign,
  onAddUser,
  onRemoveUser,
}: CampaignParticipantsDialogProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentRole, setCurrentRole] = React.useState<UserRole>(UserRole.PATIENT);

  // Запитване за получаване на потребителите от дадена роля
  const { data: patientsData, loading: patientsLoading } = useQuery(GET_USERS_BY_ROLE, {
    variables: { role: UserRole.PATIENT },
    skip: !open,
  });

  const { data: parentsData, loading: parentsLoading } = useQuery(GET_USERS_BY_ROLE, {
    variables: { role: UserRole.PARENT },
    skip: !open,
  });

  // Презвод на роля
  const translateRole = (role: string) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "patient":
        return "Пациент";
      case "parent":
        return "Родител";
      case "donor":
        return "Дарител";
      default:
        return role;
    }
  };

  // Обработване на търсене
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Списък с текущи участници
  const participants = campaign?.participants || [];

  // Получаване на списък с потребители за текущата избрана роля
  const getUsersForRole = () => {
    if (currentRole === UserRole.PATIENT) {
      return patientsData?.getUsersByRole || [];
    } else if (currentRole === UserRole.PARENT) {
      return parentsData?.getUsersByRole || [];
    }
    return [];
  };

  // Филтриране на потребителите според търсенето
  const filteredUsers = getUsersForRole().filter((user: any) => {
    const isParticipant = participants.some((p: any) => p.id === user.id);
    
    // Филтриране по търсене и изключване на вече добавените потребители
    return (
      !isParticipant &&
      (user.name.toLowerCase().includes(searchTerm) || 
       user.email.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Управление на участниците в кампания</DialogTitle>
          <DialogDescription>
            {campaign?.title} - Текущ брой участници: {participants.length}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
          {/* Лява колона - Текущи участници */}
          <div className="overflow-auto flex flex-col h-full">
            <h3 className="font-medium mb-2">Текущи участници:</h3>
            {participants.length === 0 ? (
              <div className="text-center p-4 bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Няма участници в тази кампания</p>
              </div>
            ) : (
              <div className="overflow-auto flex-1 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Име</TableHead>
                      <TableHead>Роля</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant: any) => (
                      <TableRow key={participant.id}>
                        <TableCell className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {participant.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{translateRole(participant.role)}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveUser(participant.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Дясна колона - Добавяне на потребител */}
          <div className="overflow-auto flex flex-col h-full">
            <h3 className="font-medium mb-2">Добави участник:</h3>

            <Tabs defaultValue="patients" className="w-full" onValueChange={(value) => 
              setCurrentRole(value === "patients" ? UserRole.PATIENT : UserRole.PARENT)
            }>
              <TabsList className="mb-2 w-full">
                <TabsTrigger value="patients" className="flex-1">Пациенти</TabsTrigger>
                <TabsTrigger value="parents" className="flex-1">Родители</TabsTrigger>
              </TabsList>

              <div className="relative my-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Търси по име или имейл..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <div className="border rounded-md overflow-auto flex-1 mt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Име</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          {searchTerm ? "Няма намерени потребители" : "Няма налични потребители"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onAddUser(user.id)}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Затвори
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 