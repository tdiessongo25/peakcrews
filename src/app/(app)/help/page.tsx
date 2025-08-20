"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, MessageCircle, Phone, Mail, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: "Getting Started",
      icon: "🚀",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Click the 'Sign Up' button in the top right corner. Choose whether you're a worker or contractor, fill in your details, and verify your email address."
        },
        {
          question: "What's the difference between a worker and contractor account?",
          answer: "Workers are skilled tradespeople looking for jobs. Contractors are businesses or individuals posting jobs and hiring workers."
        },
        {
          question: "Is PeakCrews free to use?",
          answer: "Creating an account and browsing jobs is free. Contractors pay a small fee when they successfully hire a worker through the platform."
        }
      ]
    },
    {
      title: "For Workers",
      icon: "👷",
      faqs: [
        {
          question: "How do I apply for a job?",
          answer: "Browse available jobs, click on one that interests you, and use the 'Apply Now' button. You can include a cover letter and your relevant experience."
        },
        {
          question: "How do I get paid?",
          answer: "Payment is handled securely through our platform. Once a job is completed and approved by the contractor, payment is processed within 2-3 business days."
        },
        {
          question: "Can I set my own rates?",
          answer: "Yes! You can set your hourly rate or project rate in your profile. Contractors will see this when considering your application."
        }
      ]
    },
    {
      title: "For Contractors",
      icon: "🏢",
      faqs: [
        {
          question: "How do I post a job?",
          answer: "Click 'Post a Job' in the header, fill out the job details including description, location, and budget, then publish your listing."
        },
        {
          question: "How do I review applications?",
          answer: "When workers apply, you'll receive notifications. You can review their profiles, ratings, and cover letters before making a decision."
        },
        {
          question: "What if I'm not satisfied with the work?",
          answer: "We have a dispute resolution process. Contact our support team within 48 hours of job completion if there are any issues."
        }
      ]
    },
    {
      title: "Safety & Trust",
      icon: "🛡️",
      faqs: [
        {
          question: "How do you verify workers?",
          answer: "We verify identity, check references, and require background checks for certain trades. All workers are rated by previous employers."
        },
        {
          question: "What insurance coverage is provided?",
          answer: "PeakCrews provides general liability insurance for jobs booked through our platform. Additional coverage may be required for specific projects."
        },
        {
          question: "How do I report a problem?",
          answer: "Use the 'Report Issue' button on any job page, or contact our support team directly through the contact form or phone."
        }
      ]
    },
    {
      title: "Account & Billing",
      icon: "💳",
      faqs: [
        {
          question: "How do I update my profile?",
          answer: "Go to your profile page and click 'Edit Profile'. You can update your information, skills, rates, and portfolio at any time."
        },
        {
          question: "Can I cancel my account?",
          answer: "Yes, you can deactivate your account in your profile settings. Note that this will remove your active job listings and applications."
        },
        {
          question: "How do I change my payment method?",
          answer: "Go to your account settings and select 'Payment Methods'. You can add, remove, or update your payment information there."
        }
      ]
    }
  ];

  const quickActions = [
    {
      title: "Contact Support",
      description: "Get help from our team",
      icon: <MessageCircle className="h-6 w-6" />,
      link: "/contact",
      color: "bg-blue-500"
    },
    {
      title: "Report an Issue",
      description: "Report bugs or problems",
      icon: <Phone className="h-6 w-6" />,
      link: "/contact",
      color: "bg-red-500"
    },
    {
      title: "Feature Request",
      description: "Suggest new features",
      icon: <Mail className="h-6 w-6" />,
      link: "/contact",
      color: "bg-green-500"
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-primary">Help Center</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Find answers to common questions, learn how to use PeakCrews, and get the support you need.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href={action.link}>
                <CardContent className="p-6 text-center">
                  <div className={`${action.color} text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4`}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {filteredCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <CardTitle className="text-2xl font-bold">{category.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.faqs.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {searchQuery && filteredCategories.length === 0 && (
        <Card className="shadow-lg text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any help articles matching "{searchQuery}". Try different keywords or contact our support team.
            </p>
            <Button asChild>
              <Link href="/contact">
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Additional Resources */}
      <section className="mt-16">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Still Need Help?</CardTitle>
            <CardDescription>
              Can't find what you're looking for? Our support team is here to help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Contact Support</h3>
                <p className="text-muted-foreground mb-4">
                  Get personalized help from our support team
                </p>
                <Button asChild>
                  <Link href="/contact">
                    Get Help
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Community Forum</h3>
                <p className="text-muted-foreground mb-4">
                  Connect with other users and share tips
                </p>
                <Button variant="outline" asChild>
                  <Link href="#">
                    Join Community
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
} 