import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-base leading-relaxed">
              <h1 className="text-4xl font-bold mb-4 text-primary">About PeakCrews</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        PeakCrews is revolutionizing the way skilled tradespeople and businesses connect, collaborate, and succeed. Our platform is designed to empower professionals, streamline hiring, and deliver exceptional results for every project—big or small.
      </p>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p>
          We believe in a world where opportunity is accessible, work is meaningful, and every job gets done right. PeakCrews bridges the gap between top trades talent and those who need their expertise—quickly, safely, and transparently.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Why Choose PeakCrews?</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>For Pros & Tradespeople:</strong> Find high-quality jobs, set your own rates, and get paid fast. Build your reputation, grow your business, and join a trusted network of professionals.</li>
          <li><strong>For Hirers & Companies:</strong> Access a vetted pool of skilled workers, post jobs in minutes, and manage projects with ease. Our platform ensures reliability, compliance, and peace of mind.</li>
          <li><strong>Safety & Trust:</strong> We prioritize secure payments, verified profiles, and transparent reviews—so you can focus on what matters most.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Our Values</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Empowerment:</strong> We give professionals and businesses the tools to thrive on their own terms.</li>
          <li><strong>Integrity:</strong> We operate with honesty, fairness, and respect for every user.</li>
          <li><strong>Innovation:</strong> We’re always improving—bringing you the latest technology and best practices in the industry.</li>
          <li><strong>Community:</strong> We foster a supportive, inclusive environment where everyone can succeed.</li>
        </ul>
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Ready to Get Started?</h2>
        <p className="mb-4">
          Whether you’re a skilled pro looking for your next opportunity, or a business seeking top talent, FeeldZone is your partner for success. Join thousands of satisfied users who trust us to power their projects and careers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register" className="bg-primary text-white px-6 py-3 rounded-md font-semibold text-lg text-center hover:bg-primary/90 transition-colors">Sign Up Free</Link>
          <Link href="/contact" className="border border-primary text-primary px-6 py-3 rounded-md font-semibold text-lg text-center hover:bg-primary hover:text-white transition-colors">Partner With Us</Link>
        </div>
      </section>
      <div className="text-center text-muted-foreground text-sm mt-12">
        &copy; {new Date().getFullYear()} PeakCrews Inc. All rights reserved.
      </div>
    </main>
  );
} 