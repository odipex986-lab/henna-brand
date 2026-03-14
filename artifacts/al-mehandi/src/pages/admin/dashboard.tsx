import { useState } from "react";
import { useGetAdminOrders, useGetAnalytics, useUpdateOrderStatus, getGetAdminOrdersQueryKey, getGetAnalyticsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, Filter, Image as ImageIcon, ExternalLink, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Use custom fetch config to pass token
  const requestConfig = { request: { headers: { Authorization: `Bearer ${token}` } } };
  
  const { data: analytics, isLoading: analyticsLoading } = useGetAnalytics(requestConfig);
  const { data: orders, isLoading: ordersLoading } = useGetAdminOrders({ search, status: statusFilter }, requestConfig);
  const updateStatusMutation = useUpdateOrderStatus(requestConfig);

  const handleStatusUpdate = async (id: number, newStatus: any) => {
    try {
      await updateStatusMutation.mutateAsync({ id, data: { status: newStatus } });
      queryClient.invalidateQueries({ queryKey: getGetAdminOrdersQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetAnalyticsQueryKey() });
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const statusColors: Record<string, string> = {
    pending_verification: "bg-amber-100 text-amber-800 border-amber-200",
    payment_verified: "bg-blue-100 text-blue-800 border-blue-200",
    order_confirmed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  const statusLabels: Record<string, string> = {
    pending_verification: "Pending",
    payment_verified: "Verified",
    order_confirmed: "Confirmed",
    cancelled: "Cancelled",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your orders and track performance.</p>
      </div>

      {/* Analytics Cards */}
      {analyticsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[1,2,3,4].map(i => <div key={i} className="h-32 bg-card rounded-2xl animate-pulse"></div>)}
        </div>
      ) : analytics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-foreground">{analytics.totalOrders}</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
             <p className="text-sm font-medium text-amber-600 mb-1">Pending Verification</p>
             <p className="text-3xl font-bold text-foreground">{analytics.pendingOrders}</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
             <p className="text-sm font-medium text-green-600 mb-1">Confirmed Orders</p>
             <p className="text-3xl font-bold text-foreground">{analytics.confirmedOrders}</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
             <p className="text-sm font-medium text-blue-600 mb-1">Today's Orders</p>
             <p className="text-3xl font-bold text-foreground">{analytics.todayOrders}</p>
          </div>
        </div>
      ) : null}

      {/* Orders Table Section */}
      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary/20">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search name or phone..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 bg-background border border-border rounded-lg text-sm appearance-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="">All Statuses</option>
                <option value="pending_verification">Pending</option>
                <option value="payment_verified">Verified</option>
                <option value="order_confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {ordersLoading ? (
            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
          ) : orders?.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No orders found matching your criteria.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/40 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Combo</th>
                  <th className="px-6 py-4 font-semibold">Proof</th>
                  <th className="px-6 py-4 font-semibold">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders?.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 font-medium">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(order.createdAt), "MMM d, HH:mm")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{order.fullName}</div>
                      <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                        <span>📞 {order.phone}</span>
                        {order.whatsapp && <span className="text-green-600">Wa: {order.whatsapp}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{order.comboName}</div>
                      <div className="font-semibold mt-1">₹{order.price}</div>
                    </td>
                    <td className="px-6 py-4">
                      {order.paymentScreenshotUrl ? (
                        <a 
                          href={order.paymentScreenshotUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                        >
                          <ImageIcon size={14} /> View
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">No upload</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border appearance-none cursor-pointer outline-none ${statusColors[order.status]}`}
                        >
                          {Object.entries(statusLabels).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                        {updateStatusMutation.isPending && updateStatusMutation.variables?.id === order.id && (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
