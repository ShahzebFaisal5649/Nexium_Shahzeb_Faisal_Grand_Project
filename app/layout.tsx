import { Inter } from 'next/font/google'
// Import your global CSS
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Resume Tailor - AI-Powered Resume Optimization',
  description: 'Get more interviews with AI-powered resume optimization. Analyze job descriptions, match keywords, and create tailored resumes in seconds.',
  keywords: 'resume, AI, optimization, job search, career, ATS, keywords',
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
    googleBot: {
      index: true,
      follow: true,
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="color-scheme" content="light" />
        
        {/* Additional performance hints */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Structured data for SEO */}
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
                "priceCurrency": "USD",
                "priceValidUntil": "2025-12-31"
              },
              "creator": {
                "@type": "Organization",
                "name": "Resume Tailor"
              }
            })
          }}
        />
      </head>
      <body 
        className={`${inter.className} antialiased bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900`}
        suppressHydrationWarning
      >
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        
        <div id="root">
          <main id="main-content">
            {children}
          </main>
        </div>
        
        {/* Analytics script placeholder */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}