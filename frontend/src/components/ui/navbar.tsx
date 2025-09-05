'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
            <span className="text-lg font-bold text-white">TB</span>
          </div>
          <span className="text-xl font-bold text-gray-800">TrueBalance</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            href="/dashboard"
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              pathname === "/dashboard"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/about"
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              pathname === "/about"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            About
          </Link>
          {/* temporary just to see pages in development... we don't want to keep this here because nav bar won't be visible
           until fully signed in */}
          <Link
            href="/login"
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              pathname === "/login"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            Login
          </Link>
          {/* temporary just to see pages in development... we don't want to keep this here because nav bar won't be visible
           until fully signed in */}
          <Link
            href="/register"
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              pathname === "/register"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            Register
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            {/* haven't created this endpoint yet */}
            <Link href="/logout">Sign Out</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}