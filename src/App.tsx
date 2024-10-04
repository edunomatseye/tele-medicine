import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import { useAuthStore } from '@/store/useAuthStore';

function App() {
  const { user, isLoading, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        {user ? <Dashboard /> : <Login />}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;