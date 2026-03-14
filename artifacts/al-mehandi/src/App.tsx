import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppLayout } from "@/components/layout/AppLayout";
import AdminLayout from "@/pages/admin/layout";

// Pages
import Home from "@/pages/home";
import Checkout from "@/pages/checkout";
import Payment from "@/pages/payment";
import Success from "@/pages/success";
import Track from "@/pages/track";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminQRCodes from "@/pages/admin/qr-codes";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public Routes with AppLayout */}
      <Route path="/" component={() => <AppLayout><Home /></AppLayout>} />
      <Route path="/checkout" component={() => <AppLayout><Checkout /></AppLayout>} />
      <Route path="/payment/:id" component={() => <AppLayout><Payment /></AppLayout>} />
      <Route path="/success" component={() => <AppLayout><Success /></AppLayout>} />
      <Route path="/track" component={() => <AppLayout><Track /></AppLayout>} />

      {/* Admin Routes with AdminLayout */}
      <Route path="/admin/login" component={() => <AdminLayout><AdminLogin /></AdminLayout>} />
      <Route path="/admin" component={() => <AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/qr-codes" component={() => <AdminLayout><AdminQRCodes /></AdminLayout>} />
      
      {/* 404 */}
      <Route component={() => <AppLayout><NotFound /></AppLayout>} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
