import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createAdminClient()
  const baseUrl = 'https://shigruvedas.com'

  // Fetch all blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('is_published', true)

  // Fetch all recipes
  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, updated_at')
    .eq('is_active', true)

  const blogUrls = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const recipeUrls = (recipes || []).map((recipe) => ({
    url: `${baseUrl}/recipes/${recipe.id}`,
    lastModified: new Date(recipe.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const staticUrls = [
    '',
    '/about',
    '/contact',
    '/b2b',
    '/shop',
    '/blog',
    '/recipes',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...staticUrls, ...blogUrls, ...recipeUrls]
}
