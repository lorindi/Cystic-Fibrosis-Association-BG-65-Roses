import { User } from "@/types/user"
import { UserIcon, Users2, Heart } from "lucide-react"

interface UserStatsProps {
  users: User[]
}

export function UserStats({ users }: UserStatsProps) {
  const patients = users.filter(u => u.role === "patient").length
  const parents = users.filter(u => u.role === "parent").length
  const donors = users.filter(u => u.role === "donor").length

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-md">
          <Users2 className="w-4 h-4" />
          <span className="font-medium">Total: {users.length}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-md">
          <UserIcon className="w-4 h-4" />
          <span className="font-medium">
            Patients: {patients}
          </span>
          <span className="text-purple-400">({Math.round(patients/users.length * 100)}%)</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-md">
          <Users2 className="w-4 h-4" />
          <span className="font-medium">
            Parents: {parents}
          </span>
          <span className="text-green-400">({Math.round(parents/users.length * 100)}%)</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 rounded-md">
          <Heart className="w-4 h-4" />
          <span className="font-medium">
            Donors: {donors}
          </span>
          <span className="text-rose-400">({Math.round(donors/users.length * 100)}%)</span>
        </div>
      </div>
    </div>
  )
} 