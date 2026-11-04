import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Ìjènkéọ́mā Multimodal Transit Engine',
    short_name: 'Ìjènkéọ́mā',
    description: "Africa's real-time multimodal navigation and ground-truth transit/price intelligence engine.",
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0B0F19',
    theme_color: '#F59E0B',
    orientation: 'portrait-primary',
    categories: ['navigation', 'travel', 'transportation', 'utilities'],
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
