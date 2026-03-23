"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import ImageUpload from "./ImageUpload"

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  short_description: z.string().optional(),
  category: z.enum(["moringa-powder", "moringa-leaves", "drumsticks", "seeds"]),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  meta_title: z.string().nullish().or(z.literal("")),
  meta_description: z.string().nullish().or(z.literal("")),
  variants: z.array(z.object({
    id: z.string().optional(),
    weight: z.string().min(1, "Weight is required"),
    price: z.coerce.number().min(0),
    compare_price: z.coerce.number().optional(),
    stock: z.coerce.number().min(0),
    sku: z.string().optional(),
    is_active: z.boolean().default(true),
  })).min(1, "At least one variant is required"),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: any
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const defaultValues: Partial<ProductFormValues> = initialData ? {
    ...initialData,
    variants: initialData.product_variants || [{ weight: "", price: 0, stock: 0, is_active: true }]
  } : {
    name: "",
    slug: "",
    description: "",
    short_description: "",
    category: "moringa-powder",
    is_active: true,
    is_featured: false,
    variants: [{ weight: "", price: 0, stock: 0, is_active: true }],
    images: [],
    meta_title: "",
    meta_description: "",
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues as any,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  })

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true)
      const url = initialData ? `/api/admin/products/${initialData.id}` : "/api/admin/products"
      const method = initialData ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Something went wrong")

      toast.success(initialData ? "Product updated" : "Product created")
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="ghost" size="sm" type="button">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{initialData ? "Edit Product" : "New Product"}</h1>
          </div>
          <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Save Changes" : "Create Product"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Organic Moringa Powder" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="organic-moringa-powder" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="moringa-powder">Moringa Powder</SelectItem>
                            <SelectItem value="moringa-leaves">Moringa Leaves</SelectItem>
                            <SelectItem value="drumsticks">Drumsticks</SelectItem>
                            <SelectItem value="seeds">Seeds</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="short_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief summary for product cards" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder="Full product details..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Variants</CardTitle>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ weight: "", price: 0, stock: 0, is_active: true })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Variant
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((item, index) => (
                  <div key={item.id} className="flex gap-4 items-end p-4 border rounded-xl relative">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                      <FormField
                        control={form.control}
                        name={`variants.${index}.weight`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Weight (e.g. 100g)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`variants.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Price (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`variants.${index}.compare_price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Compare Price (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`variants.${index}.stock`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Stock</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {fields.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600 h-10"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>Show or hide this product.</FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>Highlight on home page.</FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Thumbnail</FormLabel>
                      <FormControl>
                        <ImageUpload 
                          value={field.value || ""} 
                          onChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="meta_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO Title" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="SEO Meta Description" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
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
