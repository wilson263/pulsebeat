import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { MusicPlayerProvider } from "@/context/music-player";
import NotFound from "@/pages/not-found";

// Pages
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Scanner from "@/pages/scanner";
import Music from "@/pages/music";
import Player from "@/pages/player";
import Contact from "@/pages/contact";
import About from "@/pages/about";

const queryClient = new QueryClient();

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/">
        {isLoading ? null : isAuthenticated ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      <Route path="/dashboard">
        <AppLayout><Dashboard /></AppLayout>
      </Route>
      <Route path="/scanner">
        <AppLayout><Scanner /></AppLayout>
      </Route>
      <Route path="/music">
        <AppLayout><Music /></AppLayout>
      </Route>
      <Route path="/player">
        <AppLayout><Player /></AppLayout>
      </Route>
      <Route path="/contact">
        <AppLayout><Contact /></AppLayout>
      </Route>
      <Route path="/about">
        <AppLayout><About /></AppLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MusicPlayerProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </MusicPlayerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
