'use client';

import { AuthProvider, useAuth } from '@/lib/auth';
import AuthForm from '@/components/auth-form';
import Dashboard from '@/components/dashboard';
import { AppLogo } from '@/components/icons';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <AppLogo className="h-12 w-12 text-primary" />
          <p className="text-muted-foreground">Loading SplitMates...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthForm />;
}

export default function Home() {
  return (
    <AuthProvider>
      <main>
        <App />
      </main>
    </AuthProvider>
  );
}
