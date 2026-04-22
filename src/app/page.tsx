'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Palette, Share2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Hero Section */}
      <section className="container-custom py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Try On Clothes Virtually
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Upload a photo of yourself and see how any clothing item looks on
              you before you buy. Fast, easy, and absolutely free.
            </p>
            <div className="flex gap-4">
              <Link
                href="/tryon"
                className="btn btn-primary flex items-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <Link href="/gallery" className="btn btn-ghost">
                View Gallery
              </Link>
            </div>
          </div>

          <div className="flex-center">
            <div className="w-full max-w-md h-96 bg-white rounded-2xl border-2 border-blue-300 shadow-xl flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <Zap size={64} className="mx-auto text-blue-500 mb-4" />
                <p className="text-gray-600">
                  Upload your photo here to get started
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container-custom">
          <h2 className="section-title text-center">How It Works</h2>
          <p className="section-subtitle text-center">
            Simple 3-step process to virtually try on any clothing
          </p>

          <div className="grid-auto">
            {/* Feature 1 */}
            <div className="card text-center">
              <div className="flex-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex-center">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Photo</h3>
              <p className="text-gray-600">
                Take a full-body photo or upload an existing one from your
                device.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center">
              <div className="flex-center mb-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex-center">
                  <Palette className="text-emerald-600" size={24} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Select & Try On</h3>
              <p className="text-gray-600">
                Choose from our collection of clothing items and see them on
                your photo instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center">
              <div className="flex-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex-center">
                  <Share2 className="text-purple-600" size={24} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Save & Compare</h3>
              <p className="text-gray-600">
                Save your favorite looks and compare multiple outfits
                side-by-side.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Try Something New?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Start your virtual try-on experience now with no sign-up required.
          </p>
          <Link href="/tryon" className="btn bg-white text-blue-600 hover:bg-gray-100">
            Launch Try-On Studio
          </Link>
        </div>
      </section>
    </div>
  );
}
