
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  SiFacebook,
  SiX,
  SiYoutube,
} from "react-icons/si";

import { FaLinkedinIn } from "react-icons/fa";

const footerLinks = {
  "Quick Links": [
    { name: "Home", href: "/" },
    { name: "Browse Tuitions", href: "/tuitions" },
    { name: "Pricing", href: "/pricing" },
    { name: "How It Works", href: "/#how-it-works" },
  ],
  Support: [
    { name: "Help Center", href: "/contact" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Contact Us", href: "/contact" },
  ],
};

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/your-page",
    icon: SiFacebook,
  },
  {
    name: "X",
    href: "https://x.com/your-account",
    icon: SiX,
  },
 {
  name: "LinkedIn",
  href: "https://www.linkedin.com/company/your-page",
  icon: FaLinkedinIn,
},
  {
    name: "YouTube",
    href: "https://www.youtube.com/@your-channel",
    icon: SiYoutube,
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#171D38] text-white/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/Logo.png"
                alt="MentorLagbe Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />

              <span className="text-lg font-extrabold tracking-tight text-white">
                MentorLagbe
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-5 text-white/45">
              Connecting students with verified tutors across Bangladesh for
              personalized academic excellence.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">
                {title}
              </h4>

              <ul className="space-y-2.5">
                {links.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/45 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">
              Contact Us
            </h4>

            <ul className="space-y-3 text-sm text-white/45">
              <li>
                <a href="mailto:support@mentorlagbe.com" className="hover:text-white transition-colors">
                  ✉ support@mentorlagbe.com
                </a>
              </li>

              <li>
                <a href="tel:+8801700000000" className="hover:text-white transition-colors">
                  ✆ +880 1700-000000
                </a>
              </li>

              <li>⌖ Dhaka, Bangladesh</li>
            </ul>
          </div>

        </div>

        <Separator className="bg-white/10 mb-6" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© 2026 MentorLagbe. All rights reserved.</p>
          <p>Built with care for students across Bangladesh</p>
        </div>

      </div>
    </footer>
  );
}
