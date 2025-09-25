
import { ContactForm } from '@/components/ContactForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl">Get in Touch</h1>
                <p className="text-muted-foreground md:text-xl/relaxed text-neutral-950">
                    Have a question or want to book a service? Send us a message and we'll get back to you shortly.
                </p>
            </div>
            <div className="space-y-4">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Phone className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>Call Us</CardTitle>
                            <CardDescription>(929) 637-2276</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Mail className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>Email Us</CardTitle>
                            <CardDescription>norushnyc@gmail.com</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
        <Card className="p-2">
            <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>Fill out the form below.</CardDescription>
            </CardHeader>
            <CardContent>
                <ContactForm />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
