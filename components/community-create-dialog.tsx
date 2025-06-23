"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateCommunityFormData, useCommunityCreation } from "@/hooks/use-community-create";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface CommunityCreateDialogProps {
  onCommunityCreated: (community: any) => void;
}

export function CommunityCreateDialog({ onCommunityCreated }: CommunityCreateDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateCommunityFormData>({
    name: "",
    description: "",
    adminAddress: "",
  });

  const { createCommunity, isCreating } = useCommunityCreation();

  const handleCreateCommunity = async () => {
    try {
      await createCommunity(formData, newCommunity => {
        onCommunityCreated(newCommunity);
      });

      setFormData({ name: "", description: "", adminAddress: "" });
      setIsDialogOpen(false);
      setError(null);
      toast.success("Community created successfully!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Community name is required");
      toast.error("Please enter a community name.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Community description is required");
      toast.error("Please enter a community description.");
      return;
    }

    setError(null);
    await handleCreateCommunity();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 font-semibold text-white shadow-lg hover:from-brand-600 hover:to-brand-700"
          onClick={() => setError(null)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="border-0 bg-white/90 shadow-lg backdrop-blur-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Create Community</DialogTitle>
          <DialogDescription className="text-slate-600">Create a new community on Lens Protocol</DialogDescription>
          {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-medium text-slate-900">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Community name"
              className="border-slate-200 bg-white/70 backdrop-blur-sm focus:border-brand-400 focus:ring-brand-200"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="font-medium text-slate-900">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              placeholder="What's your community about?"
              rows={3}
              className="resize-none border-slate-200 bg-white/70 backdrop-blur-sm focus:border-brand-400 focus:ring-brand-200"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminAddress" className="font-medium text-slate-900">
              Admin Address
            </Label>
            <Input
              id="adminAddress"
              value={formData.adminAddress}
              onChange={e =>
                setFormData({
                  ...formData,
                  adminAddress: e.target.value,
                })
              }
              placeholder="0x..."
              className="border-slate-200 bg-white/70 font-mono text-sm backdrop-blur-sm focus:border-brand-400 focus:ring-brand-200"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-slate-200 bg-white/70 text-slate-700 hover:bg-slate-50"
              onClick={() => setIsDialogOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-brand-500 to-brand-600 font-semibold text-white hover:from-brand-600 hover:to-brand-700"
              disabled={isCreating}
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  Creating...
                </div>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
