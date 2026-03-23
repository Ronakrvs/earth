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
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { format } from "date-fns"
import { Star, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReviewsListProps {
  initialReviews: any[]
}

export default function ReviewsList({ initialReviews }: ReviewsListProps) {
  const [reviews, setReviews] = useState(initialReviews)

  const handleToggleApproval = async (reviewId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: !currentStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      setReviews(reviews.map(r => r.id === reviewId ? { ...r, is_approved: !currentStatus } : r))
      toast.success(currentStatus ? "Review hidden" : "Review approved")
    } catch (error) {
      toast.error("Error updating review")
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete review")

      setReviews(reviews.filter(r => r.id !== reviewId))
      toast.success("Review deleted")
    } catch (error) {
      toast.error("Error deleting review")
    }
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-100/50">
            <TableRow>
              <TableHead className="py-4 px-6">Product / User</TableHead>
              <TableHead className="py-4">Rating & Review</TableHead>
              <TableHead className="py-4">Status</TableHead>
              <TableHead className="py-4">Date</TableHead>
              <TableHead className="py-4 text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                  <TableCell className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-gray-900">{review.products?.name}</div>
                      <div className="text-sm text-gray-700">{review.profiles?.full_name || 'Anonymous'}</div>
                      <div className="text-xs text-gray-500">{review.profiles?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 max-w-[300px]">
                    <div className="flex items-center gap-0.5 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                    {review.title && <div className="font-semibold text-xs mb-0.5">{review.title}</div>}
                    <div className="text-xs text-gray-600 line-clamp-2 italic">
                      &quot;{review.content}&quot;
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {review.is_approved ? (
                      <Badge className="bg-green-100 text-green-700 w-fit" variant="secondary">Approved</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 w-fit" variant="secondary">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-4 text-gray-500 text-sm">
                    {format(new Date(review.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="py-4 text-right px-6">
                    <div className="flex items-center justify-end gap-2">
                       <Button
                        size="icon"
                        variant="ghost"
                        className={`h-8 w-8 ${review.is_approved ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}`}
                        onClick={() => handleToggleApproval(review.id, review.is_approved)}
                        title={review.is_approved ? "Hide Review" : "Approve Review"}
                      >
                        {review.is_approved ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(review.id)}
                        title="Delete Review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
