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
import { Edit, Trash2, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface BlogListProps {
  initialPosts: any[]
}

export default function BlogList({ initialPosts }: BlogListProps) {
  const [posts, setPosts] = useState(initialPosts)

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete post")

      setPosts(posts.filter(p => p.id !== postId))
      toast.success("Blog post deleted")
    } catch (error) {
      toast.error("Error deleting post")
    }
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-100/50">
            <TableRow>
              <TableHead className="py-4 px-6">Post</TableHead>
              <TableHead className="py-4">Status</TableHead>
              <TableHead className="py-4">Tags</TableHead>
              <TableHead className="py-4">Created</TableHead>
              <TableHead className="py-4 text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                  No blog posts found
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        {post.cover_image ? (
                          <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <BookOpen className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate max-w-[300px]">{post.title}</div>
                        <div className="text-xs text-gray-400 font-mono">{post.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {post.is_published ? (
                      <Badge className="bg-green-100 text-green-700 flex items-center w-fit gap-1" variant="secondary">
                        <Globe className="h-3 w-3" />
                        Published
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600 flex items-center w-fit gap-1" variant="secondary">
                        <Lock className="h-3 w-3" />
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {post.tags?.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-[10px] py-0 h-4">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags?.length > 2 && <span className="text-[10px] text-gray-400">+{post.tags.length - 2}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-gray-500 text-sm">
                    {format(new Date(post.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="py-4 text-right px-6">
                    <div className="flex items-center justify-end gap-2">
                       <Link href={`/admin/blog/${post.id}/edit`}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="Edit Post"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(post.id)}
                        title="Delete Post"
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

import { BookOpen } from "lucide-react"
