'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Target, 
  BarChart3, 
  Shield, 
  Check, 
  Menu, 
  X, 
  Star, 
  ChevronUp,
  Sparkles,
  Users,
  Clock,
  Award,
  TrendingUp,
  FileText,
  Brain,
  Rocket
} from 'lucide-react'

// AnimatedCounter component with smooth animation
function AnimatedCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const steps = 60
    const increment = target / steps
    const stepDuration = duration / steps
    
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepDuration)
    
    return () => clearInterval(timer)
  }, [target, duration])
  
  return <span>{count.toLocaleString()}{suffix}</span>
}

// Enhanced FeatureDemo component with better animations
function FeatureDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = [
    { title: "Upload Resume", icon: FileText, color: "blue" },
    { title: "Add Job Description", icon: Target, color: "purple" }, 
    { title: "AI Analysis", icon: Brain, color: "green" },
    { title: "Download Optimized Resume", icon: Rocket, color: "orange" }
  ]
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev: number) => (prev + 1) % steps.length)
    }, 3000)
    
    return () => clearInterval(timer)
  }, [steps.length])
  
  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-16 translate-x-16"></div>
      
      <div className="space-y-4 relative">
        {steps.map((step, index) => {
          const Icon = step.icon
          const colorClasses = {
            blue: 'border-blue-500 bg-blue-50 text-blue-900',
            purple: 'border-purple-500 bg-purple-50 text-purple-900',
            green: 'border-green-500 bg-green-50 text-green-900',
            orange: 'border-orange-500 bg-orange-50 text-orange-900'
          }
          
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 transition-all duration-500 transform ${
                index === currentStep
                  ? `${colorClasses[step.color as keyof typeof colorClasses]} scale-105 shadow-lg`
                  : index < currentStep
                  ? 'border-green-500 bg-green-50 text-green-900'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg'
                      : index < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1">
                  <span className={`font-semibold text-sm md:text-base transition-colors duration-300`}>
                    {step.title}
                  </span>
                  {index === currentStep && (
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                      <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Floating elements animation
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-20" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-20" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-20" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-orange-400 rounded-full animate-bounce opacity-20" style={{ animationDelay: '0.5s' }}></div>
    </div>
  )
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [, setMousePosition] = useState({ x: 0, y: 0 })

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setShowScrollTop(scrollPosition > 500)

      const sections = ['hero', 'features', 'pricing', 'about']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
    setIsMenuOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <FloatingElements />
      
      {/* Header with glassmorphism effect */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">RT</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Resume Tailor</span>
              <div className="text-xs text-gray-500">AI-Powered</div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['features', 'pricing', 'about'].map((section) => (
              <button 
                key={section}
                onClick={() => scrollToSection(section)}
                className={`text-gray-600 hover:text-gray-900 transition-all duration-300 capitalize relative group ${
                  activeSection === section ? 'text-blue-600 font-medium' : ''
                }`}
              >
                {section}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/signin">
              <Button variant="ghost" className="hover:scale-105 transition-transform">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-lg">
                Get Started
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-md shadow-lg">
            <div className="container mx-auto px-4 py-6 space-y-4">
              {['features', 'pricing', 'about'].map((section) => (
                <button 
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors capitalize py-2 hover:bg-gray-50 rounded-lg px-3"
                >
                  {section}
                </button>
              ))}
              <div className="border-t pt-4 space-y-3">
                <Link href="/signin" className="block">
                  <Button variant="ghost" className="w-full">Sign In</Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    Get Started
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Hero Section */}
      <section id="hero" className="py-24 px-4 relative">
        <div className="container mx-auto text-center max-w-5xl relative">
          {/* Hero Badge with animation */}
          <div className="mb-8">
            <Badge variant="secondary" className="text-sm px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse">
              <Rocket className="w-4 h-4 mr-2" />
              🚀 AI-Powered Resume Optimization
            </Badge>
          </div>

          {/* Main Heading with improved typography */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Tailor Your Resume for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
              {" "}Every Job
            </span>
          </h1>
          
          {/* Enhanced subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Get more interviews with AI-powered resume optimization. Analyze job descriptions, 
            match keywords, and create tailored resumes in seconds.
          </p>
          
          {/* CTA Buttons with better styling */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="text-lg px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 rounded-full"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/onboarding/welcome">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 py-4 hover:scale-105 transition-all duration-300 border-2 hover:bg-gray-50 rounded-full"
              >
                See How It Works
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 mb-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>7-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-purple-500" />
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: 10000, suffix: "+", label: "Resumes Optimized", icon: FileText, color: "blue" },
              { number: 85, suffix: "%", label: "Interview Rate Increase", icon: TrendingUp, color: "purple" },
              { number: 5000, suffix: "+", label: "Users Hired", icon: Users, color: "green" }
            ].map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-${stat.color}-100 mb-4 group-hover:shadow-lg transition-shadow`}>
                  <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                </div>
                <div className={`text-4xl font-bold text-${stat.color}-600 mb-2`}>
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-white/50 backdrop-blur-sm">
              <Brain className="w-4 h-4 mr-2" />
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get Your Resume Optimized in 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> 4 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI does the heavy lifting while you focus on landing your dream job.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FeatureDemo />
            <div className="space-y-8">
              {[
                {
                  number: 1,
                  title: "Upload Your Resume",
                  description: "Upload your existing resume in PDF or DOCX format. Our AI will analyze your content, structure, and formatting instantly.",
                  icon: FileText,
                  color: "blue"
                },
                {
                  number: 2,
                  title: "Add Job Description",
                  description: "Paste the job description you're applying for. Our AI identifies key requirements, skills, and industry-specific keywords.",
                  icon: Target,
                  color: "purple"
                },
                {
                  number: 3,
                  title: "AI Optimization",
                  description: "Our advanced AI matches your skills with job requirements, optimizes keywords, and improves formatting for ATS compatibility.",
                  icon: Brain,
                  color: "green"
                },
                {
                  number: 4,
                  title: "Download & Apply",
                  description: "Download your optimized resume and start applying with confidence. Track your success rate and iterate for better results.",
                  icon: Rocket,
                  color: "orange"
                }
              ].map((step, index) => {
                const Icon = step.icon
                const colorClasses = {
                  blue: 'bg-blue-500 shadow-blue-500/25',
                  purple: 'bg-purple-500 shadow-purple-500/25',
                  green: 'bg-green-500 shadow-green-500/25',
                  orange: 'bg-orange-500 shadow-orange-500/25'
                }
                
                return (
                  <div key={index} className="flex items-start space-x-6 group">
                    <div className={`w-16 h-16 ${colorClasses[step.color as keyof typeof colorClasses]} text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-24 px-4 bg-white relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">
              <Star className="w-4 h-4 mr-2" />
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Resume Tailor?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform helps you create targeted resumes that get noticed by recruiters and ATS systems.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "AI-Powered Analysis",
                description: "Advanced AI analyzes job descriptions and optimizes your resume for maximum impact with industry-specific insights.",
                color: "blue",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Target,
                title: "Keyword Optimization",
                description: "Automatically match important keywords and phrases to beat ATS filters and rank higher in applicant searches.",
                color: "purple",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: BarChart3,
                title: "Performance Analytics",
                description: "Track your application success rate and optimize your job search strategy with detailed performance insights.",
                color: "green",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: CheckCircle,
                title: "Multiple Versions",
                description: "Create and manage multiple resume versions for different job types, industries, and career levels effortlessly.",
                color: "orange",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: Shield,
                title: "Privacy First",
                description: "Your data is encrypted and secure with enterprise-grade security. We never share your information with third parties.",
                color: "red",
                gradient: "from-red-500 to-pink-500"
              },
              {
                icon: ArrowRight,
                title: "Easy Integration",
                description: "Seamlessly integrate with popular job boards, LinkedIn, and application tracking systems for streamlined applications.",
                color: "indigo",
                gradient: "from-indigo-500 to-purple-500"
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden bg-white">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient}`}></div>
                  <CardHeader className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-white/50 backdrop-blur-sm">
              <Award className="w-4 h-4 mr-2" />
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for you. All plans include a 7-day free trial with full access.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 border-gray-200 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white relative">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-2xl font-bold">Starter</CardTitle>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-600 text-lg">/month</span>
                </div>
                <CardDescription className="text-base">Perfect for trying out our platform</CardDescription>
              </CardHeader>
              <div className="space-y-4 mb-8">
                {[
                  "3 resume optimizations",
                  "Basic keyword matching",
                  "PDF export",
                  "Email support"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/signup?plan=starter">
                <Button variant="outline" className="w-full hover:scale-105 transition-transform text-base py-3 rounded-xl">
                  Get Started Free
                </Button>
              </Link>
            </Card>

            {/* Pro Plan - Featured */}
            <Card className="border-2 border-blue-500 p-8 relative hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 scale-105 bg-white">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-1 text-sm font-semibold shadow-lg">
                Most Popular
              </Badge>
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-2xl font-bold">Professional</CardTitle>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-gray-600 text-lg">/month</span>
                </div>
                <CardDescription className="text-base">Best for active job seekers</CardDescription>
              </CardHeader>
              <div className="space-y-4 mb-8">
                {[
                  "Unlimited optimizations",
                  "Advanced AI analysis",
                  "Multiple resume versions",
                  "Application tracking",
                  "Priority support",
                  "Cover letter optimization"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/signup?plan=pro">
                <Button className="w-full hover:scale-105 transition-transform text-base py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                  Start Free Trial
                </Button>
              </Link>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-gray-200 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white relative">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-gray-600 text-lg">/month</span>
                </div>
                <CardDescription className="text-base">For teams and recruiters</CardDescription>
              </CardHeader>
              <div className="space-y-4 mb-8">
                {[
                  "Everything in Professional",
                  "Team collaboration tools",
                  "Advanced analytics dashboard",
                  "API access",
                  "Dedicated account manager",
                  "Custom integrations"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact?plan=enterprise">
                <Button variant="outline" className="w-full hover:scale-105 transition-transform text-base py-3 rounded-xl border-2 hover:bg-orange-50 hover:border-orange-500">
                  Contact Sales
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/30 to-purple-50/30 pointer-events-none"></div>
        <div className="container mx-auto max-w-7xl relative">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">
              <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Users 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of professionals who have transformed their job search and landed their dream jobs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Anderson",
                role: "Software Engineer",
                company: "Fortune 500",
                initials: "SA",
                rating: 5,
                text: "Resume Tailor helped me land my dream job at a Fortune 500 company. The AI optimization was incredible - I went from 2% to 15% callback rate!",
                color: "blue"
              },
              {
                name: "Michael Johnson",
                role: "Marketing Manager",
                company: "Tech Startup",
                initials: "MJ",
                rating: 5,
                text: "I got 3x more interview calls after using Resume Tailor. The keyword optimization really works - it's like having a personal career coach!",
                color: "green"
              },
              {
                name: "Emily Rodriguez",
                role: "Data Analyst",
                company: "Healthcare Corp",
                initials: "ER",
                rating: 5,
                text: "As a career changer, Resume Tailor helped me highlight transferable skills effectively. I landed 4 interviews in my first week. Highly recommend!",
                color: "purple"
              }
            ].map((testimonial, index) => {
              const colorClasses = {
                blue: 'from-blue-100 to-blue-200 text-blue-700 border-blue-200',
                green: 'from-green-100 to-green-200 text-green-700 border-green-200',
                purple: 'from-purple-100 to-purple-200 text-purple-700 border-purple-200'
              }
              
              return (
                <Card key={index} className="p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 shadow-lg relative overflow-hidden group bg-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
                  
                  <div className="flex items-center mb-6 relative">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 mb-8 leading-relaxed text-base relative italic">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center space-x-4 relative">
                    <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[testimonial.color as keyof typeof colorClasses]} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className="font-bold text-lg">{testimonial.initials}</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-white/50 backdrop-blur-sm">
              <Award className="w-4 h-4 mr-2" />
              About Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Resume Tailor</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to help job seekers land their dream jobs with cutting-edge AI-powered resume optimization technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Rocket className="h-8 w-8 mr-3 text-blue-600" />
                  Our Story
                </h3>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Founded in 2024, Resume Tailor was born from the frustration of seeing talented individuals 
                    struggle to get their resumes noticed by ATS systems and recruiters in an increasingly competitive job market.
                  </p>
                  <p>
                    Our team of AI engineers, career coaches, and recruitment experts came together to create 
                    a solution that levels the playing field for all job seekers, regardless of their background or experience level.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { number: "10K+", label: "Resumes Optimized", icon: FileText },
                  { number: "85%", label: "Success Rate", icon: TrendingUp },
                  { number: "5K+", label: "Users Hired", icon: Users }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-20 translate-x-20"></div>
              
              <div className="relative space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Target className="h-6 w-6 mr-3 text-purple-600" />
                    Our Mission
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    To democratize access to career opportunities by providing AI-powered tools that help 
                    every job seeker present their best professional self and connect with their ideal roles.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="h-6 w-6 mr-3 text-green-600" />
                    Our Vision
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    A world where talent is recognized regardless of how well someone can write a resume, 
                    where AI helps bridge the gap between skills and opportunities for everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto text-center max-w-4xl relative">
          <div className="mb-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
              <Rocket className="w-4 h-4 mr-2" />
              Ready to Get Started?
            </Badge>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Land Your 
            <span className="text-yellow-300"> Dream Job?</span>
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
            Join thousands of professionals who have improved their job search success with Resume Tailor. 
            Start your free trial today and see the difference AI can make.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-4 hover:scale-105 transition-all duration-300 shadow-2xl bg-white text-blue-600 hover:bg-gray-50 rounded-full font-semibold">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/onboarding/welcome">
              <Button size="lg" variant="outline" className="text-lg px-10 py-4 hover:scale-105 transition-all duration-300 border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-full font-semibold">
                Watch Demo
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center items-center gap-8 mt-8 text-blue-100 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>7-day free trial</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>
        
        <div className="container mx-auto max-w-7xl relative">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">RT</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="text-2xl font-bold">Resume Tailor</span>
                  <div className="text-sm text-gray-400">AI-Powered Optimization</div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Transforming job searches with cutting-edge AI technology. Help professionals land their dream jobs 
                by creating optimized, ATS-friendly resumes that stand out.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'github'].map((social) => (
                  <div key={social} className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                    <div className="w-5 h-5 bg-gray-400 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Columns */}
            <div>
              <h3 className="font-bold mb-6 text-lg">Product</h3>
              <ul className="space-y-3 text-gray-400">
                {['Features', 'Pricing', 'API', 'Templates'].map((item) => (
                  <li key={item}>
                    <button className="hover:text-white transition-colors hover:translate-x-1 transform duration-200">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-gray-400">
                {['About', 'Contact', 'Careers', 'Blog'].map((item) => (
                  <li key={item}>
                    <button className="hover:text-white transition-colors hover:translate-x-1 transform duration-200">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-400">
                {['Help Center', 'Privacy', 'Terms', 'Security'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase().replace(' ', '')}`} className="hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; 2024 Resume Tailor. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Made with ❤️ for job seekers worldwide</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl shadow-2xl hover:shadow-blue-500/25 hover:scale-110 transition-all duration-300 z-50 group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </div>
  )
}