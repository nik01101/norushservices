import Link from 'next/link';
import { LogIn } from 'lucide-react';
import {NavigationBar} from './ui/navbar';
export function Header() {
  return (
    <header className="backdrop-blur-sm top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
      
        
          <NavigationBar/>
      </div>
    </header>
  );
}
