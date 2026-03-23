"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import ImageUpload from "@/components/admin/ImageUpload"

const blogSchema = z.object({
  title: z.string().min(5, "Title is required (min 5 chars)"),
  slug: z.string().min(5, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().min(20, "Content is required (min 20 chars)"),
  cover_image: z.string().optional(),
  tags: z.string().transform(val => val.split(",").map(t => t.trim()).filter(t => t !== "")),
  is_published: z.boolean().default(false),
})

interface BlogFormProps {
  initialData?: any
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialData ? {
      ...initialData,
      tags: initialData.tags?.join(", ") || "",
    } : {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image: "",
      tags: "",
      is_published: false,
    },
  })

  const onSubmit = async (values: z.infer<typeof blogSchema>) => {
    try {
      setLoading(true)
      const url = initialData ? `/api/admin/blog/${initialData.id}` : "/api/admin/blog"
      const method = initialData ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Failed to save post")

      toast.success(initialData ? "Post updated" : "Post created")
      router.push("/admin/blog")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm" type="button">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {initialData ? "Update Post" : "Create Post"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter post title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="post-slug-here" {...field} />
                      </FormControl>
                      <FormDescription>Used for the URL</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief summary of the post" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Write your post content here..." className="min-h-[300px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
             <Card className="border-none shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="cover_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload 
                          value={field.value || ""} 
                          onChange={field.onChange}
                          disabled={loading}
                          bucket="blog"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="moringa, health, wellness" {...field} />
                      </FormControl>
                      <FormDescription>Comma separated</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Publish Post</FormLabel>
                        <p className="text-xs text-gray-500">Make this post public immediately</p>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}
