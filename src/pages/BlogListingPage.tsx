import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight, Calendar, Clock } from 'lucide-react'

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedDate: string
  readingMinutes: number
  category: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-choose-best-credit-card',
    title: 'How to Choose the Best Credit Card for Your Spending',
    description:
      'A data-driven guide to selecting the right credit cards based on your actual spending pattern. Covers reward types, annual fee math, sign-up bonus strategy, and how to build an optimal wallet.',
    publishedDate: '2026-04-13',
    readingMinutes: 10,
    category: 'Card Strategy',
  },
]

export function BlogListingPage() {
  useEffect(() => {
    document.title = 'Credit Card Strategy Blog — CardOptimizer'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'Expert guides on credit card rewards strategy, annual fee math, sign-up bonuses, and building the optimal wallet for your spending habits.'
      )
    }
    return () => {
      document.title = 'CardOptimizer — Credit Card Rewards Optimizer'
      if (meta) {
        meta.setAttribute(
          'content',
          'Upload your transactions and discover which credit cards maximize your rewards. Free, private, and data-driven.'
        )
      }
    }
  }, [])

  return (
    <div className="space-y-8 pb-8" data-blog-listing>
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white px-6 py-10 sm:px-10 sm:py-12 space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <BookOpen size={24} />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center">
          Credit Card Strategy
        </h1>
        <p className="text-blue-100 text-base max-w-md mx-auto leading-relaxed text-center">
          Data-driven guides to maximize your credit card rewards — no fluff, just math.
        </p>
      </section>

      {/* Post list */}
      <section className="space-y-4" data-blog-posts>
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all"
            data-blog-post={post.slug}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 space-y-2">
                <span className="inline-block text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {post.category}
                </span>
                <h2 className="text-xl font-bold text-gray-900 leading-snug">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="hover:text-blue-700 transition-colors"
                    data-post-link={post.slug}
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">{post.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(post.publishedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readingMinutes} min read
                  </span>
                </div>
              </div>
              <Link
                to={`/blog/${post.slug}`}
                className="flex-shrink-0 flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
              >
                Read article <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* CTA */}
      <section className="rounded-xl bg-blue-50 border border-blue-200 px-6 py-8 text-center space-y-3">
        <h2 className="text-lg font-bold text-blue-900">Ready to optimize your wallet?</h2>
        <p className="text-blue-800 text-sm">
          Stop guessing — upload your transactions and see exactly which cards work best for your
          spending.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors min-h-[44px]"
          data-blog-listing-cta
        >
          Analyze My Spending <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
