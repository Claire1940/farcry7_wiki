import Link from 'next/link'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.farcry7.wiki'
  const path = '/about'

  return {
    title: 'About Far Cry 7 Wiki - Unofficial News & Release Tracker',
    description: 'Learn about Far Cry 7 Wiki, a community-driven hub tracking verified Ubisoft announcements, release date news, trailers, platforms, and clearly labeled rumors for the unannounced Far Cry 7.',
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: 'Far Cry 7 Wiki',
      title: 'About Far Cry 7 Wiki',
      description: 'Learn about our mission to track every verified Far Cry 7 update and clearly separate news from rumor.',
      images: [
        {
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          alt: 'Far Cry 7 Wiki',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About Far Cry 7 Wiki',
      description: 'Learn about our mission to track every verified Far Cry 7 update.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Far Cry 7 Wiki
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            Your community-driven tracker for verified Far Cry 7 news
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Welcome to Far Cry 7 Wiki</h2>
            <p>
              Far Cry 7 Wiki is an <strong>unofficial, fan-made tracker website</strong> dedicated to following the next
              entry in the Far Cry series. We are a community-driven platform that collects and summarizes verified
              Ubisoft announcements, release date news, trailers, platform details, and clearly labeled rumors to help
              you stay informed.
            </p>
            <p>
              Whether you are waiting for an official reveal, tracking the latest earnings-call hints, or trying to
              separate credible leaks from speculation, Far Cry 7 Wiki is here to help you make sense of it all.
            </p>
            <p className="text-slate-400 italic text-sm">
              A game titled "Far Cry 7" has not been officially announced as of the last update. We track both official
              signals and clearly labeled rumors.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Our Mission</h2>
            <p>
              Our mission is simple: <strong>to help Far Cry fans cut through the noise with accurate, clearly sourced
              information</strong>. We strive to:
            </p>
            <ul>
              <li><strong>Verify before publishing:</strong> Distinguish official Ubisoft statements from rumors and leaks</li>
              <li><strong>Track every signal:</strong> Follow release dates, platforms, trailers, setting, and story as they emerge</li>
              <li><strong>Label clearly:</strong> Mark every rumor, leak, or piece of speculation so it is never mistaken for fact</li>
              <li><strong>Stay accessible:</strong> Keep all resources free and easy to follow for fans in multiple languages</li>
            </ul>

            <h2>Our Vision</h2>
            <p>
              We envision Far Cry 7 Wiki as the <strong>go-to destination</strong> for every Far Cry fan who wants a
              trustworthy, up-to-date picture of what is officially confirmed and what is still speculation.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Track</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature Card 1 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">📅</div>
              <h3 className="text-xl font-semibold text-white mb-2">Release Date Tracking</h3>
              <p className="text-slate-300">
                A clear timeline of official release windows, preorder details, and version differences
                as soon as Ubisoft confirms them.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">📰</div>
              <h3 className="text-xl font-semibold text-white mb-2">News &amp; Announcements</h3>
              <p className="text-slate-300">
                Summaries of official Ubisoft posts, earnings calls, interviews, and events, with links back
                to the original sources.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🎮</div>
              <h3 className="text-xl font-semibold text-white mb-2">Platforms Coverage</h3>
              <p className="text-slate-300">
                Confirmed platforms, storefronts, subscription services, and cross-platform support as details
                become available.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🎬</div>
              <h3 className="text-xl font-semibold text-white mb-2">Trailers &amp; Media</h3>
              <p className="text-slate-300">
                Official teasers, reveals, and gameplay trailers, with concept videos marked separately so they
                are never confused with the real thing.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🗺️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Setting &amp; Story</h3>
              <p className="text-slate-300">
                Roundups of the world, map, factions, and characters, built only from officially revealed details
                with spoiler warnings where relevant.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Rumors &amp; Leaks</h3>
              <p className="text-slate-300">
                Reported leaks and rumors collected in one place, each clearly labeled with its source, date, and
                credibility so you can judge for yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Community-Driven</h2>
            <p>
              Far Cry 7 Wiki is built <strong>by the community, for the community</strong>. We welcome tips,
              feedback, and corrections from fans who follow the Far Cry series closely. Our content is constantly
              evolving based on:
            </p>
            <ul>
              <li><strong>Official updates:</strong> We monitor Ubisoft channels and adjust our content accordingly</li>
              <li><strong>Community tips:</strong> Readers share discoveries, sources, and clarifications</li>
              <li><strong>Source verification:</strong> We trace every claim back to its original source before labeling it</li>
              <li><strong>Credibility tracking:</strong> We revisit rumors when new evidence confirms or debunks them</li>
            </ul>
            <p>
              <strong>Want to contribute?</strong> Whether you have spotted an outdated detail, found a new official
              source, or want to suggest an improvement, we'd love to hear from you! Reach out through our contact
              channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>About the Team</h2>
            <p>
              Far Cry 7 Wiki is maintained by a dedicated team of passionate Far Cry fans and writers who love
              the series as much as you do. We're fans first, constantly tracking official channels, evaluating
              sources, and keeping our coverage honest and up to date.
            </p>
            <p>
              Our team combines expertise in:
            </p>
            <ul>
              <li><strong>Source verification:</strong> Separating official Ubisoft statements from speculation</li>
              <li><strong>Web development:</strong> Building fast, user-friendly tracking tools and pages</li>
              <li><strong>Content creation:</strong> Writing clear, accurate summaries and roundups</li>
              <li><strong>Community management:</strong> Listening to fan feedback and keeping the discussion productive</li>
            </ul>
            <p className="text-slate-400 italic text-sm">
              We track the signals so you don't have to.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Important Disclaimer</h2>
            <p className="text-yellow-400/90">
              <strong>Far Cry 7 Wiki is an unofficial fan-made website.</strong> We are NOT affiliated with,
              endorsed by, or associated with Ubisoft Entertainment or the developers and publishers of the
              Far Cry series. A game titled "Far Cry 7" has not been officially announced as of the last update.
            </p>
            <p>
              All game content, trademarks, characters, and assets are the property of their respective owners.
              We use game-related content under fair use principles for informational and educational purposes only.
              Rumors and leaks are clearly labeled and may turn out to be inaccurate.
            </p>
            <p>
              Far Cry 7 Wiki is a non-profit, community resource created by fans, for fans.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Get in Touch</h2>
            <p>
              We'd love to hear from you! Whether you have questions, suggestions, found an error, or just want to say hi:
            </p>
            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">General Inquiries</h3>
                <a href="mailto:contact@farcry7.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  contact@farcry7.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">News Tips &amp; Sources</h3>
                <a href="mailto:support@farcry7.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  support@farcry7.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Content Submissions</h3>
                <a href="mailto:contribute@farcry7.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  contribute@farcry7.wiki
                </a>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-2">Partnerships</h3>
                <a href="mailto:partnerships@farcry7.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  partnerships@farcry7.wiki
                </a>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              <strong>Response Time:</strong> We aim to respond to all inquiries within 2-3 business days.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-orange-900/30 to-amber-900/30 border-y border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Stay updated with the latest Far Cry 7 news, trailers, and verified leaks.
            Bookmark this site and check back regularly for new information!
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[hsl(var(--nav-theme-light))] text-white font-semibold hover:opacity-90 transition"
          >
            Explore Resources
          </Link>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Link href="/" className="text-[hsl(var(--nav-theme-light))] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}
