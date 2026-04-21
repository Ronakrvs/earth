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
import Link from "next/link"

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
  const [trackingValues, setTrackingValues] = useState<Record<string, string>>(
    Object.fromEntries(initialOrders.map((o) => [o.id, o.tracking_number || ""]))
  )

  const getCustomerLabel = (order: any) =>
    order.profiles?.full_name ||
    order.user_email ||
    order.profiles?.email ||
    "Anonymous"

  const handleUpdate = async (orderId: string, payload: { status?: string; tracking_number?: string }) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "Failed to update order")
      }

      setOrders(orders.map(o => o.id === orderId ? { ...o, ...payload } : o))
      toast.success("Order updated")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error updating order")
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
              <TableHead className="py-4">AWB / Tracking</TableHead>
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
                      <div className="font-semibold text-gray-900">{getCustomerLabel(order)}</div>
                      <div className="text-xs text-gray-500">{order.profiles?.email || order.user_email || ""}</div>
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
                  <TableCell className="py-4">
                    <input
                      value={trackingValues[order.id] ?? order.tracking_number ?? ""}
                      onChange={(e) => setTrackingValues((prev) => ({ ...prev, [order.id]: e.target.value }))}
                      onBlur={() => handleUpdate(order.id, { tracking_number: trackingValues[order.id] ?? "" })}
                      placeholder="Paste Shiprocket AWB"
                      className="w-full max-w-[180px] h-9 rounded-lg border border-gray-200 px-3 text-xs font-medium outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </TableCell>
                  <TableCell className="py-4 font-bold text-gray-900">
                    ₹{order.total}
                  </TableCell>
                  <TableCell className="py-4 text-gray-500 text-sm">
                    {format(new Date(order.created_at), 'MMM dd, h:mm a')}
                  </TableCell>
                  <TableCell className="py-4 text-right px-6">
                    <div className="flex flex-col items-end gap-2">
                      <Select 
                        defaultValue={order.status} 
                        onValueChange={(value) => handleUpdate(order.id, { status: value })}
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
                      <Link href={`/profile/orders/${order.id}`} className="text-xs text-green-700 hover:underline font-medium">
                        View user page
                      </Link>
                    </div>
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
