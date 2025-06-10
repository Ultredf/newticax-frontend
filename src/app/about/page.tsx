import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About NewticaX</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Your modern news platform delivering personalized content with multilingual support, 
            connecting you to the stories that matter most.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                To democratize access to quality journalism by providing a platform that delivers 
                accurate, timely, and relevant news content in multiple languages, ensuring everyone 
                stays informed regardless of their background or location.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-green-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                To become the leading global news platform that bridges language barriers and 
                cultural divides, fostering a more informed and connected world through 
                accessible, reliable journalism.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">What Makes Us Different</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multilingual Support</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Content available in multiple languages with intelligent translation and localization.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Experience</h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered recommendations tailored to your interests and reading preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Journalism</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Curated content from trusted sources with fact-checking and editorial oversight.
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="text-center pt-6">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">John Doe</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">Chief Executive Officer</p>
                <p className="text-sm text-gray-500">
                  Leading the vision for democratized journalism with 15+ years in media technology.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center pt-6">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Jane Smith</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">Chief Technology Officer</p>
                <p className="text-sm text-gray-500">
                  Building the technology that powers our platform with expertise in AI and scalable systems.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center pt-6">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Mike Johnson</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">Editorial Director</p>
                <p className="text-sm text-gray-500">
                  Ensuring editorial quality and integrity with 20+ years in international journalism.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">NewticaX by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600 dark:text-gray-400">Articles Published</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
              <div className="text-gray-600 dark:text-gray-400">Languages Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">180+</div>
              <div className="text-gray-600 dark:text-gray-400">Countries Reached</div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Have questions or want to learn more about NewticaX? We'd love to hear from you.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}