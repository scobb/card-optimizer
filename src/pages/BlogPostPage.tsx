import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { BLOG_POSTS } from './BlogListingPage'
import { HowToChooseBestCreditCard } from './blog/HowToChooseBestCreditCard'
import { CashBackVsPointsVsMiles } from './blog/CashBackVsPointsVsMiles'

const POST_COMPONENTS: Record<string, React.ComponentType> = {
  'how-to-choose-best-credit-card': HowToChooseBestCreditCard,
  'cash-back-vs-points-vs-miles': CashBackVsPointsVsMiles,
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  useEffect(() => {
    if (!post) return
    const titles: Record<string, string> = {
      'how-to-choose-best-credit-card':
        'How to Choose the Best Credit Card for Your Spending (2026 Guide) — CardOptimizer',
      'cash-back-vs-points-vs-miles':
        'Cash Back vs Points vs Miles: Which Is Best for You? (2026) — CardOptimizer',
    }
    const descriptions: Record<string, string> = {
      'how-to-choose-best-credit-card':
        'Learn how to pick the best credit card for your spending with our data-driven guide. Covers reward types, annual fee math, sign-up bonus strategy, and wallet optimization.',
      'cash-back-vs-points-vs-miles':
        'Cash back, points, or miles — which credit card reward type earns you the most? Data-driven comparison with real card examples and scenario analysis.',
    }
    document.title = titles[post.slug] ?? `${post.title} — CardOptimizer`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute('content', descriptions[post.slug] ?? post.description)
    }

    // Article JSON-LD structured data
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      datePublished: post.publishedDate,
      dateModified: post.publishedDate,
      author: {
        '@type': 'Organization',
        name: 'CardOptimizer',
        url: 'https://cards.keylightdigital.dev',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Keylight Digital LLC',
        url: 'https://keylightdigital.com',
      },
      url: `https://cards.keylightdigital.dev/blog/${post.slug}`,
      mainEntityOfPage: `https://cards.keylightdigital.dev/blog/${post.slug}`,
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'blog-post-jsonld'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)

    return () => {
      document.title = 'CardOptimizer — Credit Card Rewards Optimizer'
      if (meta) {
        meta.setAttribute(
          'content',
          'Upload your transactions and discover which credit cards maximize your rewards. Free, private, and data-driven.'
        )
      }
      document.getElementById('blog-post-jsonld')?.remove()
    }
  }, [post])

  if (!post || !slug) return <Navigate to="/blog" replace />
  const PostContent = POST_COMPONENTS[slug]
  if (!PostContent) return <Navigate to="/blog" replace />

  return (
    <div className="space-y-6 pb-8" data-blog-post-page data-blog-post-slug={slug}>
      {/* Back link */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors min-h-[44px]"
        data-back-to-blog
      >
        <ArrowLeft size={14} />
        All articles
      </Link>

      {/* Article header */}
      <header className="space-y-4 pb-6 border-b border-gray-200">
        <span className="inline-block text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
          {post.category}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight" data-article-title>
          {post.title}
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">{post.description}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <User size={14} />
            CardOptimizer Team
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date(post.publishedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {post.readingMinutes} min read
          </span>
        </div>
      </header>

      {/* Article body */}
      <article
        className="prose prose-gray max-w-none prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline"
        data-article-body
      >
        <PostContent />
      </article>
    </div>
  )
}
