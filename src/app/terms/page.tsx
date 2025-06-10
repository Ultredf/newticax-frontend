import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto prose dark:prose-invert">
          <h1>Terms of Service</h1>
          <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

          <h2>Agreement to Terms</h2>
          <p>
            By accessing and using NewticaX, you accept and agree to be bound by the terms and provision 
            of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2>Description of Service</h2>
          <p>
            NewticaX is a digital news platform that provides users with access to articles, news content, 
            and related services. We reserve the right to modify, suspend, or discontinue the service at any time.
          </p>

          <h2>User Accounts</h2>
          <h3>Registration</h3>
          <ul>
            <li>You must provide accurate and complete information when creating an account</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You must be at least 13 years old to create an account</li>
            <li>One person or legal entity may not maintain multiple accounts</li>
          </ul>

          <h3>Account Responsibilities</h3>
          <ul>
            <li>You are responsible for all activities that occur under your account</li>
            <li>You must immediately notify us of any unauthorized use of your account</li>
            <li>We reserve the right to terminate accounts that violate our terms</li>
          </ul>

          <h2>User Content and Conduct</h2>
          <h3>Acceptable Use</h3>
          <p>You agree not to use the service to:</p>
          <ul>
            <li>Post false, misleading, or defamatory content</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Harass, threaten, or harm other users</li>
            <li>Distribute spam or malicious content</li>
            <li>Attempt to gain unauthorized access to our systems</li>
          </ul>

          <h3>Content Moderation</h3>
          <p>
            We reserve the right to review, edit, or remove any user-generated content that violates our 
            community guidelines or terms of service.
          </p>

          <h2>Intellectual Property</h2>
          <h3>Our Content</h3>
          <p>
            All content on NewticaX, including text, graphics, logos, and software, is our property or 
            licensed to us and protected by copyright and other intellectual property laws.
          </p>

          <h3>User Content</h3>
          <p>
            By posting content on our platform, you grant us a non-exclusive, royalty-free license to 
            use, modify, and distribute that content in connection with our service.
          </p>

          <h2>Privacy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your 
            use of the service, to understand our practices.
          </p>

          <h2>Disclaimers</h2>
          <ul>
            <li>The service is provided "as is" without warranties of any kind</li>
            <li>We do not guarantee the accuracy or completeness of any content</li>
            <li>We are not responsible for third-party content or links</li>
            <li>Service availability may be interrupted or limited</li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, NewticaX shall not be liable for any indirect, 
            incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
          </p>

          <h2>Termination</h2>
          <p>
            We may terminate or suspend your account and access to the service immediately, without prior 
            notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of significant 
            changes via email or through our service. Continued use after changes constitutes acceptance.
          </p>

          <h2>Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of Indonesia, 
            without regard to its conflict of law provisions.
          </p>

          <h2>Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <ul>
            <li>Email: legal@newticax.com</li>
            <li>Address: 123 News Street, Jakarta, Indonesia</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}