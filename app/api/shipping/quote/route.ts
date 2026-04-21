import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const pincode = url.searchParams.get("pincode")?.trim() || ""
    const subtotal = Number(url.searchParams.get("subtotal") || 0)

    if (pincode.length !== 6) {
      return NextResponse.json({ error: "Valid pincode required" }, { status: 400 })
    }

    const shippingAmount = subtotal >= 1000 ? 0 : 70

    return NextResponse.json({
      shippingAmount,
      pincode,
      subtotal,
      source: "default",
      message: shippingAmount === 0 ? "Free shipping applied" : "Flat shipping applied",
    })
  } catch (error: any) {
    console.error("Shipping quote error:", error)
    return NextResponse.json({ error: "Failed to fetch shipping quote" }, { status: 500 })
  }
}
