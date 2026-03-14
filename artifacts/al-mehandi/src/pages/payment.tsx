import { useGetOrder } from "@workspace/api-client-react";
import { useUploadScreenshot } from "@/hooks/use-uploads";
import { useLocation, useParams } from "wouter";
import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, QrCode, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Payment() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const orderId = Number(id);
  
  const { data: order, isLoading: isLoadingOrder, error: orderError } = useGetOrder(orderId);
  const uploadMutation = useUploadScreenshot();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await uploadMutation.mutateAsync({ orderId, file: selectedFile });
      navigate("/success");
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  if (isLoadingOrder) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-display font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the details for this order.</p>
        <button onClick={() => navigate("/")} className="text-primary hover:underline">
          Return to Home
        </button>
      </div>
    );
  }

  // Temporary hardcoded logic for combo QR since API might not return it mapped directly inside order
  // A production app would fetch combo details or include QR in order payload.
  // For UI completeness, we use a placeholder if qrCodeUrl isn't directly on order.
  const qrPlaceholder = `${import.meta.env.BASE_URL}images/logo.png`; // Fallback image

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
          <QrCode size={32} />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">Complete Your Payment</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Scan the QR code below using any UPI app (GPay, PhonePe, Paytm) to pay 
          <span className="font-bold text-foreground"> ₹{order.price}</span> for your order.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left: QR Code Display */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card p-8 rounded-3xl border border-border shadow-lg flex flex-col items-center text-center"
        >
          <div className="bg-secondary/50 p-4 rounded-2xl mb-6">
            {/* Render actual QR if we had it, else placeholder */}
            <div className="w-64 h-64 bg-white border-4 border-primary/20 rounded-xl p-4 flex items-center justify-center shadow-inner relative overflow-hidden">
               <img src={qrPlaceholder} alt="Scan to pay" className="opacity-80 mix-blend-multiply" />
               <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                 <span className="font-bold text-primary text-xl border-2 border-primary px-4 py-2 rounded-lg bg-white/80">QR Code</span>
               </div>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Pay ₹{order.price}</h3>
          <p className="text-sm text-muted-foreground mb-6">Combo: {order.comboName}</p>
          
          <div className="w-full bg-blue-50 text-blue-800 p-4 rounded-xl text-sm text-left">
            <span className="font-semibold block mb-1">UPI ID:</span>
            <code className="bg-blue-100 px-2 py-1 rounded">almehandi@upi</code>
          </div>
        </motion.div>

        {/* Right: Upload Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <h3 className="text-2xl font-display font-bold mb-4">Upload Screenshot</h3>
          <p className="text-muted-foreground mb-8">
            After a successful payment, please upload a screenshot of the transaction here to confirm your order.
          </p>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300
              ${previewUrl ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-secondary/50'}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileSelect}
            />
            
            {previewUrl ? (
              <div className="relative inline-block">
                <img src={previewUrl} alt="Preview" className="max-h-48 rounded-xl shadow-md" />
                <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1 shadow-lg">
                  <CheckCircle2 size={20} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-background rounded-full shadow-sm flex items-center justify-center mb-4 text-primary">
                  <UploadCloud size={32} />
                </div>
                <h4 className="font-bold text-foreground mb-2">Click to browse files</h4>
                <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
              className="w-full py-4 rounded-xl font-semibold henna-gradient text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 flex justify-center items-center gap-2"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" /> 
                  Uploading {uploadMutation.progress}%
                </>
              ) : (
                "Confirm Payment"
              )}
            </button>
          </div>
          
          {uploadMutation.isError && (
             <p className="text-destructive text-sm text-center mt-4">Failed to upload screenshot. Please try again.</p>
          )}
        </motion.div>

      </div>
    </div>
  );
}
