"use client";

import * as React from "react";
import { useQuery } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Campaign } from "@/types/campaign";
import { User, UserRole } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Search, Plus, X, UserPlus } from "lucide-react";
import { GET_USERS_BY_ROLE } from "@/app/admin/graphql/users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CampaignParticipantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign;
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
  const [currentRole, setCurrentRole] = React.useState<string>(UserRole.PATIENT);

  // Заявка за потребители с роля PATIENT
  const { data: patientData, loading: patientLoading } = useQuery(
    GET_USERS_BY_ROLE,
    {
      variables: { role: UserRole.PATIENT },
      skip: !open, // Пропускаме заявката, ако диалогът е затворен
    }
  );

  // Заявка за потребители с роля PARENT
  const { data: parentData, loading: parentLoading } = useQuery(
    GET_USERS_BY_ROLE,
    {
      variables: { role: UserRole.PARENT },
      skip: !open, // Пропускаме заявката, ако диалогът е затворен
    }
  );

  // Функция за превод на потребителската роля на български
  const translateRole = (role: string) => {
    const roles: Record<string, string> = {
      [UserRole.ADMIN]: "Администратор",
      [UserRole.PATIENT]: "Пациент",
      [UserRole.PARENT]: "Родител",
      [UserRole.DONOR]: "Дарител",
    };
    return roles[role] || role;
  };

  // Филтриране на потребители на базата на търсенето
  const filterUsers = (users: User[] | undefined) => {
    if (!users) return [];
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Получаваме потребителите въз основа на избраната роля
  const getUsersByCurrentRole = () => {
    if (currentRole === UserRole.PATIENT) {
      return patientData?.getUsersByRole || [];
    } else if (currentRole === UserRole.PARENT) {
      return parentData?.getUsersByRole || [];
    }
    return [];
  };

  // Проверяваме дали потребителят вече е в кампанията
  const isUserInCampaign = (userId: string) => {
    return campaign.participants?.some((participant) => participant.id === userId);
  };

  // Филтрирани потребители по текущата роля и търсенето
  const filteredUsers = filterUsers(getUsersByCurrentRole());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Управление на участници в кампания</DialogTitle>
          <DialogDescription>
            {campaign.title} - {campaign.participants?.length || 0} участници
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="current">
          <TabsList className="mb-4">
            <TabsTrigger value="current">Текущи участници</TabsTrigger>
            <TabsTrigger value="add">Добавяне на участници</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            {campaign.participants && campaign.participants.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Име</TableHead>
                      <TableHead>Имейл</TableHead>
                      <TableHead>Роля</TableHead>
                      <TableHead className="w-[100px] text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaign.participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell>{participant.name}</TableCell>
                        <TableCell>{participant.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {translateRole(participant.role)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
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
            ) : (
              <div className="text-center p-6 bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Няма участници в тази кампания.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Tabs
                  value={currentRole}
                  onValueChange={setCurrentRole}
                  className="w-full"
                >
                  <TabsList className="mb-4 w-full">
                    <TabsTrigger value={UserRole.PATIENT} className="flex-1">
                      <UserIcon className="h-4 w-4 mr-2" />
                      Пациенти
                    </TabsTrigger>
                    <TabsTrigger value={UserRole.PARENT} className="flex-1">
                      <UserIcon className="h-4 w-4 mr-2" />
                      Родители
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Търси потребители..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {patientLoading || parentLoading ? (
                <div className="text-center py-4">Зареждане...</div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Име</TableHead>
                        <TableHead>Имейл</TableHead>
                        <TableHead className="w-[100px] text-right">
                          Действия
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center h-24"
                          >
                            Няма намерени потребители
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onAddUser(user.id)}
                                disabled={isUserInCampaign(user.id)}
                              >
                                {isUserInCampaign(user.id) ? (
                                  "Добавен"
                                ) : (
                                  <>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Добави
                                  </>
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 