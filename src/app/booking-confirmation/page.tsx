import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function BookingConfirmationPage() {
  return (
    <div className="container mx-auto flex items-center justify-center py-24 px-4 md:px-6">
      <Card className="max-w-md w-full text-center p-8 shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-accent rounded-full p-3 w-fit">
            <CheckCircle2 className="h-12 w-12 text-accent-foreground" />
          </div>
          <CardTitle className="text-3xl font-headline mt-4">Booking Submitted!</CardTitle>
          <CardDescription className="text-muted-foreground pt-2">
            Thank you for your booking. You'll receive an email confirmation shortly with all the details of your service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full bg-black text-white">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
