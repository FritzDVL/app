"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityEditForm } from "@/hooks/forms/use-community-edit-form";
import { Community } from "@/lib/domain/communities/types";
import { groveLensUrlToHttp } from "@/lib/shared/utils";
import { Save, Upload, X } from "lucide-react";

interface CommunityEditFormProps {
  community: Community;
}

export function CommunityEditForm({ community }: CommunityEditFormProps) {
  const { formData, previewUrl, loading, handleChange, handleImageChange, clearImage, handleSubmit } =
    useCommunityEditForm(community);

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
          className="rounded-2xl bg-white p-3 text-base backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:bg-gray-700"
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
          className="min-h-[100px] w-full rounded-2xl bg-white p-3 text-base backdrop-blur-sm focus:ring-2 focus:ring-primary/20 dark:bg-gray-700"
        />
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="text-base font-medium text-foreground">Community Logo</Label>

        {/* Current Logo Display */}
        <div className="flex items-center space-x-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Logo preview"
                width={80}
                height={80}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : community.logo ? (
              <Image
                src={groveLensUrlToHttp(community.logo)}
                alt={community.name}
                width={80}
                height={80}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-2xl text-white">
                {community.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="relative overflow-hidden"
                onClick={() => document.getElementById("logo-upload")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {formData.logo || community.logo ? "Change Logo" : "Upload Logo"}
              </Button>

              {(formData.logo || previewUrl) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearImage}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB. Recommended: 200x200px</p>
          </div>

          <input id="logo-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>
      </div>

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
