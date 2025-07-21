import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo size="md" />
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Check Your EV Battery Health <br /> in{" "}
            <span className="text-blue-600">30 Seconds</span>
          </h1>

          {/* Interactive Hero Visual */}
          <div className="mb-12">
            <HeroVisual />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/check">
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
              <Link href="/certificate">View Sample Report</Link>
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

      {/* Buyer Protection Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Don&apos;t Get Scammed When Buying a Used Tesla
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Battery replacement can cost $15,000+. Protect yourself with
                verified battery health certificates that sellers can&apos;t
                fake.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0x0-0x0-Service_21.jpg-g08oqiaG6IpkSlznB2Dh2Xp4KyfudF.jpeg"
                  alt="Tesla key card and documentation for vehicle verification"
                  width={600}
                  height={400}
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 font-bold text-sm">!</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Hidden Battery Degradation
                    </h3>
                    <p className="text-gray-600">
                      Sellers often hide battery issues that could cost you
                      thousands in repairs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Verified Protection
                    </h3>
                    <p className="text-gray-600">
                      Our certificates are tamper-proof and directly connected
                      to Tesla&apos;s systems.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Increase Resale Value
                    </h3>
                    <p className="text-gray-600">
                      Proven battery health can increase your Tesla&apos;s value
                      by thousands of dollars.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-8 border-0 shadow-xl bg-gradient-to-br from-white to-green-50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Instant Results</h3>
                <p className="text-gray-600">
                  Get your battery health report in seconds, not days. No
                  waiting, no complexity.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Verified Certificates
                </h3>
                <p className="text-gray-600">
                  Official PDF certificates with QR verification for buyers and
                  sellers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Privacy First</h3>
                <p className="text-gray-600">
                  We never store your Tesla credentials. Your data stays secure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Tesla Owners Worldwide
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join the growing community of Tesla owners who rely on
              CertMyBattery for accurate, instant battery health assessments.
            </p>
          </div>
          <TeslaStatsVisual />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect Tesla</h3>
              <p className="text-gray-600">
                Securely connect your Tesla account using official Tesla
                authentication.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Assessment</h3>
              <p className="text-gray-600">
                Our system analyzes your battery data and calculates health
                instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Download Certificate
              </h3>
              <p className="text-gray-600">
                Get your official PDF certificate with QR verification ($9.99).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perfect for Every Tesla Owner
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you&apos;re buying, selling, or just curious about your
              Tesla&apos;s condition.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">For Buyers</h3>
                <p className="text-gray-600 mb-4">
                  Verify the seller&apos;s claims and avoid costly surprises.
                  Don&apos;t get stuck with a degraded battery.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Verify seller claims</li>
                  <li>• Avoid $15K+ repair costs</li>
                  <li>• Negotiate with confidence</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">For Sellers</h3>
                <p className="text-gray-600 mb-4">
                  Prove your battery&apos;s health and command top dollar. Build
                  trust with potential buyers.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Increase resale value</li>
                  <li>• Build buyer confidence</li>
                  <li>• Sell faster with proof</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">For Owners</h3>
                <p className="text-gray-600 mb-4">
                  Monitor your battery&apos;s health over time and plan for the
                  future with confidence.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Track degradation trends</li>
                  <li>• Plan maintenance timing</li>
                  <li>• Optimize charging habits</li>
                </ul>
              </CardContent>
            </Card>
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
            <Link href="/check">
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
