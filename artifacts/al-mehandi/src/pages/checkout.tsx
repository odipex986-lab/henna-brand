import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useGetCombos, useCreateOrder } from "@workspace/api-client-react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  whatsapp: z.string().min(10, "Valid WhatsApp number is required"),
  address: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [location, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const comboId = searchParams.get("comboId");
  
  const { data: combos, isLoading: isLoadingCombos } = useGetCombos();
  const createOrder = useCreateOrder();

  const combo = combos?.find(c => c.id === Number(comboId));

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      whatsapp: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      notes: "",
    }
  });

  if (!comboId || (!isLoadingCombos && !combo)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-display font-bold mb-4">Combo Not Found</h2>
        <button onClick={() => navigate("/")} className="text-primary hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Return to Shop
        </button>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    try {
      const order = await createOrder.mutateAsync({
        data: {
          comboId: Number(comboId),
          ...data,
          notes: data.notes || null,
        }
      });
      navigate(`/payment/${order.id}`);
    } catch (error) {
      console.error("Order creation failed", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <button onClick={() => navigate("/")} className="mb-8 text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2">
        <ArrowLeft size={16} /> Back to Combos
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Form Section */}
        <div className="lg:col-span-7 lg:order-1 order-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-8 rounded-3xl border border-border shadow-lg"
          >
            <h2 className="text-3xl font-display font-bold text-foreground mb-8">Delivery Details</h2>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Full Name <span className="text-destructive">*</span></label>
                <input 
                  {...form.register("fullName")}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="Enter your full name"
                />
                {form.formState.errors.fullName && <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Phone Number <span className="text-destructive">*</span></label>
                  <input 
                    {...form.register("phone")}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="10-digit mobile number"
                  />
                  {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">WhatsApp Number <span className="text-destructive">*</span></label>
                  <input 
                    {...form.register("whatsapp")}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="For order updates"
                  />
                  {form.formState.errors.whatsapp && <p className="text-sm text-destructive">{form.formState.errors.whatsapp.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Delivery Address <span className="text-destructive">*</span></label>
                <textarea 
                  {...form.register("address")}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                  placeholder="House/Flat No., Street, Landmark"
                />
                {form.formState.errors.address && <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2 sm:col-span-1">
                  <label className="text-sm font-semibold text-foreground">City <span className="text-destructive">*</span></label>
                  <input 
                    {...form.register("city")}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                  {form.formState.errors.city && <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>}
                </div>
                <div className="space-y-2 sm:col-span-1">
                  <label className="text-sm font-semibold text-foreground">State <span className="text-destructive">*</span></label>
                  <input 
                    {...form.register("state")}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                  {form.formState.errors.state && <p className="text-sm text-destructive">{form.formState.errors.state.message}</p>}
                </div>
                <div className="space-y-2 sm:col-span-1">
                  <label className="text-sm font-semibold text-foreground">Pincode <span className="text-destructive">*</span></label>
                  <input 
                    {...form.register("pincode")}
                    className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                  {form.formState.errors.pincode && <p className="text-sm text-destructive">{form.formState.errors.pincode.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Order Notes (Optional)</label>
                <textarea 
                  {...form.register("notes")}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                  placeholder="Any special instructions?"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={createOrder.isPending}
                  className="w-full py-4 rounded-xl font-semibold henna-gradient text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 flex justify-center items-center gap-2 text-lg"
                >
                  {createOrder.isPending ? (
                    <><Loader2 className="animate-spin" /> Processing...</>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
              </div>

              {createOrder.isError && (
                <p className="text-center text-destructive text-sm mt-4">
                  There was an error creating your order. Please try again.
                </p>
              )}

            </form>
          </motion.div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-5 lg:order-2 order-1">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-28 bg-secondary/40 p-8 rounded-3xl border border-border"
          >
            <h3 className="text-xl font-display font-bold text-foreground mb-6">Order Summary</h3>
            
            {isLoadingCombos ? (
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-card rounded-xl border border-border"></div>
                <div className="h-12 bg-card rounded-xl border border-border"></div>
              </div>
            ) : combo ? (
              <div className="space-y-6">
                <div className="flex gap-4 p-4 bg-card rounded-2xl border border-border shadow-sm">
                  <div className="w-20 h-20 bg-secondary rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={`${import.meta.env.BASE_URL}images/henna-placeholder.png`}
                      alt={combo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <h4 className="font-bold text-foreground">{combo.name}</h4>
                    <p className="text-sm text-muted-foreground">{combo.hennaCount} Henna, {combo.nailCount} Nail Cones</p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-lg text-primary">₹{combo.price}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-border space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{combo.price}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="pt-3 flex justify-between items-center text-xl font-bold text-foreground border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">₹{combo.price}</span>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex gap-3 text-sm text-primary">
                  <div className="shrink-0 mt-0.5">ℹ️</div>
                  <p>Next step is payment via UPI. You will be asked to upload a screenshot of your successful transaction.</p>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
