"use client";

import { Button } from "@/components/ui/button";
import { ImageUploadInput } from "@/components/ui/image-upload-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityEditForm } from "@/hooks/forms/use-community-edit-form";
import { Community } from "@/lib/domain/communities/types";
import { groveLensUrlToHttp } from "@/lib/shared/utils";
import { Save } from "lucide-react";

interface CommunityEditFormProps {
  community: Community;
}

export function CommunityEditForm({ community }: CommunityEditFormProps) {
  const { formData, loading, handleChange, handleSubmit } = useCommunityEditForm(community);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Community Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base font-medium text-foreground">
          Community Name
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter community name..."
          required
        />
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
        />
      </div>

      {/* Logo Upload */}
      <ImageUploadInput
        id="logo-upload"
        label="Community Logo"
        currentImageUrl={community.logo ? groveLensUrlToHttp(community.logo) : undefined}
        currentImageAlt={community.name}
        onFileChange={file => handleChange({ target: { name: "logo", value: file } })}
        recommended="PNG, JPG up to 5MB. Recommended: 200x200px"
        disabled={loading}
      />

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="rounded-full bg-gradient-to-r from-green-500 to-green-600 px-8 py-3 font-semibold text-white hover:from-green-600 hover:to-green-700"
        >
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update Community
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
