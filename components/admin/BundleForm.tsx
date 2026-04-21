"use client"

import { useState, useEffect } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Plus, Trash2, Box } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import ImageUpload from "./ImageUpload"

const bundleSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  image_url: z.string().optional(),
  discount_pct: z.coerce.number().min(0).max(100),
  is_active: z.boolean().default(true),
  items: z.array(z.object({
    product_id: z.string().min(1, "Product is required"),
    quantity: z.coerce.number().min(1),
  })).min(1, "At least one item is required"),
})

type BundleFormValues = z.infer<typeof bundleSchema>

interface BundleFormProps {
  initialData?: any
}

export default function BundleForm({ initialData }: BundleFormProps) {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/admin/products")
      if (res.ok) {
        const data = await res.json()
        setProducts(data || [])
      }
    }
    fetchProducts()
  }, [])

  const form = useForm<BundleFormValues>({
    resolver: zodResolver(bundleSchema),
    defaultValues: initialData ? {
      ...initialData,
      items: initialData.bundle_items || [{ product_id: "", quantity: 1 }],
    } : {
      name: "",
      slug: "",
      description: "",
      discount_pct: 0,
      is_active: true,
      items: [{ product_id: "", quantity: 1 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const onSubmit = async (data: BundleFormValues) => {
    try {
      setLoading(true)
      const url = initialData ? `/api/admin/bundles/${initialData.id}` : "/api/admin/bundles"
      const method = initialData ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Something went wrong")

      toast.success(initialData ? "Bundle updated" : "Bundle created")
      router.push("/admin/bundles")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/bundles">
              <Button variant="ghost" size="sm" type="button" className="rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            </Link>
            <h1 className="text-2xl font-black text-slate-900">
              {initialData ? "Edit Bundle" : "New Bundle"}
            </h1>
          </div>
          <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold h-12 px-8 shadow-lg shadow-primary/20">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Save Changes" : "Create Bundle"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                <CardTitle className="text-lg font-black text-slate-900">Bundle Profile</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Bundle Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Wellness Starter Kit" {...field} className="rounded-xl h-12" />
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
                        <FormLabel className="font-bold">Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="wellness-starter-kit" {...field} className="rounded-xl h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Description</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} className="rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
               <CardHeader className="bg-slate-50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-black text-slate-900">Includes Products</CardTitle>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl h-10 px-4"
                    onClick={() => append({ product_id: "", quantity: 1 })}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Product
                  </Button>
               </CardHeader>
               <CardContent className="p-8 space-y-4">
                  {fields.map((item, index) => (
                    <div key={item.id} className="flex gap-4 items-end p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 relative group">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                        <FormField
                          control={form.control}
                          name={`items.${index}.product_id`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Product</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="rounded-xl h-12 bg-white">
                                    <SelectValue placeholder="Choose product..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {products.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-400">Quantity</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} className="rounded-xl h-12 bg-white text-center font-black" />
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
                          className="text-red-400 hover:text-red-500 hover:bg-red-50 h-10 w-10 p-0 rounded-xl"
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
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
               <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
                  <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider">Configuration</CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="discount_pct"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Discount Percentage (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="rounded-xl h-12 font-black text-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-slate-100 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="font-bold">Public Listing</FormLabel>
                          <FormDescription className="text-[10px]">Show in shop section.</FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
               </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
                  <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider">Bundle Media</CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
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

            <div className="bg-secondary/10 rounded-[2rem] p-8 border border-secondary/10">
               <div className="flex items-center gap-3 mb-4">
                 <Box className="h-5 w-5 text-secondary" />
                 <h4 className="font-black text-secondary uppercase text-xs tracking-widest">Bundle Logic</h4>
               </div>
               <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                 "Bundles automatically calculate shipping based on total weight of items. Ensure all included product variants have accurate weights."
               </p>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
