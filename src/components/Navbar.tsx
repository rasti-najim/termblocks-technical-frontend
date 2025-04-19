"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isActive = (path: string) => {
    return pathname === path
      ? "text-blue-600"
      : "text-gray-600 hover:text-blue-500";
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-800">
              Checklist Builder
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/"
              )}`}
            >
              Home
            </Link>

            {!loading &&
              (user ? (
                <>
                  <Link
                    href="/profile"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                      "/profile"
                    )}`}
                  >
                    My Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                      "/login"
                    )}`}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Register
                  </Link>
                </>
              ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
