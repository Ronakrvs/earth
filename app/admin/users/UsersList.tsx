"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { format } from "date-fns"

interface UsersListProps {
  initialUsers: any[]
  currentUserId: string
}

export default function UsersList({ initialUsers, currentUserId }: UsersListProps) {
  const [users, setUsers] = useState(initialUsers)

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === currentUserId) {
      toast.error("You cannot change your own role")
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) throw new Error("Failed to update role")

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      toast.success("User role updated successfully")
    } catch (error) {
      toast.error("An error occurred while updating the role")
    }
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-100/50">
            <TableRow>
              <TableHead className="py-4 px-6">User</TableHead>
              <TableHead className="py-4">Role</TableHead>
              <TableHead className="py-4">Joined At</TableHead>
              <TableHead className="py-4 text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                  <TableCell className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-gray-900">{user.full_name || 'Anonymous'}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge 
                      className={user.role === 'admin' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}
                      variant="secondary"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-gray-500 text-sm">
                    {format(new Date(user.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="py-4 text-right px-6">
                    <Select 
                      defaultValue={user.role} 
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                      disabled={user.id === currentUserId}
                    >
                      <SelectTrigger className="w-[130px] ml-auto h-8 text-xs font-medium focus:ring-green-500">
                        <SelectValue placeholder="Change Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
