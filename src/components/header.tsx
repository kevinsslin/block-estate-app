import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { User } from 'lucide-react';

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

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <Link href="/" className="text-2xl font-bold text-blue-900">
          BlockEstate
        </Link>
        <nav className="flex items-center gap-6">
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
