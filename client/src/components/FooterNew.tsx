import { Sparkles, Heart, Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border-t border-white/20 dark:border-gray-800/30 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-rose-400 to-rose-600 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Elysian
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Connecting hearts across Zimbabwe with authenticity, trust, and
              genuine connections.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-rose-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-rose-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-rose-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-rose-500 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-rose-500 transition-colors"
                >
                  Safety Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-rose-500 transition-colors"
                >
                  Success Stories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-rose-500 transition-colors"
                >
                  Premium Features
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-rose-500 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-rose-500 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-rose-500 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-rose-500 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Stay Connected
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Get the latest updates on love stories and features.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-sm bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-sm font-medium rounded-r-md hover:from-rose-600 hover:to-rose-700 transition-all">
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-white/20 dark:border-gray-800/30">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 Elysian. Made with{" "}
              <Heart className="inline h-4 w-4 text-rose-500" /> in Zimbabwe.
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Powered by{" "}
              <span className="font-semibold text-rose-500">STATIQUEX®</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
