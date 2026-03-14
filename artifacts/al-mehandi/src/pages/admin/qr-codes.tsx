import { useGetCombos } from "@workspace/api-client-react";
import { useUploadComboQR } from "@/hooks/use-uploads";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCombosQueryKey } from "@workspace/api-client-react";
import { QrCode, Upload, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function QRCodes() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { data: combos, isLoading } = useGetCombos();
  const uploadQR = useUploadComboQR();

  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const handleFileUpload = async (comboId: number, file: File) => {
    if (!token) return;
    setUploadingId(comboId);
    try {
      await uploadQR.mutateAsync({ comboId, file, token });
      queryClient.invalidateQueries({ queryKey: getGetCombosQueryKey() });
    } catch (e) {
      console.error("QR Upload failed", e);
    } finally {
      setUploadingId(null);
    }
  };

  const FileUploader = ({ comboId, currentUrl }: { comboId: number, currentUrl?: string | null }) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const isUploading = uploadingId === comboId;

    return (
      <div className="flex flex-col gap-3 items-start">
        {currentUrl ? (
          <div className="relative group rounded-xl overflow-hidden border-2 border-border h-32 w-32 bg-white flex items-center justify-center">
            <img src={currentUrl} alt="QR Code" className="w-full h-full object-contain p-2" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => fileRef.current?.click()}
                className="text-white text-xs font-semibold px-3 py-1.5 bg-primary rounded-lg flex items-center gap-1"
              >
                <Upload size={12} /> Replace
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => fileRef.current?.click()}
            className="h-32 w-32 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center text-muted-foreground hover:text-primary"
          >
            <QrCode size={24} className="mb-2" />
            <span className="text-xs font-semibold">Upload QR</span>
          </button>
        )}
        
        <input 
          type="file" 
          ref={fileRef} 
          className="hidden" 
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(comboId, e.target.files[0]);
            }
          }}
        />
        
        {isUploading && (
          <div className="text-sm text-primary flex items-center gap-2 font-medium">
            <Loader2 size={14} className="animate-spin" /> Uploading...
          </div>
        )}
        {!isUploading && currentUrl && (
           <div className="text-xs text-green-600 flex items-center gap-1 font-medium bg-green-50 px-2 py-1 rounded">
             <CheckCircle2 size={12} /> Active
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">QR Code Management</h1>
        <p className="text-muted-foreground mt-1">Upload unique UPI QR codes for each combo price point.</p>
      </div>

      <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden p-8">
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {combos?.map((combo) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={combo.id} 
                className="flex items-start gap-6 p-6 border border-border/60 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-colors"
              >
                <FileUploader comboId={combo.id} currentUrl={combo.qrCodeUrl} />
                
                <div className="flex-1 pt-2">
                  <h3 className="font-bold text-lg text-foreground mb-1">{combo.name}</h3>
                  <p className="text-primary font-display font-bold text-xl mb-3">₹{combo.price}</p>
                  <p className="text-sm text-muted-foreground bg-background px-3 py-2 rounded-lg border border-border inline-block">
                    {combo.hennaCount} Henna + {combo.nailCount} Nail Cones
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
