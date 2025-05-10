
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

const Verify = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <Card className="w-full card-neumorph animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
        <CardDescription>
          We've sent a verification link to {email}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4 py-8">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
          <Mail className="h-12 w-12 text-primary" />
        </div>
        <p className="text-center text-muted-foreground">
          Click the link in the email to verify your account. If you don't see it, check your spam folder.
        </p>
        <Button variant="outline" className="mt-4">
          Resend verification email
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          <Link to="/auth/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Verify;
