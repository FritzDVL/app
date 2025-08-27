import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityCreateForm } from "@/hooks/forms/use-community-create-form";
import { useAuthStore } from "@/stores/auth-store";

export function CommunityCreateForm() {
  const { formData, loading, error, handleChange, handleImageChange, handleSubmit } = useCommunityCreateForm();
  const { account, walletAddress } = useAuthStore();

  return (
    <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <CardHeader>
        <h1 className="text-2xl font-bold text-foreground">Community Details</h1>
        <p className="text-muted-foreground">Fill in the details to start your new community</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium text-foreground">
              Community Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Lens Developers"
              className="h-12 rounded-full border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 focus:ring-blue-100 dark:bg-gray-700"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-base font-medium text-foreground">
              Community Image (optional)
            </Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="w-full rounded-2xl border-slate-300/60 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-100 dark:bg-gray-700"
              onChange={handleImageChange}
            />
            {formData.logo && (
              <div className="mt-2">
                <span className="text-xs text-foreground">Selected: {formData.logo.name}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your community..."
              required
              className="min-h-[80px] w-full rounded-2xl bg-white p-3 text-base backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:bg-gray-700"
            />
          </div>

          {/* Admin Address */}
          <div className="space-y-2">
            <Label htmlFor="adminAddress" className="text-base font-medium text-foreground">
              Admin Address
            </Label>
            <Input
              id="adminAddress"
              name="adminAddress"
              value={formData.adminAddress}
              onChange={handleChange}
              placeholder="0x... (your wallet address)"
              required
              className="rounded-2xl border-slate-300/60 bg-white/80 text-muted-foreground backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:bg-gray-700"
              disabled={!!formData.adminAddress}
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-end">
            <Button
              type="submit"
              className="rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 font-semibold text-white hover:from-green-600 hover:to-green-700 dark:bg-gray-700"
              disabled={
                loading || !formData.name.trim() || !formData.description.trim() || !formData.adminAddress.trim()
              }
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  Creating...
                </div>
              ) : (
                "Create Community"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
