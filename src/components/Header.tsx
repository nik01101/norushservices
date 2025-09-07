import Link from 'next/link';
import { Package, LogIn } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Swift Services</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/admin/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
