"use client"

import { Campaign } from "@/types/campaign"
import { DataTableColumn, createColumns } from "@/components/ui/data-table/columns"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export const columns: DataTableColumn<Campaign>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const campaign = row.original;
      const router = useRouter();
      return (
        <button 
          onClick={() => router.push(`/admin/campaigns/${campaign.id}`)}
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
        >
          {campaign.title}
        </button>
      );
    },
  },
  {
    accessorKey: "goal",
    header: "Goal",
    cell: ({ row }) => {
      const goal = row.original.goal
      return <span>{goal.toLocaleString()} BGN</span>
    },
  },
  {
    accessorKey: "currentAmount",
    header: "Collected",
    cell: ({ row }) => {
      const currentAmount = row.original.currentAmount
      const goal = row.original.goal
      const percent = Math.round((currentAmount / goal) * 100)
      
      return (
        <div className="flex flex-col">
          <span>{currentAmount.toLocaleString()} BGN</span>
          <Badge variant={percent >= 100 ? "default" : "secondary"}>
            {percent}%
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => format(new Date(row.original.startDate), "dd.MM.yyyy"),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const endDate = row.original.endDate
      return endDate ? format(new Date(endDate), "dd.MM.yyyy") : "No end date"
    },
  },
  {
    accessorKey: "participantsCount",
    header: "Participants",
    cell: ({ row }) => {
      const participantsCount = row.original.participantsCount
      const pendingParticipantsCount = row.original.pendingParticipantsCount
      
      return (
        <div className="flex flex-col">
          <span>{participantsCount} approved</span>
          {pendingParticipantsCount > 0 && (
            <Badge variant="destructive">
              {pendingParticipantsCount} pending
            </Badge>
          )}
        </div>
      )
    },
  },
] 