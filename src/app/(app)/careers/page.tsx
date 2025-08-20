import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, Zap, Heart, Globe, Award, ArrowRight } from 'lucide-react';

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Full-Stack Engineer",
      department: "Engineering",
      location: "Denver, CO (Hybrid)",
      type: "Full-time",
      description: "Join our engineering team to build the next generation of our platform connecting skilled trades with job opportunities.",
      requirements: ["5+ years experience", "React/Next.js", "TypeScript", "Node.js", "API Design"]
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      description: "Lead product strategy and execution for our marketplace platform, focusing on user experience and business growth.",
      requirements: ["3+ years PM experience", "Marketplace experience", "Data-driven", "User research", "Agile methodology"]
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Denver, CO (Hybrid)",
      type: "Full-time",
      description: "Create beautiful, intuitive user experiences that help tradespeople and contractors connect effectively.",
      requirements: ["3+ years design experience", "Figma", "User research", "Prototyping", "Design systems"]
    },
    {
      title: "Customer Success Manager",
      department: "Operations",
      location: "Remote",
      type: "Full-time",
      description: "Support our users and help them succeed on the platform while gathering feedback to improve our services.",
      requirements: ["2+ years CS experience", "Excellent communication", "Problem-solving", "CRM tools", "Customer empathy"]
    }
  ];

  const benefits = [
    { icon: <Heart className="h-6 w-6" />, title: "Health & Wellness", description: "Comprehensive health, dental, and vision coverage" },
    { icon: <Zap className="h-6 w-6" />, title: "Flexible Work", description: "Remote-first culture with flexible hours" },
    { icon: <Award className="h-6 w-6" />, title: "Professional Growth", description: "Learning budget and career development programs" },
    { icon: <Globe className="h-6 w-6" />, title: "Global Impact", description: "Help build the future of skilled trades" },
    { icon: <Users className="h-6 w-6" />, title: "Great Team", description: "Work with passionate, talented individuals" },
    { icon: <Briefcase className="h-6 w-6" />, title: "Equity", description: "Ownership stake in our growing company" }
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-primary">Join the PeakCrews Team</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          We're building the future of skilled trades. Join us in creating a platform that empowers professionals and transforms how work gets done.
        </p>
        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
          <Link href="#openings">
            View Open Positions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Mission Section */}
      <section className="mb-16">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-center text-muted-foreground leading-relaxed">
              At PeakCrews, we believe that every skilled professional deserves access to meaningful work opportunities, 
              and every business deserves access to reliable, qualified talent. We're building the technology and community 
              that makes this vision a reality.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Benefits Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Why Work at PeakCrews?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-primary">{benefit.icon}</div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{benefit.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings">
        <h2 className="text-3xl font-bold text-center mb-8">Open Positions</h2>
        <div className="space-y-6">
          {openPositions.map((position, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{position.title}</CardTitle>
                    <CardDescription className="text-base">{position.department}</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{position.location}</Badge>
                    <Badge variant="outline">{position.type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{position.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>{req}</li>
                    ))}
                  </ul>
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="mt-16">
        <Card className="shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Don't See the Right Fit?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals to join our team. Send us your resume and let us know how you can contribute to our mission.
            </p>
            <Button asChild>
              <Link href="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
} 