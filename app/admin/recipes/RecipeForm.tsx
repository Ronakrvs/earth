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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import ImageUpload from "@/components/admin/ImageUpload"

const recipeSchema = z.object({
  name: z.string().min(3, "Name is required"),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().optional(),
  ingredients: z.array(z.object({ value: z.string().min(1, "Ingredient cannot be empty") })),
  instructions: z.array(z.object({ value: z.string().min(1, "Instruction cannot be empty") })),
  prep_time: z.string().optional(),
  cook_time: z.string().optional(),
  servings: z.string().optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  cuisine: z.string().optional(),
  calories: z.string().optional(),
  tags: z.string().transform(val => val.split(",").map(t => t.trim()).filter(t => t !== "")),
  image_url: z.string().optional(),
  is_active: z.boolean().default(true),
})

interface RecipeFormProps {
  initialData?: any
}

export default function RecipeForm({ initialData }: RecipeFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof recipeSchema>>({
    resolver: zodResolver(recipeSchema),
    defaultValues: initialData ? {
      ...initialData,
      ingredients: initialData.ingredients?.map((i: string) => ({ value: i })) || [],
      instructions: initialData.instructions?.map((i: string) => ({ value: i })) || [],
      tags: initialData.tags?.join(", ") || "",
      prep_time: initialData.prep_time?.toString() || "",
      cook_time: initialData.cook_time?.toString() || "",
      servings: initialData.servings?.toString() || "",
      calories: initialData.calories?.toString() || "",
    } : {
      name: "",
      slug: "",
      description: "",
      ingredients: [{ value: "" }],
      instructions: [{ value: "" }],
      prep_time: "",
      cook_time: "",
      servings: "",
      difficulty: "Easy",
      cuisine: "",
      calories: "",
      tags: "",
      image_url: "",
      is_active: true,
    },
  })

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control,
    name: "ingredients"
  })

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control: form.control,
    name: "instructions"
  })

  const onSubmit = async (values: z.infer<typeof recipeSchema>) => {
    try {
      setLoading(true)
      // Transform ingredients and instructions back to string arrays
      const formattedValues = {
        ...values,
        ingredients: values.ingredients.map(i => i.value),
        instructions: values.instructions.map(i => i.value),
      }

      const url = initialData ? `/api/admin/recipes/${initialData.id}` : "/api/admin/recipes"
      const method = initialData ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedValues),
      })

      if (!response.ok) throw new Error("Failed to save recipe")

      toast.success(initialData ? "Recipe updated" : "Recipe created")
      router.push("/admin/recipes")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-12">
        <div className="flex items-center justify-between">
          <Link href="/admin/recipes">
            <Button variant="ghost" size="sm" type="button">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Recipes
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {initialData ? "Update Recipe" : "Create Recipe"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle>Basic details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipe Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Moringa Smoothy" {...field} />
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
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="recipe-slug" {...field} />
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Briefly describe the recipe..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ingredients</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => appendIngredient({ value: "" })}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {ingredientFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder={`Ingredient ${index + 1}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeIngredient(index)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Instructions</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => appendInstruction({ value: "" })}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {instructionFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`instructions.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Textarea placeholder={`Step ${index + 1}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeInstruction(index)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle>Image</CardTitle>
              </CardHeader>
              <CardContent>
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
                          bucket="recipes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="prep_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prep Time (min)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cook_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cook Time (min)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <FormField
                    control={form.control}
                    name="servings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Servings</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="cuisine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuisine</FormLabel>
                      <FormControl>
                        <Input placeholder="Indian, Italian..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="healthy, protein, vegan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <p className="text-xs text-gray-500">Show this recipe on the website</p>
                      </div>
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
