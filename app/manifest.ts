import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shigruvedas - Organic Moringa Farm',
    short_name: 'Shigruvedas',
    description: 'Premium organic moringa products directly from our farm in Rajasthan.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#22c55e',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
