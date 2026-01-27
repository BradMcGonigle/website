"use client";

import { Camera, Check, ImageIcon, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface PreviewData {
  url: string;
  title: string;
  description: string;
  ogImage: string | null;
  images: string[];
}

interface SaveLinkFormProps {
  initialUrl?: string | undefined;
  apiKey?: string | undefined;
}

export function SaveLinkForm({ initialUrl, apiKey }: SaveLinkFormProps) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl || "");
  const [storedApiKey] = useState(() => {
    // Try to get API key from props, sessionStorage, or prompt
    if (apiKey) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("links-api-key", apiKey);
      }
      return apiKey;
    }
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("links-api-key") || "";
    }
    return "";
  });
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [screenshotData, setScreenshotData] = useState<string | null>(null);

  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isLoadingScreenshot, setIsLoadingScreenshot] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchPreview = useCallback(async (targetUrl: string) => {
    setIsLoadingPreview(true);
    setError(null);
    setPreview(null);
    setSelectedImage(null);
    setScreenshotData(null);

    try {
      const response = await fetch(
        `/api/links/preview?url=${encodeURIComponent(targetUrl)}`
      );
      const data = (await response.json()) as PreviewData | { error: string };

      if (!response.ok) {
        throw new Error(
          "error" in data ? data.error : "Failed to fetch preview"
        );
      }

      const previewData = data as PreviewData;
      setPreview(previewData);
      setTitle(previewData.title);
      setDescription(previewData.description);

      // Auto-select OG image if available
      if (previewData.ogImage) {
        setSelectedImage(previewData.ogImage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch preview");
    } finally {
      setIsLoadingPreview(false);
    }
  }, []);

  // Auto-fetch preview if URL is provided
  useEffect(() => {
    if (initialUrl) {
      void fetchPreview(initialUrl);
    }
  }, [initialUrl, fetchPreview]);

  const handleFetchPreview = () => {
    if (url) {
      void fetchPreview(url);
    }
  };

  const handleTakeScreenshot = async () => {
    if (!url) return;

    setIsLoadingScreenshot(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/links/screenshot?url=${encodeURIComponent(url)}`
      );
      const data = (await response.json()) as
        | { success: boolean; screenshot: string }
        | { error: string };

      if (!response.ok) {
        throw new Error(
          "error" in data ? data.error : "Failed to take screenshot"
        );
      }

      if ("screenshot" in data) {
        setScreenshotData(data.screenshot);
        setSelectedImage(data.screenshot);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to take screenshot"
      );
    } finally {
      setIsLoadingScreenshot(false);
    }
  };

  const handleSave = async () => {
    if (!url || !title) {
      setError("URL and title are required");
      return;
    }

    if (!storedApiKey) {
      setError("API key is required. Add ?key=YOUR_KEY to the URL.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          title,
          description,
          image: selectedImage,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          apiKey: storedApiKey,
        }),
      });

      const data = (await response.json()) as
        | { success: boolean }
        | { error: string };

      if (!response.ok) {
        throw new Error("error" in data ? data.error : "Failed to save link");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/links");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save link");
    } finally {
      setIsSaving(false);
    }
  };

  const allImages = [
    ...(screenshotData ? [screenshotData] : []),
    ...(preview?.ogImage ? [preview.ogImage] : []),
    ...(preview?.images || []),
  ];

  // Deduplicate images
  const uniqueImages = [...new Set(allImages)];

  return (
    <div className="mt-8 space-y-8">
      {/* URL Input */}
      <div className="space-y-2">
        <label htmlFor="url" className="block text-sm font-medium">
          URL
        </label>
        <div className="flex gap-2">
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={handleFetchPreview}
            disabled={!url || isLoadingPreview}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoadingPreview ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Fetch"
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          <Check className="mr-2 inline h-4 w-4" />
          Link saved successfully! Redirecting...
        </div>
      )}

      {/* Preview Content */}
      {preview && (
        <>
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="tags" className="block text-sm font-medium">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="development, tools, design"
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Image Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Select Image</label>
              <button
                type="button"
                onClick={handleTakeScreenshot}
                disabled={isLoadingScreenshot}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
              >
                {isLoadingScreenshot ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                Screenshot Page
              </button>
            </div>

            {uniqueImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {/* No Image Option */}
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className={`relative aspect-[2/1] overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === null
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <X className="h-6 w-6" />
                    <span className="text-xs">No Image</span>
                  </div>
                  {selectedImage === null && (
                    <div className="absolute right-2 top-2 rounded-full bg-primary p-1">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </button>

                {uniqueImages.map((img, index) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-[2/1] overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === img
                        ? "border-primary"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Option ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Hide broken images
                        e.currentTarget.parentElement!.style.display = "none";
                      }}
                    />
                    {selectedImage === img && (
                      <div className="absolute right-2 top-2 rounded-full bg-primary p-1">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    {img === preview.ogImage && (
                      <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                        OG
                      </span>
                    )}
                    {img === screenshotData && (
                      <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                        Screenshot
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex aspect-[3/1] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground">
                <ImageIcon className="h-8 w-8" />
                <p className="mt-2 text-sm">No images found on page</p>
                <button
                  type="button"
                  onClick={handleTakeScreenshot}
                  disabled={isLoadingScreenshot}
                  className="mt-2 text-sm text-primary hover:underline disabled:opacity-50"
                >
                  Take a screenshot instead
                </button>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !title}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Link"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
