"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { ChevronLeft, MapPin, Plus, Trash2, Pencil, CheckCircle2, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoringaCard } from "@/components/ui/moringa-card"

type Address = {
  id: string
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

const emptyForm: Omit<Address, "id"> = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
}

export default function ProfileAddressesClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const returnTo = searchParams.get("returnTo")
  const [addresses, setAddresses] = useState<Address[]>([])
  const [form, setForm] = useState<Omit<Address, "id">>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadAddresses() {
      try {
        const res = await fetch("/api/addresses")
        const payload = await res.json()
        if (!active || !res.ok) return
        const parsed = Array.isArray(payload) ? payload : []
        setAddresses(
          parsed.map((a: any) => ({
            id: a.id,
            fullName: a.full_name,
            phone: a.phone,
            line1: a.address_line1,
            line2: a.address_line2 || "",
            city: a.city,
            state: a.state,
            pincode: a.pincode,
            isDefault: Boolean(a.is_default),
          }))
        )
      } catch {
        // ignore load errors
      }
    }

    loadAddresses()
    return () => {
      active = false
    }
  }, [session?.user?.email, session?.user?.id])

  const hasDefault = useMemo(() => addresses.some((a) => a.isDefault), [addresses])

  const onChange = (key: keyof Omit<Address, "id">, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const validate = () => {
    return form.fullName.trim() && form.phone.trim() && form.line1.trim() && form.city.trim() && form.state.trim() && form.pincode.trim()
  }

  const onSubmit = () => {
    if (!validate()) return

    const save = async () => {
      const payload = {
        id: editingId,
        full_name: form.fullName,
        phone: form.phone,
        address_line1: form.line1,
        address_line2: form.line2 || "",
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        is_default: !hasDefault || form.isDefault,
      }

      const res = await fetch("/api/addresses", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const saved = await res.json()
      if (!res.ok) throw new Error(saved?.error || "Failed to save address")

      const mapped: Address = {
        id: saved.id,
        fullName: saved.full_name,
        phone: saved.phone,
        line1: saved.address_line1,
        line2: saved.address_line2 || "",
        city: saved.city,
        state: saved.state,
        pincode: saved.pincode,
        isDefault: Boolean(saved.is_default),
      }

      setAddresses((prev) => {
        const filtered = prev.filter((a) => a.id !== mapped.id)
        if (mapped.isDefault) {
          return [...filtered.map((a) => ({ ...a, isDefault: false })), mapped]
        }
        return [...filtered, mapped]
      })
      setEditingId(null)
      setForm(emptyForm)
      if (returnTo) router.push(returnTo)
    }

    void save()
  }

  const onEdit = (address: Address) => {
    setEditingId(address.id)
    const { id, ...rest } = address
    setForm(rest)
  }

  const onDelete = (id: string) => {
    void (async () => {
      const res = await fetch("/api/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) return
      setAddresses((prev) => {
        const filtered = prev.filter((a) => a.id !== id)
        if (!filtered.some((a) => a.isDefault) && filtered[0]) filtered[0].isDefault = true
        return [...filtered]
      })
    })()

    if (editingId === id) {
      setEditingId(null)
      setForm(emptyForm)
    }
  }

  const setDefault = (id: string) => {
    void (async () => {
      const current = addresses.find((a) => a.id === id)
      if (!current) return
      const res = await fetch("/api/addresses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          full_name: current.fullName,
          phone: current.phone,
          address_line1: current.line1,
          address_line2: current.line2 || "",
          city: current.city,
          state: current.state,
          pincode: current.pincode,
          is_default: true,
        }),
      })
      if (!res.ok) return
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
    })()
  }

  return (
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-6 py-12 max-w-4xl relative z-10">
        <div className="flex items-center gap-6 mb-10">
          <Link href="/profile" className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 hover:shadow-lg transition-all">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-foreground tracking-tighter italic">Delivery Nexus.</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Manage your shipping coordinates</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <MoringaCard className="p-8 border-border/60" glass={true}>
            <h2 className="text-lg font-black text-foreground mb-6 italic">{editingId ? "Edit Address" : "Add New Address"}</h2>

            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                <Input value={form.fullName} onChange={(e) => onChange("fullName", e.target.value)} className="mt-1 bg-card border-border text-foreground" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <Input value={form.phone} onChange={(e) => onChange("phone", e.target.value)} className="mt-1 bg-card border-border text-foreground" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Address Line 1</Label>
                <Input value={form.line1} onChange={(e) => onChange("line1", e.target.value)} className="mt-1 bg-card border-border text-foreground" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Address Line 2</Label>
                <Input value={form.line2} onChange={(e) => onChange("line2", e.target.value)} className="mt-1 bg-card border-border text-foreground" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <Label className="text-xs text-muted-foreground">City</Label>
                  <Input value={form.city} onChange={(e) => onChange("city", e.target.value)} className="mt-1 bg-card border-border text-foreground" />
                </div>
                <div className="col-span-1">
                  <Label className="text-xs text-muted-foreground">State</Label>
                  <Input value={form.state} onChange={(e) => onChange("state", e.target.value)} className="mt-1 bg-card border-border text-foreground" />
                </div>
                <div className="col-span-1">
                  <Label className="text-xs text-muted-foreground">Pincode</Label>
                  <Input value={form.pincode} onChange={(e) => onChange("pincode", e.target.value)} className="mt-1 bg-card border-border text-foreground" />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => onChange("isDefault", e.target.checked)} />
                Set as default address
              </label>

              <div className="flex gap-3 pt-2">
                <Button onClick={onSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {editingId ? (
                    <><CheckCircle2 className="h-4 w-4 mr-2" /> Update Address</>
                  ) : (
                    <><Plus className="h-4 w-4 mr-2" /> Add Address</>
                  )}
                </Button>
                {editingId && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingId(null)
                      setForm(emptyForm)
                    }}
                    className="border-border"
                  >
                    Cancel
                  </Button>
                )}
                {returnTo && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(returnTo)}
                    className="border-border"
                  >
                    Back to Order
                  </Button>
                )}
              </div>
            </div>
          </MoringaCard>

          <div className="space-y-4">
            {addresses.length === 0 ? (
              <MoringaCard className="p-8 border-border/60 text-center" glass={true}>
                <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No saved addresses yet.</p>
              </MoringaCard>
            ) : (
              addresses.map((address) => (
                <MoringaCard key={address.id} className="p-5 border-border/60" glass={true}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-foreground">{address.fullName}</div>
                      <div className="text-sm text-muted-foreground">{address.phone}</div>
                      <div className="text-sm text-muted-foreground">{address.line1}</div>
                      <div className="text-sm text-muted-foreground">{address.city}, {address.state} - {address.pincode}</div>
                      {address.isDefault && <span className="inline-block mt-2 text-xs font-bold text-primary">Default</span>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => onEdit(address)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" onClick={() => setDefault(address.id)}><Home className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" onClick={() => onDelete(address.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </MoringaCard>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
