import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ImageUploadInput } from "@/components/ui/image-upload-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityCreateForm } from "@/hooks/forms/use-community-create-form";

export function CommunityCreateForm() {
  const { formData, loading, error, handleChange, handleSubmit } = useCommunityCreateForm();

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
              required
            />
          </div>

          {/* Image Upload */}
          <ImageUploadInput
            id="community-create-image"
            label="Community Image (optional)"
            recommended="PNG, JPG up to 5MB. Recommended: 200x200px"
            disabled={loading}
            onFileChange={file => handleChange({ target: { name: "logo", value: file } })}
          />

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
              disabled={!!formData.adminAddress}
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-end">
            <Button
              type="submit"
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
