import { useCallback } from "react";
import { useGetOrderDocumentMutation } from "@/lib/graphql/generated/types";
import type { OrderDocumentType } from "@/lib/graphql/generated/types";
import { toast } from "sonner";

export interface UseOrderDocumentOptions {
  workspaceId: string;
}

export function useOrderDocument({ workspaceId }: UseOrderDocumentOptions) {
  const [runMutation] = useGetOrderDocumentMutation();

  const downloadDocument = useCallback(
    async (amazonOrderId: string, documentType: OrderDocumentType) => {
      try {
        const result = await runMutation({
          variables: { input: { workspaceId, amazonOrderId, documentType } },
        });

        const payload = result.data?.getOrderDocument;
        if (!payload) return;

        if (payload.downloadUrl) {
          window.open(payload.downloadUrl, "_blank");
          return;
        }

        if (payload.base64Pdf) {
          const bytes = atob(payload.base64Pdf);
          const buffer = new Uint8Array(bytes.length);
          for (let i = 0; i < bytes.length; i++) buffer[i] = bytes.charCodeAt(i);
          const blob = new Blob([buffer], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = payload.fileName;
          a.click();
          URL.revokeObjectURL(url);
        }
      } catch (err) {
        toast.error("Download failed", {
          description: err instanceof Error ? err.message : "Could not retrieve document from Amazon.",
        });
      }
    },
    [workspaceId, runMutation]
  );

  return { downloadDocument };
}
