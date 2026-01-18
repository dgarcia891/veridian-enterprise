import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ViewCount {
  slug: string;
  count: number;
}

export const useBlogViewCounts = () => {
  return useQuery({
    queryKey: ["blog-view-counts"],
    queryFn: async (): Promise<Record<string, number>> => {
      // Query analytics_events for blog_view events and count by slug
      const { data, error } = await supabase
        .from("analytics_events")
        .select("metadata")
        .eq("event_name", "blog_view");

      if (error) {
        console.error("Failed to fetch blog view counts:", error);
        return {};
      }

      // Count views per slug
      const counts: Record<string, number> = {};
      data?.forEach((event) => {
        const metadata = event.metadata as { slug?: string } | null;
        const slug = metadata?.slug;
        if (slug) {
          counts[slug] = (counts[slug] || 0) + 1;
        }
      });

      return counts;
    },
  });
};
