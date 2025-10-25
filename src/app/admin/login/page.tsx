'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import logo from '../../../img/logo_png.png';

import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore'; 
import bcrypt from 'bcryptjs';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      setIsLoggingIn(false);
      return;
    }

    try {
      const adminDocRef = doc(db, 'admins', username);
      const adminDocSnap = await getDoc(adminDocRef);

      if (!adminDocSnap.exists()) {
        setError('Invalid user. Please try again.');
        setIsLoggingIn(false);
        return;
      }

      const adminData = adminDocSnap.data();
      const passwordHash = adminData.passwordHash;

      const isPasswordCorrect = await bcrypt.compare(password, passwordHash);

      if (isPasswordCorrect) {
        router.push('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }

    } catch (err) {
      console.error("Login error:", err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
                <Image src={logo} alt="No Rush logo" width={40} height={40} />
                <span className="font-bold text-2xl">No Rush</span>
            </Link>
            <h1 className="text-3xl font-bold font-headline">Admin Login</h1>
            <p className="text-muted-foreground">Access the booking management dashboard.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text" 
                  placeholder="admin"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm font-medium text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}