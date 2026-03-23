import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const supabase = await createAdminClient()
    
    // Auth check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: recipes, error } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(recipes)
  } catch (error: any) {
    console.error("Fetch recipes error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const supabase = await createAdminClient()
    
    // Auth check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { 
      name, slug, description, ingredients, instructions, 
      prep_time, cook_time, servings, difficulty, cuisine, 
      calories, tags, image_url, is_active 
    } = body

    const { data: recipe, error } = await supabase
      .from("recipes")
      .insert([{
        name,
        slug,
        description,
        ingredients,
        instructions,
        prep_time: parseInt(prep_time) || null,
        cook_time: parseInt(cook_time) || null,
        servings: parseInt(servings) || null,
        difficulty,
        cuisine,
        calories: parseInt(calories) || null,
        tags,
        image_url,
        is_active,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(recipe)
  } catch (error: any) {
    console.error("Create recipe error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
