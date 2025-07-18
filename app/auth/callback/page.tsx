'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error_code = searchParams.get('error');
        const error_description = searchParams.get('error_description');

        if (error_code) {
          setError(error_description || 'Authentication failed');
          setLoading(false);
          return;
        }

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (error) {
            setError(error.message);
            setLoading(false);
            return;
          }

          if (data.session) {
            setSuccess(true);
            setLoading(false);

            // Check if this is a new user that needs profile setup
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, first_name, last_name, organization_id')
              .eq('id', data.session.user.id)
              .single();

            if (!profile) {
              // New user - redirect to onboarding
              setTimeout(() => router.push('/auth/setup'), 1500);
            } else if (!profile.organization_id) {
              // User exists but no organization - redirect to organization setup
              setTimeout(
                () => router.push('/auth/setup?step=organization'),
                1500
              );
            } else {
              // Existing user with complete profile - redirect to dashboard
              setTimeout(() => router.push('/'), 1500);
            }
            return;
          }
        }

        // No code or session - redirect to sign in
        setError('Invalid authentication callback');
        setLoading(false);
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('An unexpected error occurred');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h2 className="text-lg font-semibold mb-2">
              Processing Authentication
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we complete your sign in...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-lg font-semibold mb-2">
              Authentication Successful!
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              You have been successfully signed in. Redirecting...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <XCircle className="h-6 w-6 text-destructive" />
            Authentication Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            {error || 'An error occurred during authentication'}
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/auth/signin">Try Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
