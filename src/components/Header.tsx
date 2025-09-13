import Link from 'next/link';
import { LogIn } from 'lucide-react';
import Image from 'next/image';
import logo from '../img/logo_png.png';

export function Header() {
  return (
    <header className="backdrop-blur-sm top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
        {/* <Image src={logo} alt="Logo" 
        className="logo"
        /> */}
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
