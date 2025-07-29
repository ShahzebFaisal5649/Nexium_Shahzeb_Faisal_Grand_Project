import { Inter } from 'next/font/google'
import './globals.css'

// Optimized font loading with variable fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

export const metadata = {
  title: 'Resume Tailor - AI-Powered Resume Optimization',
  description: 'Get more interviews with AI-powered resume optimization. Analyze job descriptions, match keywords, and create tailored resumes in seconds.',
  metadataBase: new URL('https://resume-tailor.com'),
  keywords: ['resume', 'AI', 'optimization', 'job search', 'career', 'ATS', 'keywords'],
  authors: [{ name: 'Resume Tailor Team' }],
  creator: 'Resume Tailor',
  publisher: 'Resume Tailor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Resume Tailor - AI-Powered Resume Optimization',
    description: 'Get more interviews with AI-powered resume optimization. Analyze job descriptions, match keywords, and create tailored resumes in seconds.',
    url: 'https://resume-tailor.com',
    siteName: 'Resume Tailor',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Resume Tailor - AI-Powered Resume Optimization',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Tailor - AI-Powered Resume Optimization',
    description: 'Get more interviews with AI-powered resume optimization. Analyze job descriptions, match keywords, and create tailored resumes in seconds.',
    images: ['/og-image.png'],
    creator: '@resumetailor',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Responsive Meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Theme Configuration */}
        <meta name="theme-color" content="#3B82F6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1E40AF" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light dark" />
        
        {/* SEO Enhancements */}
        <link rel="canonical" href="https://resume-tailor.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Resume Tailor",
              "description": "AI-Powered Resume Optimization Platform",
              "url": "https://resume-tailor.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "19",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body className={`font-sans antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100`}>
        {/* Accessibility Skip Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to content
        </a>
        
        {/* Main Content */}
        <div id="root">
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
        </div>

        {/* Analytics - Client Component */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  var script = document.createElement('script');
                  script.src = 'https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}';
                  script.async = true;
                  document.head.appendChild(script);
                  
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                })();
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}