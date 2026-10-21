import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.bhadradripapikondalu.com'

const PACKAGE_SLUGS = [
  'rajahmundry-papikondalu-packages',
  'bhadrachalam-papikondalu-packages',
  'sirivaka-night-stay-package',
  'papikondalu-packages',
  'maredumilli-packages',
  'parnasala-packages',
  'rampachodavaram-waterfalls-tour-package',
  'gudisa-packages',
  'perantalapalli-packages',
]

const BLOG_SLUGS = [
  'papikondalu-bhadradri-magical-beauty',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                              priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/packages`,                priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/about`,                   priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/attractions`,             priority: 0.8, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/gallery`,                 priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/contact`,                 priority: 0.7, changeFrequency: 'yearly' },
    { url: `${BASE_URL}/faq`,                     priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/blog`,                    priority: 0.6, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/book`,                    priority: 0.6, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/cancellation-policy`,     priority: 0.4, changeFrequency: 'yearly' },
    { url: `${BASE_URL}/privacy-policy`,          priority: 0.3, changeFrequency: 'yearly' },
    { url: `${BASE_URL}/refund-policy`,           priority: 0.3, changeFrequency: 'yearly' },
    { url: `${BASE_URL}/terms-and-conditions`,    priority: 0.3, changeFrequency: 'yearly' },
  ]

  const packageRoutes: MetadataRoute.Sitemap = PACKAGE_SLUGS.map(slug => ({
    url: `${BASE_URL}/packages/${slug}`,
    priority: 0.9,
    changeFrequency: 'monthly' as const,
  }))

  const blogRoutes: MetadataRoute.Sitemap = BLOG_SLUGS.map(slug => ({
    url: `${BASE_URL}/blog/${slug}`,
    priority: 0.6,
    changeFrequency: 'yearly' as const,
  }))

  return [...staticRoutes, ...packageRoutes, ...blogRoutes]
}
