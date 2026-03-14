import { useState } from "react";
import { useGetOrder } from "@workspace/api-client-react";
import { Search, Package, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Track() {
  const [searchInput, setSearchInput] = useState("");
  const [queryId, setQueryId] = useState<number>(0);
  
  const { data: order, isLoading, isError, error } = useGetOrder(queryId, {
    query: {
      enabled: queryId > 0,
      retry: false
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(searchInput, 10);
    if (!isNaN(id) && id > 0) {
      setQueryId(id);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending_verification':
        return { icon: <Clock className="text-amber-500" />, text: "Pending Verification", color: "text-amber-600 bg-amber-50 border-amber-200" };
      case 'payment_verified':
        return { icon: <CheckCircle2 className="text-blue-500" />, text: "Payment Verified", color: "text-blue-600 bg-blue-50 border-blue-200" };
      case 'order_confirmed':
        return { icon: <Package className="text-green-500" />, text: "Order Confirmed", color: "text-green-600 bg-green-50 border-green-200" };
      case 'cancelled':
        return { icon: <XCircle className="text-destructive" />, text: "Cancelled", color: "text-destructive bg-destructive/10 border-destructive/20" };
      default:
        return { icon: <AlertCircle />, text: "Unknown", color: "text-muted-foreground bg-secondary" };
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">Track Your Order</h1>
        <p className="text-muted-foreground">Enter your Order ID to check its current status.</p>
      </div>

      <div className="bg-card p-2 rounded-2xl border border-border shadow-md max-w-xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="flex relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-muted-foreground" size={20} />
          </div>
          <input
            type="number"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-transparent focus:outline-none text-lg"
            placeholder="Order ID (e.g. 1004)"
            required
          />
          <button 
            type="submit"
            className="shrink-0 px-8 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Track
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
        </div>
      )}

      {isError && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/20 p-6 rounded-2xl text-center max-w-xl mx-auto text-destructive"
        >
          <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-80" />
          <p className="font-semibold text-lg">Order not found</p>
          <p className="text-sm mt-1 opacity-90">Please check the ID and try again. If you just placed it, give it a few minutes.</p>
        </motion.div>
      )}

      {order && !isLoading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden"
        >
          <div className="bg-secondary/40 p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Order #{order.id}</p>
              <h3 className="font-display font-bold text-2xl text-foreground">{order.comboName}</h3>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground font-medium mb-1">Placed On</p>
              <p className="font-semibold">{format(new Date(order.createdAt), "MMM d, yyyy")}</p>
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              {(() => {
                const status = getStatusDisplay(order.status);
                return (
                  <>
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6 shadow-inner relative">
                      <div className="absolute inset-0 bg-white/50 rounded-full" />
                      <div className="relative z-10 scale-150">{status.icon}</div>
                    </div>
                    <h4 className="text-2xl font-bold mb-2">Current Status</h4>
                    <span className={`px-4 py-1.5 rounded-full font-semibold border ${status.color}`}>
                      {status.text}
                    </span>
                    
                    <p className="mt-8 text-muted-foreground max-w-md mx-auto leading-relaxed">
                      {order.status === 'pending_verification' && "We have received your order details and screenshot. Our team will review the payment shortly."}
                      {order.status === 'payment_verified' && "Your payment has been successfully verified! We are now preparing your order."}
                      {order.status === 'order_confirmed' && "Your order is confirmed and will be dispatched soon. Thank you for choosing Al Mehandi!"}
                      {order.status === 'cancelled' && "This order has been cancelled. Please contact us on WhatsApp if you think this is a mistake."}
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
