"use client"

import { User } from "@/types/user"
import { DataTableColumn, createColumns } from "@/components/ui/data-table/columns"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export const columns: DataTableColumn<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role

      return (
        <Badge variant="outline">
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "isEmailVerified",
    header: "Verified",
    cell: ({ row }) => {
      const isVerified = row.original.isEmailVerified

      return (
        <Badge variant={isVerified ? "secondary" : "destructive"}>
          {isVerified ? "Yes" : "No"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive

      return (
        <Badge variant={isActive ? "success" : "destructive"}>
          {isActive ? "Active" : "Deactivated"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPP"),
  },
] 