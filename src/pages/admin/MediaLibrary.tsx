import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  useMediaAssets,
  useUploadMedia,
  useUpdateMediaAsset,
  useDeleteMediaAsset,
  MediaAsset,
} from "@/hooks/useMediaAssets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Upload,
  Search,
  Trash2,
  Pencil,
  Copy,
  Loader2,
  ImageIcon,
  Film,
  FileIcon,
  X,
} from "lucide-react";

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function TypeIcon({ type }: { type: string }) {
  if (type === "image") return <ImageIcon className="h-4 w-4" />;
  if (type === "video") return <Film className="h-4 w-4" />;
  return <FileIcon className="h-4 w-4" />;
}

const MediaLibrary = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editAsset, setEditAsset] = useState<MediaAsset | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAlt, setEditAlt] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: assets, isLoading } = useMediaAssets(debouncedSearch || undefined);
  const uploadMedia = useUploadMedia();
  const updateAsset = useUpdateMediaAsset();
  const deleteAsset = useDeleteMediaAsset();

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Admin check
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsAdmin(false); return; }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;

      for (const file of Array.from(files)) {
        try {
          await uploadMedia.mutateAsync(file);
          toast.success(`Uploaded ${file.name}`);
        } catch (err: any) {
          toast.error(`Failed to upload ${file.name}: ${err.message}`);
        }
      }

      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [uploadMedia]
  );

  const handleEdit = (asset: MediaAsset) => {
    setEditAsset(asset);
    setEditTitle(asset.title || "");
    setEditAlt(asset.alt_text || "");
  };

  const handleSaveEdit = async () => {
    if (!editAsset) return;
    try {
      await updateAsset.mutateAsync({
        id: editAsset.id,
        title: editTitle,
        alt_text: editAlt,
      });
      toast.success("Asset updated");
      setEditAsset(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAsset.mutateAsync(deleteId);
      toast.success("Asset deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
    setDeleteId(null);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You need admin privileges.</p>
          <Link to="/" className="text-primary hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Blog
            </Link>
            <h1 className="text-3xl font-bold">Media Library</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploadMedia.isPending}>
              {uploadMedia.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !assets?.length ? (
          <div className="text-center py-20 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No media assets yet</p>
            <p className="text-sm mt-1">Upload images to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group relative rounded-lg border border-border bg-card overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all"
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                  {asset.type === "image" ? (
                    <img
                      src={asset.url}
                      alt={asset.alt_text || asset.title || ""}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <TypeIcon type={asset.type} />
                  )}
                </div>

                {/* Info */}
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{asset.title || asset.file_name || "Untitled"}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(asset.file_size)}</p>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" onClick={() => copyUrl(asset.url)} title="Copy URL">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" onClick={() => handleEdit(asset)} title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => setDeleteId(asset.id)} title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editAsset} onOpenChange={(open) => !open && setEditAsset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
          </DialogHeader>
          {editAsset && (
            <div className="space-y-4">
              {editAsset.type === "image" && (
                <img
                  src={editAsset.url}
                  alt={editAsset.alt_text || ""}
                  className="w-full max-h-48 object-contain rounded bg-muted"
                />
              )}
              <div>
                <Label>Title</Label>
                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>
              <div>
                <Label>Alt Text</Label>
                <Input
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  placeholder="Describe the image for accessibility"
                />
              </div>
              <div>
                <Label>URL</Label>
                <div className="flex gap-2">
                  <Input value={editAsset.url} readOnly className="text-xs" />
                  <Button size="icon" variant="outline" onClick={() => copyUrl(editAsset.url)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAsset(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={updateAsset.isPending}>
              {updateAsset.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this media asset. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MediaLibrary;
