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
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { format } from "date-fns"
import { Edit, Trash2, Globe, Lock, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface RecipesListProps {
  initialRecipes: any[]
}

export default function RecipesList({ initialRecipes }: RecipesListProps) {
  const [recipes, setRecipes] = useState(initialRecipes)

  const handleDelete = async (recipeId: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return

    try {
      const response = await fetch(`/api/admin/recipes/${recipeId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete recipe")

      setRecipes(recipes.filter(r => r.id !== recipeId))
      toast.success("Recipe deleted")
    } catch (error) {
      toast.error("Error deleting recipe")
    }
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-100/50">
            <TableRow>
              <TableHead className="py-4 px-6">Recipe</TableHead>
              <TableHead className="py-4">Status</TableHead>
              <TableHead className="py-4">Difficulty</TableHead>
              <TableHead className="py-4">Created</TableHead>
              <TableHead className="py-4 text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                  No recipes found
                </TableCell>
              </TableRow>
            ) : (
              recipes.map((recipe) => (
                <TableRow key={recipe.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        {recipe.image_url ? (
                          <Image src={recipe.image_url} alt={recipe.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Utensils className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate max-w-[300px]">{recipe.name}</div>
                        <div className="text-xs text-gray-400 font-mono">{recipe.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {recipe.is_active ? (
                      <Badge className="bg-green-100 text-green-700 flex items-center w-fit gap-1" variant="secondary">
                        <Globe className="h-3 w-3" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600 flex items-center w-fit gap-1" variant="secondary">
                        <Lock className="h-3 w-3" />
                        Hidden
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className={`
                      text-[10px] uppercase tracking-wider
                      ${recipe.difficulty === 'Easy' ? 'text-green-600 border-green-200 bg-green-50' : 
                        recipe.difficulty === 'Medium' ? 'text-orange-600 border-orange-200 bg-orange-50' : 
                        'text-red-600 border-red-200 bg-red-50'}
                    `}>
                      {recipe.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-gray-500 text-sm">
                    {format(new Date(recipe.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="py-4 text-right px-6">
                    <div className="flex items-center justify-end gap-2">
                       <Link href={`/admin/recipes/${recipe.id}/edit`}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          title="Edit Recipe"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(recipe.id)}
                        title="Delete Recipe"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
