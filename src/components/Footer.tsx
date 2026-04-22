export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-white mb-4">Virtual Try-On</h3>
            <p className="text-sm">
              Experience the future of online shopping with our virtual try-on
              technology.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/tryon" className="hover:text-white transition">
                  Try On
                </a>
              </li>
              <li>
                <a href="/gallery" className="hover:text-white transition">
                  Gallery
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-white transition">
                  Admin Panel
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Updates</h4>
            <p className="text-sm mb-4">
              Get notified when we add new features.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-gray-800 text-white placeholder-gray-500 text-sm"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm transition">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            &copy; {currentYear} Virtual Try-On. All rights reserved. Built with
            ❤️ for better online shopping.
          </p>
        </div>
      </div>
    </footer>
  );
}
