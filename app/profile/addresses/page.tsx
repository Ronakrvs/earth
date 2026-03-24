"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
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

const STORAGE_KEY = "shigru_addresses_v1"

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

export default function ProfileAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [form, setForm] = useState<Omit<Address, "id">>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as Address[]
      if (Array.isArray(parsed)) setAddresses(parsed)
    } catch {
      // ignore malformed storage
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses))
  }, [addresses])

  const hasDefault = useMemo(() => addresses.some((a) => a.isDefault), [addresses])

  const onChange = (key: keyof Omit<Address, "id">, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const validate = () => {
    return form.fullName.trim() && form.phone.trim() && form.line1.trim() && form.city.trim() && form.state.trim() && form.pincode.trim()
  }

  const onSubmit = () => {
    if (!validate()) return

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id !== editingId) {
            return form.isDefault ? { ...a, isDefault: false } : a
          }
          return { ...a, ...form }
        })
      )
      setEditingId(null)
    } else {
      const next: Address = {
        id: crypto.randomUUID(),
        ...form,
        isDefault: !hasDefault || form.isDefault,
      }

      setAddresses((prev) => {
        if (!next.isDefault) return [...prev, next]
        return [...prev.map((a) => ({ ...a, isDefault: false })), next]
      })
    }

    setForm(emptyForm)
  }

  const onEdit = (address: Address) => {
    setEditingId(address.id)
    const { id, ...rest } = address
    setForm(rest)
  }

  const onDelete = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id)
      if (!filtered.some((a) => a.isDefault) && filtered[0]) filtered[0].isDefault = true
      return [...filtered]
    })

    if (editingId === id) {
      setEditingId(null)
      setForm(emptyForm)
    }
  }

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
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
              </div>
            </div>
          </MoringaCard>

          <MoringaCard className="p-8 border-border/60" glass={true}>
            <h2 className="text-lg font-black text-foreground mb-6 italic">Saved Addresses</h2>
            {addresses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MapPin className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No addresses added yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-border p-4 bg-card/70">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          <Home className="h-4 w-4 text-primary" /> {a.fullName}
                          {a.isDefault && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">Default</span>}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{a.phone}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} - {a.pincode}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(a)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => onDelete(a.id)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {!a.isDefault && (
                      <Button variant="outline" onClick={() => setDefault(a.id)} className="mt-3 border-border text-foreground hover:bg-muted">
                        Set as Default
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </MoringaCard>
        </div>
      </div>
    </div>
  )
}
