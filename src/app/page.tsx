
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  UserPlus, 
  Search, 
  Zap, 
  Hammer, 
  PaintRoller, 
  HardHat, 
  Sparkles, 
  Wrench, 
  Clock, 
  MapPin, 
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Shield,
  Award,
  Target,
  Rocket,
  Heart,
  Globe,
  Lightbulb,
  Play,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  FileText,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  MapPin as MapPinIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import constructionWorkersImage from "@/assets/construction_workers.png";

export default function Home() {
  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Find Your Next Job, Instantly",
      description: "Skilled workers discover local jobs that match their expertise. Whether it's an urgent fix or a scheduled project, PeakCrews connects you.",
      link: "/jobs",
      linkText: "Browse Open Jobs",
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: "Hire Skilled Trades Fast",
      description: "Contractors post job requirements and connect with reliable tradespeople. Get qualified talent when you need it most.",
      link: "/post-job",
      linkText: "Post a Job Opening",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI-Powered Job Creation",
      description: "Our intelligent assistant helps contractors create compelling job descriptions in seconds, attracting the right candidates.",
      link: "/post-job",
      linkText: "Try the AI Assistant",
      gradient: "from-blue-700 to-orange-600",
      bgGradient: "from-blue-50 to-orange-50"
    },
  ];

  const trades = [
    { name: "Electricians", icon: <Zap className="h-6 w-6" />, color: "text-orange-500", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
    { name: "Carpenters", icon: <Hammer className="h-6 w-6" />, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
    { name: "Painters", icon: <PaintRoller className="h-6 w-6" />, color: "text-blue-500", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { name: "Plumbers", icon: <Wrench className="h-6 w-6" />, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { name: "Concrete Laborers", icon: <HardHat className="h-6 w-6" />, color: "text-orange-700", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
    { name: "General Labor", icon: <HardHat className="h-6 w-6" />, color: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  ];

  const valueProps = [
    { 
      title: "Instant Matching", 
      description: "AI-powered job matching connects you with the right talent in minutes, not days",
      icon: <Zap className="h-5 w-5" />,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100"
    },
    { 
      title: "Verified Professionals", 
      description: "Every worker is background-checked and skill-verified for your peace of mind",
      icon: <Shield className="h-5 w-5" />,
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100"
    },
    { 
      title: "Secure Payments", 
      description: "Escrow protection ensures you only pay for completed work that meets your standards",
      icon: <CheckCircle className="h-5 w-5" />,
      gradient: "from-orange-600 to-orange-700",
      bgGradient: "from-orange-50 to-orange-100"
    },
    { 
      title: "24/7 Support", 
      description: "Round-the-clock customer support to help you succeed at every step",
      icon: <Clock className="h-5 w-5" />,
      gradient: "from-blue-700 to-blue-800",
      bgGradient: "from-blue-50 to-blue-100"
    },
  ];

  const benefits = [
    { text: "No hidden fees or commissions", icon: <Target className="h-4 w-4" /> },
    { text: "Verified worker profiles", icon: <Shield className="h-4 w-4" /> },
    { text: "Secure payment processing", icon: <CheckCircle className="h-4 w-4" /> },
    { text: "24/7 customer support", icon: <Clock className="h-4 w-4" /> },
    { text: "Instant job matching", icon: <Zap className="h-4 w-4" /> },
    { text: "Professional insurance coverage", icon: <Award className="h-4 w-4" /> }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Create Your Profile",
      description: "Sign up and build your professional profile. Highlight your skills, experience, and availability.",
      icon: <UserPlus className="h-6 w-6" />,
      gradient: "from-blue-600 to-blue-700"
    },
    {
      step: "02",
      title: "Find or Post Jobs",
      description: "Browse available jobs or post your requirements. Our AI matches you with the perfect opportunities.",
      icon: <Search className="h-6 w-6" />,
      gradient: "from-orange-500 to-orange-600"
    },
    {
      step: "03",
      title: "Connect & Complete",
      description: "Communicate directly, agree on terms, and complete the work with secure payment protection.",
      icon: <CheckCircle className="h-6 w-6" />,
      gradient: "from-blue-700 to-orange-600"
    }
  ];

  const testimonials = [
    {
      quote: "PeakCrews helped me find skilled workers for my construction project in just 2 hours!",
      author: "Mike Johnson",
      role: "General Contractor",
      rating: 5
    },
    {
      quote: "As an electrician, I've never had so many quality job opportunities in one place.",
      author: "Sarah Chen",
      role: "Licensed Electrician",
      rating: 5
    }
  ];

  const whyChooseUs = [
    {
      title: "Built for Trades",
      description: "Designed specifically for the construction and trades industry, understanding your unique needs and challenges.",
      icon: <Hammer className="h-6 w-6" />,
      color: "text-orange-500"
    },
    {
      title: "AI-Powered Matching",
      description: "Advanced algorithms ensure you're connected with the right people for every project, saving time and reducing risk.",
      icon: <Sparkles className="h-6 w-6" />,
      color: "text-blue-500"
    },
    {
      title: "Secure & Reliable",
      description: "Escrow payments, verified profiles, and comprehensive insurance protect everyone involved in every transaction.",
      icon: <Shield className="h-6 w-6" />,
      color: "text-orange-600"
    },
    {
      title: "24/7 Support",
      description: "Our dedicated support team is available around the clock to help you succeed with every project.",
      icon: <Clock className="h-6 w-6" />,
      color: "text-blue-600"
    }
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/30 min-h-screen">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-br from-orange-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.15),transparent_50%)]" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-24 lg:py-28">
          <div className="max-w-7xl mx-auto">
            {/* Hero Content - Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="text-center lg:text-left">
                <Badge variant="secondary" className="mb-8 px-8 py-4 text-sm font-medium bg-white/95 backdrop-blur-md border border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <Sparkles className="h-5 w-5 mr-3 text-orange-500 animate-pulse" />
                  AI-Powered Job Matching Platform
                </Badge>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight">
                  Your <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent drop-shadow-lg">Next Project</span> 
                  <br />Starts with <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-lg">PeakCrews</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                  The fast lane for skilled trades and urgent job needs. Find reliable workers or post your job in minutes, not days.
                  <br />Powered by AI to match the perfect talent with every opportunity.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center mb-12">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white font-semibold px-12 py-8 shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg transform hover:scale-105 hover:-translate-y-1" asChild>
                    <Link href="/jobs">
                      <Search className="mr-3 h-6 w-6" /> 
                      Find Work Now
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="px-12 py-8 border-2 border-blue-600 hover:bg-blue-50 bg-white/95 backdrop-blur-md shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg transform hover:scale-105 hover:-translate-y-1" asChild>
                    <Link href="/post-job">
                      <UserPlus className="mr-3 h-6 w-6" /> 
                      Hire Skilled Talent
                    </Link>
                  </Button>
                </div>
                
                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm">
                  <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-8 py-4 rounded-full border border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <Shield className="h-6 w-6 text-orange-500" />
                    <span className="font-semibold text-lg">Verified Workers</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-8 py-4 rounded-full border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <Clock className="h-6 w-6 text-blue-500" />
                    <span className="font-semibold text-lg">24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-8 py-4 rounded-full border border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <Zap className="h-6 w-6 text-green-500" />
                    <span className="font-semibold text-lg">Instant Matching</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Hero Image */}
              <div className="relative">
                <Image
                  src={constructionWorkersImage}
                  alt="Diverse group of skilled tradespeople working together"
                  width={600}
                  height={400}
                  className="rounded-3xl shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-500"
                  priority
                />
                
                {/* Enhanced Floating Stats Cards */}
                <div className="absolute -top-8 -left-8 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-orange-200 transform hover:scale-110 transition-all duration-300 hover:shadow-3xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-3xl text-orange-600">2,500+</div>
                      <div className="text-sm text-muted-foreground font-medium">Active Workers</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-8 -right-8 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-blue-200 transform hover:scale-110 transition-all duration-300 hover:shadow-3xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Briefcase className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-3xl text-blue-600">1,200+</div>
                      <div className="text-sm text-muted-foreground font-medium">Jobs Completed</div>
                    </div>
                  </div>
                </div>

                {/* New Floating Success Rate Card */}
                <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-green-200 transform hover:scale-110 transition-all duration-300 hover:shadow-3xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-xl text-green-600">98%</div>
                      <div className="text-xs text-muted-foreground font-medium">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-24 bg-gradient-to-br from-slate-50 via-white to-orange-50/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-8 px-8 py-4 text-sm font-medium bg-white/95 backdrop-blur-md border border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <Rocket className="h-6 w-6 mr-3 text-orange-500" />
              Simple 3-Step Process
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-orange-600 via-orange-700 to-blue-700 bg-clip-text text-transparent">
              How PeakCrews Works
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Getting started is simple. Whether you're looking for work or hiring talent, 
              <br />our platform makes the process seamless and efficient.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connection Lines */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-orange-400 to-blue-400 transform -translate-y-1/2 z-0" />
                )}
                
                <Card className="relative text-center p-10 h-full bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 rounded-3xl overflow-hidden group-hover:border-orange-300">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Step Number */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white font-bold text-2xl shadow-2xl border-4 border-white`}>
                        {step.step}
                      </div>
                    </div>
                    
                    {/* Icon */}
                    <div className={`p-8 rounded-3xl bg-gradient-to-br ${step.gradient} mb-8 mx-auto w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                      <div className="text-white">
                        {step.icon}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="font-bold text-3xl mb-6 text-foreground bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg font-medium">{step.description}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="w-full py-24 bg-gradient-to-br from-white via-blue-50/30 to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-8 px-8 py-4 text-sm font-medium bg-white/95 backdrop-blur-md border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <Rocket className="h-6 w-6 mr-3 text-blue-500" />
              Why We're Different
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-blue-700 to-orange-600 bg-clip-text text-transparent">
              Why PeakCrews Delivers Results
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Built for speed, security, and success in the trades industry. 
              <br />Every feature designed with real professionals in mind.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {valueProps.map((prop, index) => (
              <div key={index} className="group">
                <Card className="text-center p-8 h-full bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 rounded-3xl overflow-hidden group-hover:border-blue-300">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className={`p-8 rounded-3xl bg-gradient-to-br ${prop.gradient} mb-8 mx-auto w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                      <div className="text-white">
                        {prop.icon}
                      </div>
                    </div>
                    <h3 className="font-bold text-2xl mb-6 text-foreground bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">{prop.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg font-medium">{prop.description}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-gradient-to-br from-orange-50/20 via-white to-blue-50/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-6 py-3 text-sm font-medium bg-white/95 backdrop-blur-md border border-orange-200 shadow-lg">
              <Lightbulb className="h-5 w-5 mr-2 text-orange-500" />
              Platform Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-700 to-blue-700 bg-clip-text text-transparent">Why Choose PeakCrews?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Streamlined, efficient, and built for the demands of the modern trades industry. 
              <br />Get results, fast.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <Card key={index} className="group bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="items-center text-center pb-6">
                  <div className={`p-8 rounded-3xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">{feature.title}</CardTitle>
                  <CardDescription className="text-lg text-muted-foreground leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className={`bg-gradient-to-r ${feature.gradient} hover:shadow-xl transition-all duration-300 transform hover:scale-105`} asChild>
                    <Link href={feature.link}>
                      {feature.linkText}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Showcase Section */}
      <section className="w-full py-20 bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-6 py-3 text-sm font-medium bg-white/95 backdrop-blur-md border border-blue-200 shadow-lg">
              <Play className="h-5 w-5 mr-2 text-blue-500" />
              Platform Preview
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-700 to-orange-600 bg-clip-text text-transparent">
              See PeakCrews in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience the intuitive interface that makes job matching effortless. 
              <br />Professional, fast, and designed for real-world use.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left - Platform Screenshot */}
            <div className="relative">
              <div className="relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-orange-500/10 rounded-3xl blur-3xl" />
                <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transform hover:scale-105 transition-transform duration-500">
                  {/* Mock Browser Header */}
                  <div className="bg-gray-100 px-6 py-3 flex items-center gap-2 border-b border-gray-200">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg px-4 py-2 mx-4 text-sm text-gray-600">
                      peakcrews.com/jobs
                    </div>
                  </div>
                  
                  {/* Mock Platform Interface */}
                  <div className="p-8">
                    <div className="space-y-6">
                      {/* Search Bar */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <Search className="h-5 w-5 text-gray-400" />
                          <div className="flex-1 bg-white rounded-lg px-4 py-3 text-gray-600">
                            Search for electricians, plumbers, carpenters...
                          </div>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                            Search
                          </Button>
                        </div>
                      </div>
                      
                      {/* Job Cards */}
                      <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-lg text-gray-900">Urgent Electrical Repair</h3>
                            <Badge className="bg-orange-100 text-orange-700">Urgent</Badge>
                          </div>
                          <p className="text-gray-600 mb-3">Need licensed electrician for emergency repair in downtown area...</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              Downtown
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              $150-200/hr
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              2 hours ago
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-lg text-gray-900">Kitchen Remodel Project</h3>
                            <Badge className="bg-blue-100 text-blue-700">Large Project</Badge>
                          </div>
                          <p className="text-gray-600 mb-3">Complete kitchen renovation including cabinets, countertops, and plumbing...</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              Suburban Area
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              $15,000-25,000
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Start next week
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-orange-600">Instant</div>
                    <div className="text-xs text-muted-foreground">Matching</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Benefits List */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                  Professional Interface
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Our platform combines powerful functionality with intuitive design, making it easy for both workers and contractors to find what they need quickly.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Smart Search & Filters</h4>
                    <p className="text-muted-foreground">Find exactly what you're looking for with advanced search capabilities and intelligent filtering options.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Direct Communication</h4>
                    <p className="text-muted-foreground">Connect directly with workers or contractors through our built-in messaging system.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Verified Profiles</h4>
                    <p className="text-muted-foreground">Every user is verified and background-checked for your peace of mind and security.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Detailed Job Descriptions</h4>
                    <p className="text-muted-foreground">Comprehensive job details with requirements, budget, timeline, and location information.</p>
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" asChild>
                <Link href="/jobs">
                  Explore the Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trades Section */}
      <section className="w-full py-20 bg-gradient-to-br from-blue-50/30 via-white to-orange-50/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-6 py-3 text-sm font-medium bg-white/95 backdrop-blur-md border border-blue-200 shadow-lg">
              <Globe className="h-5 w-5 mr-2 text-blue-500" />
              Professional Network
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-700 to-orange-600 bg-clip-text text-transparent">Connect With Experts In</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find skilled professionals across all major trades and specialties.
              <br />From emergency repairs to large-scale projects.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {trades.map((trade, index) => (
              <div key={trade.name} className="group">
                <Card className="text-center p-8 bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`p-6 rounded-2xl ${trade.bgColor} border ${trade.borderColor} mb-6 mx-auto w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <div className={trade.color}>
                      {trade.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-foreground">{trade.name}</h3>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-20 bg-gradient-to-br from-orange-50/20 via-white to-blue-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-6 py-3 text-sm font-medium bg-white/95 backdrop-blur-md border border-orange-200 shadow-lg">
              <Award className="h-5 w-5 mr-2 text-orange-500" />
              Our Advantages
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-700 to-blue-700 bg-clip-text text-transparent">Why Choose PeakCrews?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're not just another job platform. We're built specifically for the trades industry 
              <br />with features that matter to real professionals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="group">
                <Card className="p-8 bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-xl bg-gray-50 ${item.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-4 text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">{item.description}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-20 bg-gradient-to-br from-orange-50/30 via-white to-blue-50/40">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-8 px-6 py-3 text-sm font-medium bg-white/95 backdrop-blur-md border border-orange-200 shadow-lg">
                <Heart className="h-5 w-5 mr-2 text-orange-500" />
                Built for Success
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Everything You Need to Succeed</h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                PeakCrews provides all the tools and support you need to find work or hire talent efficiently and safely.
                <br />Join thousands of professionals who trust us with their projects.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-primary/10 shadow-lg">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      {benefit.icon}
                    </div>
                    <span className="font-semibold text-foreground text-lg">{benefit.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-semibold px-8 py-6 shadow-xl text-lg" asChild>
                  <Link href="/register?role=worker">
                    <Briefcase className="mr-3 h-6 w-6" />
                    Get Started as Worker
                  </Link>
                </Button>
                <Button variant="outline" className="px-8 py-6 border-2 bg-white/90 backdrop-blur-sm shadow-xl text-lg" asChild>
                  <Link href="/register?role=hirer">
                    <UserPlus className="mr-3 h-6 w-6" />
                    Post Your First Job
                  </Link>
                </Button>
              </div>
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-emerald-500/10 rounded-3xl blur-3xl" />
                <Image 
                  src={constructionWorkersImage} 
                  alt="Diverse group of skilled tradespeople" 
                  width={600} 
                  height={400} 
                  className="relative rounded-3xl shadow-2xl border border-white/20" 
                  data-ai-hint="skilled workers"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-6 py-3 text-sm font-medium bg-white/90 backdrop-blur-sm shadow-lg">
              <Star className="h-5 w-5 mr-2" />
              What Our Users Say
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Trusted by Professionals</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real feedback from contractors and tradespeople who use PeakCrews daily
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl font-medium text-foreground mb-8 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-lg">{testimonial.author}</div>
                    <div className="text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-gradient-to-br from-primary/5 to-emerald-500/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-8 px-6 py-3 text-sm font-medium bg-white/90 backdrop-blur-sm shadow-lg">
              <Rocket className="h-5 w-5 mr-2" />
              Ready to Get Started?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Ready to Elevate Your Work or Workforce?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Join the PeakCrews community. Whether you're seeking skilled work or dependable tradespeople for your projects, 
              <br />your solution is just a click away. Start building your success story today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-10 py-7 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg" asChild>
                <Link href="/register?role=worker">
                  <Briefcase className="mr-3 h-6 w-6" />
                  I'm a Worker - Find Jobs
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-10 py-7 border-2 hover:bg-primary/5 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 text-lg" asChild>
                <Link href="/register?role=hirer">
                  <UserPlus className="mr-3 h-6 w-6" />
                  I'm a Contractor - Post Jobs
                </Link>
              </Button>
            </div>
            
            <p className="text-lg text-muted-foreground bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full inline-block border border-primary/20 shadow-lg">
              Join thousands of professionals already using PeakCrews
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
// Vercel deployment fix - Fri Aug 22 12:12:27 MDT 2025
