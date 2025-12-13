"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Mail, Facebook, Instagram, Twitter, MapPin, Phone, Clock } from "lucide-react"

export function Footer() {
  const pathname = usePathname()

  const isImmersivePage =
    pathname?.startsWith("/speaking/session/") ||
    (pathname?.startsWith("/vocab/") && pathname !== "/vocab") ||
    (pathname?.startsWith("/grammar/") && pathname !== "/grammar")

  if (isImmersivePage) {
    return null
  }

  return (
    <footer className="border-t border-border bg-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* About DailyEng */}
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <Image
              src="/logo.png"
              alt="DailyEng Logo"
              width={180}
              height={60}
              className="object-contain mb-4"
            />
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">
              About Daily<span className="text-primary-600">Eng</span>
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/user/courses"
                  className="hover:text-primary-500 transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/about/mission"
                  className="hover:text-primary-500 transition-colors"
                >
                  Mission
                </Link>
              </li>
              <li>
                <Link
                  href="/about/approach"
                  className="hover:text-primary-500 transition-colors"
                >
                  Approach
                </Link>
              </li>
              <li>
                <Link
                  href="/about/team"
                  className="hover:text-primary-500 transition-colors"
                >
                  Our Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy and Terms */}
          <div>
            <h4 className="font-bold text-foreground mb-4">
              Privacy and Terms
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/community-guidelines"
                  className="hover:text-primary-500 transition-colors"
                >
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-primary-500 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/helps"
                  className="hover:text-primary-500 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary-500 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="hover:text-primary-500 transition-colors"
                >
                  Send Feedback
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span>1900 1234</span>
              </li>
            </ul>
          </div>

          {/* Connect with us */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Connect with us</h4>
            <div className="flex gap-3 mb-6">
              <a
                href="mailto:contact@dailyeng.com"
                className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/dailyeng"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/dailyeng"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/dailyeng"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                Mon - Fri: 8:00 - 17:30
                <br />
                Sat: 8:00 - 12:00
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Company Info */}
      <div className="border-t border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Copyright & Registration */}
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-bold text-foreground">
                Copyright © {new Date().getFullYear()} DAILYENG
              </p>
              <p>
                Mã số thuế: 0106799375, do Sở Kế hoạch và Đầu tư TP. Hà Nội cấp
                ngày 24/03/2015
              </p>
              <p>
                Quyết định thành lập Trung tâm Ngoại ngữ DAILYENG, số 3920 do Sở
                Giáo dục và Đào tạo Hà Nội cấp ngày 9/9/2019
              </p>
            </div>

            {/* Company Addresses */}
            <div className="text-sm">
              <p className="font-bold text-foreground mb-3">
                Công ty cổ phần công nghệ Daily
                <span className="text-primary-600">Eng</span>
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary-500" />
                  <span>
                    <strong>Trụ sở:</strong> Số 49 Galaxy 3, Vạn Phúc, Hà Đông,
                    Hà Nội.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary-500" />
                  <span>
                    <strong>Cơ sở 2:</strong> Nhà liền kề số 03 VNT TOWER, Số 19
                    Nguyễn Trãi, Thanh Xuân, Hà Nội
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary-500" />
                  <span>
                    <strong>Cơ sở 3:</strong> Số 457 Hoàng Quốc Việt, Cổ Nhuế,
                    Bắc Từ Liêm, Hà Nội
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
