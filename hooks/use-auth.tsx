'use client';

import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer';
  organization_id: string;
  organization?: {
    id: string;
    name: string;
    plan: 'starter' | 'professional' | 'enterprise';
    domain?: string;
  };
  department?: string;
  phone?: string;
  location?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  is_active: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  mfa_enabled: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    dateFormat: string;
    timeFormat: '12h' | '24h';
    currency: string;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  session: Session | null;
  // Authentication methods
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithOAuth: (
    provider: 'google' | 'github'
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    organizationName?: string
  ) => Promise<{ error?: string }>;
  // Profile management
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ error?: string }>;
  // Password recovery
  resetPassword: (email: string) => Promise<{ error?: string }>;
  confirmPasswordReset: (
    token: string,
    newPassword: string
  ) => Promise<{ error?: string }>;
  // Email verification
  resendEmailVerification: () => Promise<{ error?: string }>;
  // MFA methods
  enableMFA: () => Promise<{ qrCode?: string; error?: string }>;
  disableMFA: (code: string) => Promise<{ error?: string }>;
  verifyMFA: (code: string) => Promise<{ error?: string }>;
  // Organization management
  switchOrganization: (organizationId: string) => Promise<{ error?: string }>;
  // Utilities
  isAuthenticated: boolean;
  hasRole: (roles: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role hierarchy for permission checks
const ROLE_HIERARCHY = {
  owner: 5,
  admin: 4,
  manager: 3,
  member: 2,
  viewer: 1,
};

// Permission mapping
const ROLE_PERMISSIONS = {
  owner: ['*'], // All permissions
  admin: ['read:*', 'write:*', 'delete:*', 'manage:users', 'manage:settings'],
  manager: ['read:*', 'write:*', 'manage:team'],
  member: ['read:*', 'write:own', 'create:*'],
  viewer: ['read:*'],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          if (session?.user) {
            await loadUserProfile(session.user);
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      setSession(session);

      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      let { data: profile, error } = await supabase
        .from('profiles')
        .select(
          `
          *,
          organization:organizations(
            id,
            name,
            plan,
            domain
          )
        `
        )
        .eq('id', supabaseUser.id)
        .single();

      // If profile doesn't exist, create one
      if (error && error.code === 'PGRST116') {
        console.log('Creating new profile for user:', supabaseUser.id);

        // Create a basic profile for the new user
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            first_name:
              supabaseUser.user_metadata?.first_name ||
              supabaseUser.email?.split('@')[0] ||
              'User',
            last_name: supabaseUser.user_metadata?.last_name || '',
            role: 'member', // Default role
            is_active: true,
          })
          .select(
            `
            *,
            organization:organizations(
              id,
              name,
              plan,
              domain
            )
          `
          )
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return;
        }

        profile = newProfile;
      } else if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (profile) {
        const userData: User = {
          id: profile.id,
          email: profile.email,
          name:
            `${profile.first_name || ''} ${profile.last_name || ''}`.trim() ||
            profile.email.split('@')[0],
          avatar: profile.avatar_url || undefined,
          role:
            (profile.role as
              | 'owner'
              | 'admin'
              | 'manager'
              | 'member'
              | 'viewer') || 'member',
          organization_id: profile.organization_id || '',
          organization: profile.organization
            ? {
                id: profile.organization.id,
                name: profile.organization.name,
                plan:
                  (profile.organization.plan as
                    | 'starter'
                    | 'professional'
                    | 'enterprise') || 'starter',
                domain: profile.organization.domain || undefined,
              }
            : undefined,
          department: profile.department || undefined,
          phone: profile.phone || undefined,
          location: profile.location || undefined,
          bio: profile.bio || undefined,
          timezone: profile.timezone || undefined,
          language: profile.language || undefined,
          is_active: profile.is_active !== false,
          email_verified: !!supabaseUser.email_confirmed_at,
          phone_verified: false, // will be implemented later
          mfa_enabled: false, // will be implemented later
          created_at: profile.created_at || new Date().toISOString(),
          updated_at: profile.updated_at || new Date().toISOString(),
          last_login: profile.last_login || undefined,
          preferences: (profile.preferences as any) || {
            theme: 'system',
            notifications: {
              email: true,
              push: true,
              sms: false,
            },
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            currency: 'USD',
          },
        };
        setUser(userData);

        // Update last login
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', supabaseUser.id);
      }
    } catch (error) {
      console.error('Profile loading error:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error: error.message };
      }

      // Check if user requires MFA
      if (data.user && !data.session) {
        return { error: 'mfa_required' };
      }

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });

      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('OAuth sign in error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('OAuth sign in error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    organizationName?: string
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            organization_name: organizationName,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error: error.message };
      }

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: 'Check your email',
          description: "We've sent you a verification link.",
        });
      }

      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }

      setUser(null);
      setSession(null);

      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: 'Not authenticated' };

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        return { error: error.message };
      }

      // Update local user state
      setUser(prev =>
        prev
          ? { ...prev, ...updates, updated_at: new Date().toISOString() }
          : null
      );

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });

      return {};
    } catch (error) {
      console.error('Profile update error:', error);
      return { error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      // First verify current password
      if (!user?.email) return { error: 'User email not found' };

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) {
        return { error: 'Current password is incorrect' };
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Password change error:', error);
        return { error: error.message };
      }

      toast({
        title: 'Password changed',
        description: 'Your password has been successfully updated.',
      });

      return {};
    } catch (error) {
      console.error('Password change error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        return { error: error.message };
      }

      toast({
        title: 'Reset email sent',
        description: 'Check your email for password reset instructions.',
      });

      return {};
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const confirmPasswordReset = async (token: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Password reset confirmation error:', error);
        return { error: error.message };
      }

      toast({
        title: 'Password reset',
        description: 'Your password has been successfully reset.',
      });

      return {};
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const resendEmailVerification = async () => {
    if (!user?.email) return { error: 'User email not found' };

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) {
        console.error('Email verification error:', error);
        return { error: error.message };
      }

      toast({
        title: 'Verification email sent',
        description: 'Check your email for the verification link.',
      });

      return {};
    } catch (error) {
      console.error('Email verification error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const enableMFA = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });

      if (error) {
        console.error('MFA enable error:', error);
        return { error: error.message };
      }

      return { qrCode: data.totp.qr_code };
    } catch (error) {
      console.error('MFA enable error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const disableMFA = async (code: string) => {
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.totp?.[0];

      if (!totpFactor) {
        return { error: 'No MFA factor found' };
      }

      const { error } = await supabase.auth.mfa.unenroll({
        factorId: totpFactor.id,
      });

      if (error) {
        console.error('MFA disable error:', error);
        return { error: error.message };
      }

      // Update user profile
      await updateProfile({ mfa_enabled: false });

      toast({
        title: 'MFA disabled',
        description: 'Multi-factor authentication has been disabled.',
      });

      return {};
    } catch (error) {
      console.error('MFA disable error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const verifyMFA = async (code: string) => {
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.totp?.[0];

      if (!totpFactor) {
        return { error: 'No MFA factor found' };
      }

      const { data, error } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: totpFactor.id,
        code,
      });

      if (error) {
        console.error('MFA verify error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('MFA verify error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const switchOrganization = async (organizationId: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ organization_id: organizationId })
        .eq('id', user.id);

      if (error) {
        console.error('Organization switch error:', error);
        return { error: error.message };
      }

      // Reload user profile to get new organization data
      if (session?.user) {
        await loadUserProfile(session.user);
      }

      return {};
    } catch (error) {
      console.error('Organization switch error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const refreshSession = async () => {
    try {
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Session refresh error:', error);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  };

  const hasRole = (roles: string | string[]) => {
    if (!user) return false;

    const userRoleLevel = ROLE_HIERARCHY[user.role] || 0;
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    return requiredRoles.some(role => {
      const requiredLevel =
        ROLE_HIERARCHY[role as keyof typeof ROLE_HIERARCHY] || 0;
      return userRoleLevel >= requiredLevel;
    });
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;

    const userPermissions = ROLE_PERMISSIONS[user.role] || [];

    // Check for wildcard permission
    if (userPermissions.includes('*')) return true;

    // Check for exact permission match
    if (userPermissions.includes(permission)) return true;

    // Check for wildcard pattern matches
    return userPermissions.some(userPerm => {
      if (userPerm.endsWith(':*')) {
        const prefix = userPerm.slice(0, -2);
        return permission.startsWith(`${prefix}:`);
      }
      return false;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        session,
        signIn,
        signInWithOAuth,
        signOut,
        signUp,
        updateProfile,
        changePassword,
        resetPassword,
        confirmPasswordReset,
        resendEmailVerification,
        enableMFA,
        disableMFA,
        verifyMFA,
        switchOrganization,
        isAuthenticated: !!user && !!session,
        hasRole,
        hasPermission,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protecting routes
export function useRequireAuth(roles?: string | string[]) {
  const { user, loading, hasRole } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth/signin';
    }

    if (!loading && user && roles && !hasRole(roles)) {
      toast({
        title: 'Access denied',
        description: "You don't have permission to access this page.",
        variant: 'destructive',
      });
      window.location.href = '/';
    }
  }, [user, loading, roles, hasRole]);

  return { user, loading };
}
