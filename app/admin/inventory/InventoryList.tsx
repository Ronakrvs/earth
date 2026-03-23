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
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InventoryListProps {
  initialInventory: any[]
}

export default function InventoryList({ initialInventory }: InventoryListProps) {
  const [inventory, setInventory] = useState(initialInventory)
  const [savingId, setSavingId] = useState<string | null>(null)

  const handleStockChange = (id: string, value: string) => {
    const val = parseInt(value) || 0
    setInventory(inventory.map(item => item.id === id ? { ...item, stock: val } : item))
  }

  const saveStock = async (id: string, stock: number) => {
    try {
      setSavingId(id)
      const response = await fetch(`/api/admin/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock }),
      })

      if (!response.ok) throw new Error("Failed to update stock")

      toast.success("Stock updated successfully")
    } catch (error) {
      toast.error("Error updating stock")
    } finally {
      setSavingId(null)
    }
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-100/50">
            <TableRow>
              <TableHead className="py-4 px-6">Product / Variant</TableHead>
              <TableHead className="py-4">SKU</TableHead>
              <TableHead className="py-4">Status</TableHead>
              <TableHead className="py-4 w-[150px]">Stock Level</TableHead>
              <TableHead className="py-4 text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                  No inventory data found
                </TableCell>
              </TableRow>
            ) : (
              inventory.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                  <TableCell className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-gray-900">{item.products?.name}</div>
                      <div className="text-xs text-gray-500 font-medium">Weight: {item.weight}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 font-mono text-xs text-gray-500">
                    {item.sku || 'N/A'}
                  </TableCell>
                  <TableCell className="py-4">
                    {item.stock <= 5 ? (
                      <Badge className="bg-red-100 text-red-700 flex items-center w-fit gap-1" variant="secondary">
                        <AlertCircle className="h-3 w-3" />
                        Low Stock
                      </Badge>
                    ) : item.stock <= 20 ? (
                      <Badge className="bg-amber-100 text-amber-700 w-fit" variant="secondary">
                        Medium Stock
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 w-fit" variant="secondary">
                        In Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <Input
                      type="number"
                      value={item.stock}
                      onChange={(e) => handleStockChange(item.id, e.target.value)}
                      className="w-24 h-8 text-sm focus:ring-green-500"
                    />
                  </TableCell>
                  <TableCell className="py-4 text-right px-6">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                      disabled={savingId === item.id}
                      onClick={() => saveStock(item.id, item.stock)}
                    >
                      <Save className="h-3.5 w-3.5 mr-1" />
                      {savingId === item.id ? "Saving..." : "Save"}
                    </Button>
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
