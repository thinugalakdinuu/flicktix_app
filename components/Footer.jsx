import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <div className="hidden md:block bg-[#0B090A] text-[#D3D3D3] py-10">
      <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col items-center sm:items-start mb-5 sm:mb-0">
          <h2 className="text-2xl font-semibold text-[#F5F3F4] mb-3">FlickTix</h2>
          <p className="text-center sm:text-left text-sm">
            Your go-to place for movie tickets.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold text-lg text-[#F5F3F4]">Quick Links</h3>
            <ul className="text-sm mt-2 text-[#D3D3D3]">
              <Link href="/" className="text-sm mt-2 text-[#D3D3D3] pb-5">
              <li>Home</li>
              </Link>
              <Link href="/movies" className="text-sm mt-2 text-[#D3D3D3]">
              <li>Movies</li>
              </Link>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold text-lg text-[#F5F3F4]">Contact</h3>
            <ul className="text-sm mt-2 text-[#D3D3D3] space-y-2">
              <li>Email: support@flicktix.com</li>
              <li>Phone: +1 234 567 890</li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-semibold text-lg text-[#F5F3F4]">Follow Us</h3>
            <ul className="text-sm mt-2 text-[#D3D3D3] space-y-2">
              <li>Facebook</li>
              <li>Twitter</li>
              <li>Instagram</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center py-3 mt-10">
        <p className="text-[#F5F3F4] text-sm">© 2025 FlickTix. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
