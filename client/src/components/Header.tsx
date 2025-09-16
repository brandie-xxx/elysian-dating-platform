import React from "react";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
}

export default function Header({ onGetStarted, onLogin }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-pink-600" />
              <span className="text-2xl font-bold text-gray-900">Elysian</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Contact
            </a>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onLogin}
              className="text-gray-700 hover:text-pink-600 hover:bg-pink-50 px-4 py-2"
            >
              Log In
            </Button>
            <Button
              onClick={onGetStarted}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-pink-600"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <a
                href="#home"
                className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#features"
                className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={() => {
                    onLogin?.();
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-pink-600 hover:bg-pink-50 justify-start"
                >
                  Log In
                </Button>
                <Button
                  onClick={() => {
                    onGetStarted?.();
                    setIsMenuOpen(false);
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
