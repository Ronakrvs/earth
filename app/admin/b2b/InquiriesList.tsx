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
import { Mail, Phone, Building2 } from "lucide-react"

interface InquiriesListProps {
  initialInquiries: any[]
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  converted: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
}

export default function InquiriesList({ initialInquiries }: InquiriesListProps) {
  const [inquiries, setInquiries] = useState(initialInquiries)

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/b2b/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      setInquiries(inquiries.map(i => i.id === inquiryId ? { ...i, status: newStatus } : i))
      toast.success("Inquiry status updated")
    } catch (error) {
      toast.error("Error updating status")
    }
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-100/50">
            <TableRow>
              <TableHead className="py-4 px-6">Company / Contact</TableHead>
              <TableHead className="py-4">Details</TableHead>
              <TableHead className="py-4">Status</TableHead>
              <TableHead className="py-4">Date</TableHead>
              <TableHead className="py-4 text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                  No B2B inquiries found
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                  <TableCell className="py-4 px-6">
                    <div>
                      <div className="flex items-center gap-1 font-semibold text-gray-900 mb-0.5">
                        <Building2 className="h-3 w-3 text-gray-400" />
                        {inquiry.company_name}
                      </div>
                      <div className="text-sm font-medium text-gray-700">{inquiry.contact_name}</div>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Mail className="h-3 w-3" />
                          {inquiry.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Phone className="h-3 w-3" />
                          {inquiry.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 max-w-[250px]">
                    <div className="text-xs text-gray-600 line-clamp-2 italic">
                      &quot;{inquiry.message || 'No message provided'}&quot;
                    </div>
                    {inquiry.business_type && (
                      <Badge variant="outline" className="mt-2 text-[10px] uppercase tracking-wider">
                        {inquiry.business_type}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge 
                      className={`${statusColors[inquiry.status] || "bg-gray-100 text-gray-700"} capitalize`}
                      variant="secondary"
                    >
                      {inquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-gray-500 text-sm">
                    {format(new Date(inquiry.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="py-4 text-right px-6">
                    <Select 
                      defaultValue={inquiry.status} 
                      onValueChange={(value) => handleStatusChange(inquiry.id, value)}
                    >
                      <SelectTrigger className="w-[130px] ml-auto h-8 text-xs font-medium focus:ring-indigo-500">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
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
