import { footerInfo, socialMedia, footerSupport } from "@/src/constants";
import React from "react";
import { FaFacebook, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import NavLink from "./NavLink";
import { Buttons } from "@/src/components/export_components";

const Footer = () => {
  return (
    <div className="bg-primary text-white font-inter">
      <div className="bodyMargin py-10 max-md:px-5">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Mobile Grid - 3 columns */}
          <div className="grid grid-cols-3 gap-8 mb-12 text-center">
            {/* Information Column */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-xs lg:text-lg">Information</h3>
              {footerInfo.slice(0, 4).map((info) => (
                <NavLink key={info.label} href={info.link}>
                  <p className="text-xs font-normal hover:text-gray-300 transition-colors">
                    {info.label}
                  </p>
                </NavLink>
              ))}
            </div>

            {/* Social Media Column */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-xs lg:text-lg">Social Media</h3>
              {socialMedia.map((media) => (
                <NavLink key={media.label} href={media.link}>
                  <p className="text-xs font-normal hover:text-gray-300 transition-colors">
                    {media.label}
                  </p>
                </NavLink>
              ))}
            </div>

            {/* Contact Column */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-xs lg:text-lg">Contact us</h3>
              <p className="text-xs">info@portgig.com</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="flex justify-between items-start mb-16">
            {/* Left Side - 3 Columns */}
            <div className="flex gap-24">
              {/* Information Column */}
              <div className="flex flex-col gap-6">
                <h3 className="font-bold text-base lg:text-lg">Information</h3>
                {footerInfo.map((info) => (
                  <NavLink key={info.label} href={info.link}>
                    <p className="text-xs md:text-base hover:text-gray-300 transition-colors">
                      {info.label}
                    </p>
                  </NavLink>
                ))}
              </div>

              {/* Social Media Column */}
              <div className="flex flex-col gap-6">
                <h3 className="font-bold text-lg">Social Media</h3>
                {socialMedia.map((media) => (
                  <NavLink key={media.label} href={media.link}>
                    <p className="text-xs md:text-base hover:text-gray-300 transition-colors">
                      {media.label}
                    </p>
                  </NavLink>
                ))}
              </div>

              {/* Support Column */}
              <div className="flex flex-col gap-6">
                <h3 className="font-bold text-lg">Support</h3>
                {footerSupport.map((support) => (
                  <NavLink key={support.label} href={support.link}>
                    <p className="text-xs md:text-base hover:text-gray-300 transition-colors">
                      {support.label}
                    </p>
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right Side - Newsletter */}
            <div className="flex flex-col items-center gap-6 max-w-md">
              <h2 className="text-2xl font-bold text-center">
                Sign up for our newsletter
              </h2>
              <div className="w-full max-w-sm bg-white rounded-lg flex overflow-hidden">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 outline-none text-gray-800"
                />
                <Buttons
                  label="Subscribe"
                  className="bg-[#00489A]! rounded-none! px-6! py-3! text-sm font-medium mr-3! my-1!"
                />
              </div>
              <p className="text-sm text-center leading-relaxed max-w-sm">
                Subscribe to our newsletter for the latest blog insights,
                creative tips, industry news, and exclusive updates delivered
                straight to your inbox.
              </p>
            </div>
          </div>

          {/* Desktop Bottom - Social Icons and Copyright */}
          <div className="flex justify-center items-center gap-16">
            <div className="flex gap-6 text-xl">
              <a
                href="https://www.linkedin.com/company/portgig-solutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://x.com/Portgigcom?t=i9UL1FzMm58TQwaWq2_MnQ&s=09"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com/portgig?utm_source=qr&igsh=MThtaG9iNXp6cTZ3Yg=="
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="https://web.facebook.com/profile.php?id=61574997526395"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.youtube.com/@portgig"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
              >
                <FaYoutube />
              </a>
            </div>
            <p className="text-sm">© 2025 Portgig. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
