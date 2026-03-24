"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCart } from "@/lib/store/cart"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2, MapPin, ShoppingBag, CreditCard, Lock, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const addressSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  address_line1: z.string().min(5, "Address is required"),
  address_line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().length(6, "Must be 6 digits"),
})
type AddressData = z.infer<typeof addressSchema>

type SavedAddress = {
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

declare global {
  interface Window {
    Razorpay: any
  }
}

const STEPS = ["Cart Review", "Shipping Address", "Payment"]

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [savedAddress, setSavedAddress] = useState<AddressData | null>(null)

  const shipping = totalPrice() >= 499 ? 0 : 49
  const grandTotal = totalPrice() + shipping

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { full_name: session?.user?.name || "", phone: "" },
  })

  useEffect(() => {
    if (session?.user?.name) setValue("full_name", session.user.name)

    try {
      const raw = localStorage.getItem("shigru_addresses_v1")
      if (!raw) return
      const parsed = JSON.parse(raw) as SavedAddress[]
      if (!Array.isArray(parsed) || parsed.length === 0) return

      const chosen = parsed.find((a) => a.isDefault) || parsed[0]
      if (!chosen) return

      const mapped: AddressData = {
        full_name: chosen.fullName || session?.user?.name || "",
        phone: chosen.phone || "",
        address_line1: chosen.line1 || "",
        address_line2: chosen.line2 || "",
        city: chosen.city || "",
        state: chosen.state || "",
        pincode: chosen.pincode || "",
      }

      setValue("full_name", mapped.full_name)
      setValue("phone", mapped.phone)
      setValue("address_line1", mapped.address_line1)
      setValue("address_line2", mapped.address_line2 || "")
      setValue("city", mapped.city)
      setValue("state", mapped.state)
      setValue("pincode", mapped.pincode)
      setSavedAddress(mapped)
    } catch {
      // ignore malformed storage
    }
  }, [session?.user?.name, setValue])

  const onAddressSubmit = (data: AddressData) => {
    setSavedAddress(data)
    setStep(2)
  }

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  const handlePayment = async () => {
    if (!savedAddress) return
    setIsProcessing(true)

    const loaded = await loadRazorpay()
    if (!loaded) {
      toast.error("Failed to load payment gateway. Please try again.")
      setIsProcessing(false)
      return
    }

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            variantId: i.id,
            productId: i.productId,
            productName: i.productName,
            variantWeight: i.variantWeight,
            price: i.price,
            quantity: i.quantity,
          })),
          shipping: savedAddress,
          subtotal: totalPrice(),
          shippingAmount: shipping,
          total: grandTotal,
        }),
      })
      const { razorpayOrderId, dbOrderId } = await res.json()

      if (!razorpayOrderId) {
        toast.error("Could not create order. Please try again.")
        setIsProcessing(false)
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: grandTotal * 100,
        currency: "INR",
        name: "Shigruvedas",
        description: "Organic Moringa Products",
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/orders/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              dbOrderId,
            }),
          })
          const verified = await verifyRes.json()
          if (verified.success) {
            clearCart()
            router.push(`/orders/success?orderId=${dbOrderId}`)
          } else {
            toast.error("Payment verification failed. Contact support.")
          }
        },
        prefill: {
          name: savedAddress.full_name,
          contact: savedAddress.phone,
          email: session?.user?.email || "",
        },
        theme: { color: "#16a34a" },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch {
      toast.error("Something went wrong. Please try again.")
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
          <Link href="/shop">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4">Shop Now</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Checkout</h1>

        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                    i < step
                      ? "bg-primary border-primary text-primary-foreground"
                      : i === step
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 0 && (
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" /> Review Your Order
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-14 h-14 bg-muted rounded-xl overflow-hidden border flex-shrink-0">
                        <Image src={item.image} alt={item.productName} width={56} height={56} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.variantWeight} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold text-foreground text-sm">₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setStep(1)}>
                  Continue to Shipping
                </Button>
              </div>
            )}

            {step === 1 && (
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" /> Shipping Address
                  </h2>
                  <Link href="/profile/addresses" className="text-xs font-semibold text-primary hover:underline">
                    Manage Saved Addresses
                  </Link>
                </div>
                <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <Label>Full Name</Label>
                      <Input className="mt-1" placeholder="Ronak Sharma" {...register("full_name")} />
                      {errors.full_name && <p className="text-destructive text-xs mt-1">{errors.full_name.message}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label>Phone Number</Label>
                      <Input className="mt-1" placeholder="98765 43210" {...register("phone")} />
                      {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Label>Address Line 1</Label>
                    <Input className="mt-1" placeholder="House no, Street, Area" {...register("address_line1")} />
                    {errors.address_line1 && <p className="text-destructive text-xs mt-1">{errors.address_line1.message}</p>}
                  </div>
                  <div>
                    <Label>Address Line 2 (optional)</Label>
                    <Input className="mt-1" placeholder="Landmark, Apartment etc." {...register("address_line2")} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input className="mt-1" placeholder="Udaipur" {...register("city")} />
                      {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input className="mt-1" placeholder="Rajasthan" {...register("state")} />
                      {errors.state && <p className="text-destructive text-xs mt-1">{errors.state.message}</p>}
                    </div>
                    <div>
                      <Label>Pincode</Label>
                      <Input className="mt-1" placeholder="313002" {...register("pincode")} />
                      {errors.pincode && <p className="text-destructive text-xs mt-1">{errors.pincode.message}</p>}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setStep(0)} className="w-full">
                      Back
                    </Button>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && savedAddress && (
              <div className="space-y-4">
                <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" /> Delivering to
                    </h3>
                    <button onClick={() => setStep(1)} className="text-xs text-primary hover:underline">
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-foreground font-medium">{savedAddress.full_name}</p>
                  <p className="text-xs text-muted-foreground">{savedAddress.phone}</p>
                  <p className="text-xs text-muted-foreground">
                    {savedAddress.address_line1}
                    {savedAddress.address_line2 ? `, ${savedAddress.address_line2}` : ""}, {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}
                  </p>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                  <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" /> Payment
                  </h2>
                  <div className="bg-muted border border-primary/30 rounded-xl p-4 mb-6">
                    <p className="text-sm text-foreground font-medium mb-1">🔒 Secure Payment via Razorpay</p>
                    <p className="text-xs text-primary">Pay using UPI, Credit/Debit Card, Net Banking, or Wallets</p>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base" onClick={handlePayment} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" /> Pay ₹{grandTotal.toFixed(0)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-card rounded-2xl border border-border shadow-sm p-5 sticky top-24">
              <h3 className="font-bold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
                    <span className="truncate mr-2">
                      {item.productName} ({item.variantWeight}) ×{item.quantity}
                    </span>
                    <span className="flex-shrink-0 font-medium">₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <Separator className="mb-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{totalPrice().toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-primary font-medium" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" /> SSL secured checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
