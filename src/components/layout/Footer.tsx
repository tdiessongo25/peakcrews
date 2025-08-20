"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* For Pros / Tradespeople */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">For Pros / Tradespeople</h3>
            <ul className="space-y-2 text-base">
              <li>
                <Link href="/jobs" className="text-muted-foreground hover:text-primary transition-colors font-normal">Find Jobs</Link>
              </li>
              <li>
                <Link href="/register?role=worker" className="text-muted-foreground hover:text-primary transition-colors font-normal">Create Profile</Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-primary transition-colors font-normal">Manage Applications</Link>
              </li>
              <li>
                <Link href="/notifications" className="text-muted-foreground hover:text-primary transition-colors font-normal">Job Alerts</Link>
              </li>
              <li>
                <Link href="/legal/independent-contractor-agreement" className="text-muted-foreground hover:text-primary transition-colors font-normal">Independent Contractor Agreement</Link>
              </li>
            </ul>
          </div>

          {/* For Hirers / Companies */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">For Hirers / Companies</h3>
            <ul className="space-y-2 text-base">
              <li>
                <Link href="/post-job" className="text-muted-foreground hover:text-primary transition-colors font-normal">Post a Job</Link>
              </li>
              <li>
                <Link href="/register?role=hirer" className="text-muted-foreground hover:text-primary transition-colors font-normal">Hire Workers</Link>
              </li>
              <li>
                <Link href="/my-jobs" className="text-muted-foreground hover:text-primary transition-colors font-normal">Manage Jobs</Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-primary transition-colors font-normal">Company Profile</Link>
              </li>
            </ul>
          </div>

                  {/* PeakCrews */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground text-lg">PeakCrews</h3>
            <ul className="space-y-2 text-base">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors font-normal">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors font-normal">Contact Us</Link>
              </li>
              <li>
                <Link href="/legal/acceptable-use-policy" className="text-muted-foreground hover:text-primary transition-colors font-normal">Acceptable Use Policy</Link>
              </li>
              <li>
                <Link href="/legal/accessibility-statement" className="text-muted-foreground hover:text-primary transition-colors font-normal">Accessibility Statement</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Legal & Support</h3>
            <ul className="space-y-2 text-base">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors font-normal">Help Center</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors font-normal">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-muted-foreground hover:text-primary transition-colors font-normal">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-base text-muted-foreground">
            © {currentYear} PeakCrews. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="text-muted-foreground hover:text-primary"
              aria-label="Back to Top"
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
