import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

// Manual fetch hooks for multipart/form-data uploads
// These endpoints are not strictly typed in OpenAPI

export function useUploadScreenshot() {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async ({ orderId, file }: { orderId: number; file: File }) => {
      const formData = new FormData();
      formData.append("screenshot", file);

      // Using XMLHttpRequest to track progress if needed, or just fetch
      return new Promise<{ paymentScreenshotUrl: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `/api/orders/${orderId}/screenshot`);
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(formData);
      });
    }
  });

  return { ...mutation, progress };
}

export function useUploadComboQR() {
  return useMutation({
    mutationFn: async ({ comboId, file, token }: { comboId: number; file: File; token: string }) => {
      const formData = new FormData();
      formData.append("qr", file);

      const res = await fetch(`/api/admin/combos/${comboId}/qr`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload QR code");
      }

      return res.json() as Promise<{ qrCodeUrl: string }>;
    }
  });
}
