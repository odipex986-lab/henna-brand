import { Link } from "wouter";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Success() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-card p-10 rounded-3xl border border-border shadow-xl text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">Order Submitted!</h1>
        
        <p className="text-muted-foreground leading-relaxed mb-8">
          Your order has been submitted successfully. Our team will verify the payment screenshot shortly. 
          You will receive a confirmation message on your WhatsApp number after verification.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/track" 
            className="w-full block py-4 rounded-xl font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            Track Order Status
          </Link>
          <Link 
            href="/" 
            className="w-full py-4 rounded-xl font-semibold henna-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300 flex justify-center items-center gap-2"
          >
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
