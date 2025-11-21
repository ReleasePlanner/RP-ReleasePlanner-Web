import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { featuresService } from "../../../../../../api/services/features.service";

export function useFeaturePrefetch(productId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (productId) {
      queryClient.prefetchQuery({
        queryKey: ["features", "list", productId],
        queryFn: () => featuresService.getAll(productId),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [productId, queryClient]);
}

