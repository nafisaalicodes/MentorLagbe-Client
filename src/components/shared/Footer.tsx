
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  "Quick Links": [
    "Home",
    "Browse Tuitions",
    "Find Tutors",
    "Pricing",
    "Blog",
  ],
  Support: [
    "Help Center",
    "Terms of Service",
    "Privacy Policy",
    "Cookie Policy",
    "Contact Us",
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#171D38] text-white/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo.png"
                alt="MentorLagbe Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />

              <span className="text-lg font-extrabold tracking-tight text-white">
                Mentor<span className="text-primary-light">Lagbe</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-5 text-white/45">
              Connecting students with verified tutors across Bangladesh for
              personalized academic excellence.
            </p>

            <div className="flex items-center gap-2">
              {["f", "𝕏", "in", "▶"].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-xs font-bold text-white/50 hover:bg-primary hover:text-white transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">
                {title}
              </h4>

              <ul className="space-y-2.5">
                {links.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-white/45 hover:text-white transition-colors"
                    >
                      {item}
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
              <li>✉ support@mentorlagbe.com</li>
              <li>✆ +880 1700-000000</li>
              <li>⌖ Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/8 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© 2026 MentorLagbe. All rights reserved.</p>
          <p>Built with care for students across Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
