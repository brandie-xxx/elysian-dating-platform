"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const handleGetStarted = () => {
    console.log("Getting started...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="text-pink-600 block">Match</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with amazing people across Africa. Build meaningful
            relationships that last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="px-8 py-4 text-lg bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
              <Heart className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-2 border-gray-300 hover:border-pink-600 rounded-full transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose Elysian?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {/* Icon placeholder */}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Smart Matching
              </h3>
              <p className="text-gray-600">
                Our advanced algorithm finds compatible partners based on your
                preferences and values.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {/* Icon placeholder */}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Safe & Secure
              </h3>
              <p className="text-gray-600">
                Your privacy and safety are our top priorities. Connect with
                confidence.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {/* Icon placeholder */}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Quality Profiles
              </h3>
              <p className="text-gray-600">
                Verified profiles ensure you meet genuine people looking for
                real relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <p className="text-gray-600 mb-6 italic">
                "I met my soulmate on Elysian. Our values aligned perfectly, and
                now we're happily married!"
              </p>
              <p className="font-semibold text-gray-900">- Amina & Joseph</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <p className="text-gray-600 mb-6 italic">
                "Thanks to Elysian, I found someone who truly understands me.
                Our journey started with a simple message."
              </p>
              <p className="font-semibold text-gray-900">- Thabo & Naledi</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <p className="text-gray-600 mb-6 italic">
                "Elysian brought us together across continents. Love knows no
                boundaries!"
              </p>
              <p className="font-semibold text-gray-900">- Fatima & David</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Africans who have found love on Elysian. Your
            beautiful love story could be next.
          </p>
          <Button
            size="lg"
            className="px-8 py-4 text-lg bg-white text-pink-600 hover:bg-gray-100 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Your Love Story
            <Heart className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
