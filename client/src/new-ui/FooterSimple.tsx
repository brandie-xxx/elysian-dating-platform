import React from "react";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function FooterSimple(): JSX.Element {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-pink-500" />
              <span className="text-xl font-bold">Elysian</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Connecting hearts across Africa. Find your perfect match and build
              meaningful relationships that last a lifetime.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C8.396 0 7.992.014 6.8.067 5.608.12 4.816.283 4.12.547c-.728.28-1.344.697-1.956 1.31C1.552 2.47 1.135 3.086.855 3.814c-.264.696-.427 1.488-.48 2.68C.33 7.008.317 7.412.317 11.033c0 3.621.014 4.025.067 5.217.053 1.192.216 1.984.48 2.68.28.728.697 1.344 1.31 1.956.612.612 1.228 1.029 1.956 1.31.696.264 1.488.427 2.68.48 1.192.053 1.596.067 5.217.067 3.621 0 4.025-.014 5.217-.067 1.192-.053 1.984-.216 2.68-.48.728-.28 1.344-.697 1.956-1.31.612-.612 1.029-1.228 1.31-1.956.264-.696.427-1.488.48-2.68.053-1.192.067-1.596.067-5.217 0-3.621-.014-4.025-.067-5.217-.053-1.192-.216-1.984-.48-2.68-.28-.728-.697-1.344-1.31-1.956C15.53 1.135 14.914.697 14.186.417c-.696-.264-1.488-.427-2.68-.48C15.025.014 14.621 0 11 0zM9.923 2.409c.348 0 .703.013 1.077.04.34.024.72.08 1.063.173.408.112.79.29 1.126.626.336.336.514.718.626 1.126.093.343.149.723.173 1.063.027.374.04.729.04 1.077s-.013.703-.04 1.077c-.024.34-.08.72-.173 1.063-.112.408-.29.79-.626 1.126-.336.336-.718.514-1.126.626-.343.093-.723.149-1.063.173-.374.027-.729.04-1.077.04s-.703-.013-1.077-.04c-.34-.024-.72-.08-1.063-.173-.408-.112-.79-.29-1.126-.626-.336-.336-.514-.718-.626-1.126-.093-.343-.149-.723-.173-1.063C2.41 9.703 2.397 9.348 2.397 9s.013-.703.04-1.077c.024-.34.08-.72.173-1.063.112-.408.29-.79.626-1.126.336-.336.718-.514 1.126-.626.343-.093.723-.149 1.063-.173.374-.027.729-.04 1.077-.04zm3.692 2.325c-.348 0-.703-.013-1.077-.04-.34-.024-.72-.08-1.063-.173-.408-.112-.79-.29-1.126-.626-.336-.336-.514-.718-.626-1.126-.093-.343-.149-.723-.173-1.063-.027-.374-.04-.729-.04-1.077s.013-.703.04-1.077c.024-.34.08-.72.173-1.063.112-.408.29-.79.626-1.126.336-.336.718-.514 1.126-.626.343-.093.723-.149 1.063-.173.374-.027.729-.04 1.077-.04s.703.013 1.077.04c.34.024.72.08 1.063.173.408.112.79.29 1.126.626.336.336.514.718.626 1.126.093.343.149.723.173 1.063.027.374.04.729.04 1.077s-.013.703-.04 1.077c-.024.34-.08.72-.173 1.063-.112.408-.29.79-.626 1.126-.336.336-.718.514-1.126.626-.343.093-.723.149-1.063.173-.374.027-.729.04-1.077.04z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#success"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Success Stories
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#help"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#safety"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Safety Tips
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@elysian.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Elysian. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
