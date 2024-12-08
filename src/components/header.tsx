'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <Link href="/" className="text-xl font-bold text-blue-900 sm:text-2xl">
          BlockEstate
        </Link>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="scale-90">
            <ConnectButton />
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/explore-properties"
                  className="text-lg text-gray-600 transition-colors hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Explore Properties
                </Link>
                <Link
                  href="/secondary-market"
                  className="text-lg text-gray-600 transition-colors hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Secondary Market
                </Link>
                <Link
                  href="/my-properties"
                  className="text-lg text-gray-600 transition-colors hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  My Properties
                </Link>
                <Link
                  href="/trading-history"
                  className="text-lg text-gray-600 transition-colors hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Trading History
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/explore-properties"
            className="text-gray-600 transition-colors hover:text-blue-600"
          >
            Explore Properties
          </Link>
          <Link
            href="/secondary-market"
            className="text-gray-600 transition-colors hover:text-blue-600"
          >
            Secondary Market
          </Link>
          <ConnectButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/my-properties">My Properties</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/trading-history">Trading History</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
