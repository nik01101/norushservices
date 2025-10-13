'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// 1. Import Firestore functions
import { db } from '@/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function ContactForm() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // 2. Add state for each input field
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 3. Create a reference to your new collection
            const messagesCollectionRef = collection(db, 'contact_messages');

            // 4. Add a new document with the form data
            await addDoc(messagesCollectionRef, {
                name: name,
                email: email,
                phone: phone,
                message: message,
                status: 'unread', // Useful for the admin dashboard
                createdAt: serverTimestamp(), // For sorting by newest first
            });

            // Show success toast
            toast({
                title: 'Message Sent!',
                description: "Thanks for reaching out. We'll get back to you soon.",
                className: 'bg-accent text-accent-foreground',
            });
            
            // 5. Reset the form fields by clearing the state
            setName('');
            setEmail('');
            setPhone('');
            setMessage('');

        } catch (error) {
            console.error("Error sending message:", error);
            toast({
                title: 'Something went wrong.',
                description: 'Please try sending your message again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // 6. Connect state to the JSX inputs
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                    id="name" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                    id="phone" 
                    type="tel" // Use 'tel' for better mobile experience
                    required 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                    id="message" 
                    required 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
        </form>
    );
}