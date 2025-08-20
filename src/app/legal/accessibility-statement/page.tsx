import React from 'react';

export default function AccessibilityStatementPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-base leading-relaxed">
              <h1 className="text-3xl font-bold mb-6">PEAKCREWS™ ACCESSIBILITY STATEMENT</h1>
      <p className="mb-2 text-sm text-muted-foreground">Version 1.3 | Effective Date: July 15, 2025 | Next Review: July 15, 2026</p>
              <p className="mb-6">PeakCrews Inc. is committed to ensuring digital accessibility for people with disabilities. Accessibility is a core component of our inclusive design philosophy and a legal requirement. We continuously improve the user experience across all our web and mobile platforms.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">1. Scope</h2>
      <p className="mb-4">This statement applies to all content, features, and functionality under FeeldZone Inc.’s control, including:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>The website peakcrews.com and any subdomains</li>
        <li>The PeakCrews mobile application on iOS and Android</li>
        <li>Platform-generated documents and communications</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">2. Standards & Conformance</h2>
      <p className="mb-4">We strive for Web Content Accessibility Guidelines (WCAG) 2.1 Level AA conformance. To date, our Platform achieves substantial conformance, with the following known exceptions and planned remediation:</p>
      <div className="mb-4">
        <table className="w-full text-left border border-border mb-2">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 border-b">Issue</th>
              <th className="p-2 border-b">Description</th>
              <th className="p-2 border-b">Target Remediation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border-b">Third‑Party Video Player</td>
              <td className="p-2 border-b">Captions not available on embedded vendor player</td>
              <td className="p-2 border-b">Q4 2025</td>
            </tr>
            <tr>
              <td className="p-2 border-b">Interactive Charts</td>
              <td className="p-2 border-b">Screen-reader labels under review</td>
              <td className="p-2 border-b">Q3 2025</td>
            </tr>
          </tbody>
        </table>
        <p className="text-sm text-muted-foreground">Our continuous remediation plan ensures these items are addressed in upcoming releases.</p>
      </div>
      <h2 className="text-xl font-semibold mt-8 mb-2">3. Accessibility Governance & Practices</h2>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Executive Oversight:</strong> Our Accessibility Officer reports to senior leadership and oversees compliance.</li>
        <li><strong>Training:</strong> All product, design, and engineering staff receive annual WCAG 2.1 and inclusive-design training.</li>
        <li><strong>Testing & Audits:</strong> We conduct quarterly automated scans (axe, Lighthouse) and manual audits using assistive technologies (NVDA, JAWS, VoiceOver) and keyboard-only navigation. Findings are logged, prioritized, and tracked in our internal accessibility backlog.</li>
        <li><strong>Design & Development:</strong> New features follow our Accessibility Requirements Checklist, including:
          <ul className="list-disc ml-6 mt-2">
            <li>Semantic HTML and ARIA roles</li>
            <li>Focus management and skip-links</li>
            <li>Descriptive alt text for images</li>
            <li>Captions and transcripts for multimedia</li>
            <li>Sufficient color contrast and perceptible cues</li>
          </ul>
        </li>
        <li><strong>Procurement:</strong> Third-party vendors must certify conformance to WCAG 2.1 Level AA or commit to remediation within agreed timelines.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">4. Feedback & Assistance</h2>
      <p className="mb-4">We welcome feedback on accessibility barriers. To report issues or request alternative formats, contact us:</p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Email:</strong> legal@feeldzone.com</li>
        <li><strong>Phone:</strong> +1 (888) 555‑0123 (Press 4 for Accessibility Support)</li>
        <li><strong>Web Form:</strong> <a href="https://www.feeldzone.com/accessibility-feedback" className="text-primary underline">https://www.feeldzone.com/accessibility-feedback</a></li>
      </ul>
      <p className="mb-4">We aim to acknowledge all feedback within 7 business days and provide a resolution timeline.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">5. Compatibility</h2>
      <p className="mb-4">Our Platform is tested with the latest versions of major browsers (Chrome, Firefox, Safari, Edge) and common assistive technologies. We recommend users keep their browsers and assistive tools up to date.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">6. Third-Party Content & Limitations</h2>
      <p className="mb-4">Some embedded or third-party content may not fully conform. We are working with vendors to improve accessibility. If you encounter inaccessible content, please contact us for alternative access.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">7. Formal Complaints & Non-Discrimination</h2>
      <p className="mb-4">FeeldZone prohibits discrimination on the basis of disability. If you are not satisfied with our response to your feedback, you may file a formal complaint:</p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Email:</strong> legal@feeldzone.com</li>
        <li><strong>Mail:</strong> FeeldZone Inc. Attn: Legal Department – Accessibility Complaints<br/>123 Main St, Denver, CO 80202</li>
      </ul>
      <p className="mb-4">We will promptly review and respond in accordance with our policies and applicable law.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">8. General Provisions</h2>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Review Cycle:</strong> This statement is reviewed annually.</li>
        <li><strong>Disclaimer:</strong> This statement is not a warranty of compliance.</li>
        <li><strong>Updates:</strong> Material changes will be announced via email or in-app notification at least 14 days before effectiveness.</li>
      </ul>
      <div className="text-center text-muted-foreground text-sm mt-12">
        © 2025 FeeldZone Inc. All rights reserved.
      </div>
    </main>
  );
} 