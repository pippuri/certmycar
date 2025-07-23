import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Shield,
  Lock,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Users,
  TrendingUp,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { TeslaStatsVisual } from "@/components/tesla-stats-visual";
import { HeroVisual } from "@/components/hero-visual";
import { getLocaleLinks } from "@/lib/locale-links";

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const links = getLocaleLinks(locale);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo size="md" />
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href={links.about} className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
            Check Your Tesla Battery<br />
            <span className="text-blue-600">In 30 Seconds</span>
          </h1>

          {/* Interactive Hero Visual */}
          <div className="mb-12">
            <HeroVisual />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href={links.check}>
                Check My Tesla
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-transparent"
              asChild
            >
              <Link href={`/${locale}/certificate/CMB-DEMO-2024-SAMPLE`}>View Sample Report</Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Free battery health check</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No account required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Instant results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Battery Replacement = <span className="text-red-600">$15,000+</span>
            </h2>
            <p className="text-xl text-gray-600">
              Don&apos;t get stuck with hidden battery issues
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Hidden Issues</h3>
              <p className="text-gray-600">Sellers hide degradation problems</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Data</h3>
              <p className="text-gray-600">Direct from Tesla&apos;s systems</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Higher Value</h3>
              <p className="text-gray-600">Proven health increases price</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">
            Trusted by <span className="text-blue-600">50,000+</span> Tesla Owners
          </h2>
          
          <TeslaStatsVisual />
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">30 Second Results</h3>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">$10 Certificates</h3>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Privacy Protected</h3>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">
            Simple 3-Step Process
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
            <div className="text-center flex-1">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Connect</h3>
            </div>

            <div className="hidden md:block w-16 h-0.5 bg-gray-300"></div>

            <div className="text-center flex-1">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Analyze</h3>
            </div>

            <div className="hidden md:block w-16 h-0.5 bg-gray-300"></div>

            <div className="text-center flex-1">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Certify ($10)</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">
            Perfect for <span className="text-blue-600">Buyers</span>, <span className="text-green-600">Sellers</span> & <span className="text-purple-600">Owners</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-green-600">Buyers</h3>
              <p className="text-lg font-semibold">Avoid $15K+ surprises</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Sellers</h3>
              <p className="text-lg font-semibold">Increase resale value</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-purple-600">Owners</h3>
              <p className="text-lg font-semibold">Track battery health</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Check Your Tesla Battery?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Tesla owners who trust CertMyBattery for accurate,
            instant battery health reports.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
            asChild
          >
            <Link href={links.check}>
              Start Free Check
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400">
        <div className="container mx-auto text-center">
          <p>
            © 2025 batterycert.com. Built for Tesla owners, by Tesla
            enthusiasts.
          </p>
        </div>
      </footer>
    </div>
  );
}
