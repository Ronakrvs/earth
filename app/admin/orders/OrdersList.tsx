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

interface OrdersListProps {
  initialOrders: any[]
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

export default function OrdersList({ initialOrders }: OrdersListProps) {
  const [orders, setOrders] = useState(initialOrders)

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      toast.success("Order status updated")
    } catch (error) {
      toast.error("Error updating order status")
    }
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-100/50">
            <TableRow>
              <TableHead className="py-4 px-6">Order ID / Customer</TableHead>
              <TableHead className="py-4">Status</TableHead>
              <TableHead className="py-4">Amount</TableHead>
              <TableHead className="py-4">Date</TableHead>
              <TableHead className="py-4 text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                  <TableCell className="py-4 px-6">
                    <div>
                      <div className="font-mono text-xs text-gray-400 mb-1">#{order.id.slice(0, 8)}</div>
                      <div className="font-semibold text-gray-900">{order.profiles?.full_name || 'Anonymous'}</div>
                      <div className="text-xs text-gray-500">{order.profiles?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge 
                      className={`${statusColors[order.status] || "bg-gray-100 text-gray-700"} capitalize`}
                      variant="secondary"
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 font-bold text-gray-900">
                    ₹{order.total_amount}
                  </TableCell>
                  <TableCell className="py-4 text-gray-500 text-sm">
                    {format(new Date(order.created_at), 'MMM dd, h:mm a')}
                  </TableCell>
                  <TableCell className="py-4 text-right px-6">
                    <Select 
                      defaultValue={order.status} 
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-[130px] ml-auto h-8 text-xs font-medium focus:ring-green-500">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
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
