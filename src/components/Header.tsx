'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">VT</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">
              Virtual Try-On
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/tryon" className="text-gray-600 hover:text-gray-900">
              Try On
            </Link>
            <Link href="/gallery" className="text-gray-600 hover:text-gray-900">
              Gallery
            </Link>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Admin
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/tryon" className="btn btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2">
            <Link
              href="/tryon"
              className="block py-2 text-gray-600 hover:text-gray-900"
            >
              Try On
            </Link>
            <Link
              href="/gallery"
              className="block py-2 text-gray-600 hover:text-gray-900"
            >
              Gallery
            </Link>
            <Link
              href="/admin"
              className="block py-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              Admin
            </Link>
            <Link href="/tryon" className="btn btn-primary w-full">
              Get Started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
