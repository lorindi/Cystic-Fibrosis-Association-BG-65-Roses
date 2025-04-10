"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface InitiativeItemsTableProps {
  items: any[];
  onDelete: (itemId: string) => void;
}

export function InitiativeItemsTable({
  items,
  onDelete,
}: InitiativeItemsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Distribution</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              No items found
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => {
            const distributionPercentage =
              item.quantity > 0
                ? Math.round((item.distributedQuantity / item.quantity) * 100)
                : 0;

            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  {item.description.length > 50
                    ? `${item.description.substring(0, 50)}...`
                    : item.description}
                </TableCell>
                <TableCell>
                  {item.distributedQuantity} / {item.quantity}
                </TableCell>
                <TableCell className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Progress value={distributionPercentage} />
                    <span className="w-[40px] text-xs">
                      {distributionPercentage}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
} 