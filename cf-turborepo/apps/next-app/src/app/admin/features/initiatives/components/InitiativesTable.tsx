"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { Initiative } from "@/types/initiative";

interface InitiativesTableProps {
  initiatives: Initiative[];
  onEdit: (initiative: Initiative) => void;
  onDelete: (initiative: Initiative) => void;
  onManageItems: (initiative: Initiative) => void;
}

export function InitiativesTable({
  initiatives,
  onEdit,
  onDelete,
  onManageItems,
}: InitiativesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Participants</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {initiatives.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              No initiatives found
            </TableCell>
          </TableRow>
        ) : (
          initiatives.map((initiative) => (
            <TableRow key={initiative.id}>
              <TableCell className="font-medium">{initiative.title}</TableCell>
              <TableCell>
                {initiative.description.length > 50
                  ? `${initiative.description.substring(0, 50)}...`
                  : initiative.description}
              </TableCell>
              <TableCell>
                {format(new Date(initiative.startDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {initiative.endDate
                  ? format(new Date(initiative.endDate), "MMM d, yyyy")
                  : "Ongoing"}
              </TableCell>
              <TableCell>{initiative.participants.length}</TableCell>
              <TableCell>{initiative.items.length}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(initiative)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(initiative)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onManageItems(initiative)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
} 