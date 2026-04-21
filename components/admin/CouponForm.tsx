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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Calendar as CalendarIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const couponSchema = z.object({
  code: z.string().min(2, "Code is required").toUpperCase(),
  type: z.enum(["percent", "fixed", "free_shipping"]),
  value: z.coerce.number().min(0),
  min_order_value: z.coerce.number().min(0),
  max_uses: z.coerce.number().optional().nullable(),
  uses_per_user: z.coerce.number().min(1).default(1),
  is_active: z.boolean().default(true),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
})

type CouponFormValues = z.infer<typeof couponSchema>

interface CouponFormProps {
  initialData?: any
}

export default function CouponForm({ initialData }: CouponFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: initialData ? {
      ...initialData,
      start_date: initialData.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : "",
      end_date: initialData.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : "",
    } : {
      code: "",
      type: "percent",
      value: 0,
      min_order_value: 0,
      uses_per_user: 1,
      is_active: true,
    },
  })

  const onSubmit = async (data: CouponFormValues) => {
    try {
      setLoading(true)
      const url = initialData ? `/api/admin/coupons/${initialData.id}` : "/api/admin/coupons"
      const method = initialData ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Something went wrong")

      toast.success(initialData ? "Coupon updated" : "Coupon created")
      router.push("/admin/coupons")
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
            <Link href="/admin/coupons">
              <Button variant="ghost" size="sm" type="button" className="rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {initialData ? "Edit Coupon" : "New Coupon"}
            </h1>
          </div>
          <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold h-12 px-8 shadow-lg shadow-primary/20">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Save Changes" : "Create Coupon"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                <CardTitle className="text-lg font-black text-slate-900">Promotion Details</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Coupon Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. WELCOME10" {...field} className="rounded-xl h-12 font-mono" />
                        </FormControl>
                        <FormDescription>Unique code customers enter at checkout.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Discount Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl h-12">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percent">Percentage (%)</SelectItem>
                            <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                            <SelectItem value="free_shipping">Free Shipping</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Discount Value</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="rounded-xl h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="min_order_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Minimum Purchase (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="rounded-xl h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
               <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                  <CardTitle className="text-lg font-black text-slate-900">Validity & Limits</CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value || ""} className="rounded-xl h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Expiry Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value || ""} className="rounded-xl h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="max_uses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Total Usage Limit</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} value={field.value || ""} className="rounded-xl h-12" />
                          </FormControl>
                          <FormDescription>Leave blank for unlimited.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="uses_per_user"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Limit Per User</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="rounded-xl h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
               </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden">
               <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
                  <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider">Status</CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-slate-100 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="font-bold text-slate-900">Active Status</FormLabel>
                          <FormDescription className="text-[10px]">Allow customers to use this code.</FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
               </CardContent>
            </Card>

            <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
               <h4 className="font-black text-primary uppercase text-xs tracking-widest mb-4">Quick Tip</h4>
               <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                 "Free Shipping coupons are a great way to increase conversion on orders above ₹500. Consider setting a minimum order value."
               </p>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
