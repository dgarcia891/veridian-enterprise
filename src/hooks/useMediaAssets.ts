import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MediaAsset {
  id: string;
  url: string;
  thumbnail_url: string | null;
  type: string;
  alt_text: string | null;
  title: string | null;
  file_name: string | null;
  file_size: number | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

export function useMediaAssets(search?: string) {
  return useQuery({
    queryKey: ["media-assets", search],
    queryFn: async () => {
      let query = supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(`title.ilike.%${search}%,alt_text.ilike.%${search}%,file_name.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MediaAsset[];
    },
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `media/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      const url = urlData.publicUrl;

      // Determine type
      const type = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : "other";

      // Insert into media_assets
      const { data, error } = await supabase
        .from("media_assets")
        .insert({
          url,
          type,
          file_name: file.name,
          file_size: file.size,
          title: file.name.replace(/\.[^/.]+$/, ""),
        })
        .select()
        .single();

      if (error) throw error;
      return data as MediaAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-assets"] });
    },
  });
}

export function useUpdateMediaAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      alt_text,
    }: {
      id: string;
      title?: string;
      alt_text?: string;
    }) => {
      const { data, error } = await supabase
        .from("media_assets")
        .update({ title, alt_text })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as MediaAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-assets"] });
    },
  });
}

export function useDeleteMediaAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("media_assets")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-assets"] });
    },
  });
}
