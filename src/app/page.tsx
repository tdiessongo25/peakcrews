
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
  Shield
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Find Your Next Job, Instantly",
              description: "Skilled workers discover local jobs that match their expertise. Whether it's an urgent fix or a scheduled project, PeakCrews connects you.",
      link: "/jobs",
      linkText: "Browse Open Jobs",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: "Hire Skilled Trades Fast",
      description: "Contractors post job requirements and connect with reliable tradespeople. Get qualified talent when you need it most.",
      link: "/post-job",
      linkText: "Post a Job Opening",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI-Powered Job Creation",
      description: "Our intelligent assistant helps contractors create compelling job descriptions in seconds, attracting the right candidates.",
      link: "/post-job",
      linkText: "Try the AI Assistant",
      gradient: "from-purple-500 to-pink-500"
    },
  ];

  const trades = [
    { name: "Electricians", icon: <Zap className="h-6 w-6" />, color: "text-yellow-500" },
    { name: "Carpenters", icon: <Hammer className="h-6 w-6" />, color: "text-amber-600" },
    { name: "Painters", icon: <PaintRoller className="h-6 w-6" />, color: "text-blue-500" },
    { name: "Plumbers", icon: <Wrench className="h-6 w-6" />, color: "text-slate-600" },
    { name: "Concrete Laborers", icon: <HardHat className="h-6 w-6" />, color: "text-gray-700" },
    { name: "General Labor", icon: <HardHat className="h-6 w-6" />, color: "text-orange-500" },
  ];

  const stats = [
    { number: "500+", label: "Active Jobs", icon: <Briefcase className="h-5 w-5" /> },
    { number: "2,000+", label: "Skilled Workers", icon: <Users className="h-5 w-5" /> },
    { number: "95%", label: "Success Rate", icon: <CheckCircle className="h-5 w-5" /> },
    { number: "24hr", label: "Average Response", icon: <Clock className="h-5 w-5" /> },
  ];

  const benefits = [
    "No hidden fees or commissions",
    "Verified worker profiles",
    "Secure payment processing",
    "24/7 customer support",
    "Instant job matching",
    "Professional insurance coverage"
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-30" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-28 lg:py-32 text-center">
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Job Matching Platform
            </Badge>
            
            <h1 className="text-responsive-xl font-bold tracking-tight mb-6">
              Your <span className="text-gradient">Next Project</span> Starts with PeakCrews
          </h1>
            
            <p className="text-responsive-md text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              The fast lane for skilled trades and urgent job needs. Find reliable workers or post your job in minutes, not days.
          </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="btn-accent-gradient text-lg px-8 py-6" asChild>
              <Link href="/jobs">
                  <Search className="mr-2 h-5 w-5" /> 
                  Find Work Now
                  <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-primary/5" asChild>
              <Link href="/post-job">
                  <UserPlus className="mr-2 h-5 w-5" /> 
                  Hire Skilled Talent
              </Link>
            </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Verified Workers</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gradient mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-responsive-lg font-bold mb-4">Why Choose PeakCrews?</h2>
            <p className="text-responsive-md text-muted-foreground max-w-2xl mx-auto">
              Streamlined, efficient, and built for the demands of the modern trades industry. Get results, fast.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover group animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader className="items-center text-center">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                    {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed mb-6">
                    {feature.description}
                  </CardDescription>
                  <Button variant="link" asChild className="text-primary font-medium group-hover:translate-x-1 transition-transform">
                    <Link href={feature.link}>
                      {feature.linkText} 
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Trades Section */}
      <section className="w-full section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-responsive-lg font-bold mb-4">Connect With Experts In</h2>
            <p className="text-responsive-md text-muted-foreground max-w-2xl mx-auto">
              Find skilled professionals across all major trades and specialties
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {trades.map((trade, index) => (
              <div key={trade.name} className="group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className="card-hover text-center p-6 group-hover:scale-105 transition-all duration-300">
                  <div className={`p-4 rounded-full bg-muted/50 mb-4 mx-auto w-16 h-16 flex items-center justify-center group-hover:bg-primary/10 transition-colors`}>
                    <div className={trade.color}>
                  {trade.icon}
                    </div>
                </div>
                <h3 className="font-semibold text-lg">{trade.name}</h3>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full section-padding">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-responsive-lg font-bold mb-6">Everything You Need to Succeed</h2>
              <p className="text-responsive-md text-muted-foreground mb-8 leading-relaxed">
                PeakCrews provides all the tools and support you need to find work or hire talent efficiently and safely.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button className="btn-gradient" asChild>
                  <Link href="/register?role=worker">
                    Get Started as Worker
                  </Link>
                </Button>
                <Button variant="outline" className="border-2" asChild>
                  <Link href="/register?role=hirer">
                    Post Your First Job
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-3xl" />
                <Image 
                  src="/construction_workers.png" 
                  alt="Diverse group of skilled tradespeople" 
                  width={600} 
                  height={400} 
                  className="relative rounded-3xl shadow-2xl" 
                  data-ai-hint="skilled workers"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full section-padding bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-bounce-in">
            <h2 className="text-responsive-lg font-bold mb-6">Ready to Elevate Your Work or Workforce?</h2>
            <p className="text-responsive-md text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Join the PeakCrews community. Whether you're seeking skilled work or dependable tradespeople for your projects, your solution is just a click away.
          </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="btn-accent-gradient text-lg px-8 py-6" asChild>
                <Link href="/register?role=worker">
                  <Briefcase className="mr-2 h-5 w-5" />
                  I'm a Worker - Find Jobs
                </Link>
            </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-primary/5" asChild>
                <Link href="/register?role=hirer">
                  <UserPlus className="mr-2 h-5 w-5" />
                  I'm a Contractor - Post Jobs
                </Link>
            </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-6">
              Join thousands of professionals already using PeakCrews
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
