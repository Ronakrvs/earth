import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { isAdminSession } from "@/lib/admin-auth"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const supabase = await createAdminClient()
    
    // Auth check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!isAdminSession(session, profile?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { 
      name, slug, description, ingredients, instructions, 
      prep_time, cook_time, servings, difficulty, cuisine, 
      calories, tags, image_url, is_active 
    } = body

    const updateData: any = {
      name, slug, description, ingredients, instructions, difficulty, cuisine, tags, image_url, is_active,
      updated_at: new Date().toISOString()
    }

    if (prep_time !== undefined) updateData.prep_time = parseInt(prep_time) || null
    if (cook_time !== undefined) updateData.cook_time = parseInt(cook_time) || null
    if (servings !== undefined) updateData.servings = parseInt(servings) || null
    if (calories !== undefined) updateData.calories = parseInt(calories) || null

    const { data: recipe, error } = await supabase
      .from("recipes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(recipe)
  } catch (error: any) {
    console.error("Update recipe error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const supabase = await createAdminClient()
    
    // Auth check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!isAdminSession(session, profile?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete recipe error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
