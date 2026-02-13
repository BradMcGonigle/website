"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface PreviewData {
  title: string;
  description: string;
  images: string[];
  url: string;
}

interface ErrorResponse {
  error?: string;
}

interface TagSuggestionsResponse {
  tags: string[];
  existingTags: string[];
}

function NewLinkForm() {
  const searchParams = useSearchParams();
  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [suggestingTags, setSuggestingTags] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Check for existing auth on mount by making a test request
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to make an authenticated request to check if we have a valid cookie
        const response = await fetch("/api/links/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: "https://example.com" }),
          credentials: "include",
        });

        // If we don't get a 401, we're authenticated
        if (response.status !== 401) {
          setIsAuthenticated(true);
        }
      } catch {
        // Ignore errors, user is not authenticated
      } finally {
        setIsCheckingAuth(false);
      }
    };

    void checkAuth();
  }, []);

  // Check for URL in query params (from bookmarklet)
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam && isAuthenticated) {
      setUrl(urlParam);
    }
  }, [searchParams, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setAuthLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/links/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData.error ?? "Authentication failed");
      }

      setIsAuthenticated(true);
      setApiKey(""); // Clear the input for security
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/links/auth", {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      // Ignore errors
    }

    setIsAuthenticated(false);
    setPreview(null);
    setUrl("");
  };

  const fetchPreview = useCallback(async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setPreview(null);
    setSuggestedTags([]);

    try {
      const response = await fetch("/api/links/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
        credentials: "include", // Include cookies for authentication
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        throw new Error("Session expired. Please log in again.");
      }

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData.error ?? "Failed to fetch preview");
      }

      const data = (await response.json()) as PreviewData;
      setPreview(data);
      setTitle(data.title);
      setDescription(data.description);
      const firstImage = data.images[0];
      if (firstImage) {
        setSelectedImage(firstImage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch preview");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const fetchTagSuggestions = useCallback(async () => {
    if (!title.trim()) return;

    setSuggestingTags(true);
    setSuggestedTags([]);

    try {
      const response = await fetch("/api/links/suggest-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          title: title.trim(),
          description: description.trim() || undefined,
        }),
        credentials: "include",
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        throw new Error("Session expired. Please log in again.");
      }

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData.error ?? "Failed to get tag suggestions");
      }

      const data = (await response.json()) as TagSuggestionsResponse;
      setSuggestedTags(data.tags);
    } catch (err) {
      // Silently fail for tag suggestions - it's not critical
      console.error("Tag suggestion error:", err);
    } finally {
      setSuggestingTags(false);
    }
  }, [url, title, description]);

  const addSuggestedTag = (tag: string) => {
    const currentTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(", ");
      setTags(newTags);
    }
    // Remove from suggestions
    setSuggestedTags((prev) => prev.filter((t) => t !== tag));
  };

  // Auto-fetch preview when URL is set from query param
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam && isAuthenticated && url === urlParam && !preview) {
      void fetchPreview();
    }
  }, [url, isAuthenticated, preview, searchParams, fetchPreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          url: url.trim(),
          imageUrl: selectedImage ?? undefined,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
        credentials: "include", // Include cookies for authentication
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        throw new Error("Session expired. Please log in again.");
      }

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData.error ?? "Failed to save link");
      }

      setSuccess(true);
      // Reset form
      setUrl("");
      setPreview(null);
      setTitle("");
      setDescription("");
      setSelectedImage(null);
      setTags("");
      setSuggestedTags([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save link");
    } finally {
      setSaving(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
        <div>
          <label
            htmlFor="apiKey"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            placeholder="Enter your API key"
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={authLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {authLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    );
  }

  if (success) {
    return (
      <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
        <h2 className="text-lg font-medium text-green-800 dark:text-green-200">
          Link saved successfully!
        </h2>
        <p className="mt-2 text-sm text-green-700 dark:text-green-300">
          Your link has been committed to the repository. It will appear on the
          site after the next build.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Add Another Link
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex justify-end">
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input */}
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            URL
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              placeholder="https://example.com"
              required
            />
            <button
              type="button"
              onClick={() => void fetchPreview()}
              disabled={loading || !url.trim()}
              className="whitespace-nowrap rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Fetch Preview"}
            </button>
          </div>
        </div>

        {preview && (
          <>
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              />
            </div>

            {/* Image Selection */}
            {preview.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Image
                </label>
                <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className={`flex h-24 items-center justify-center rounded-md border-2 ${
                      selectedImage === null
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <span className="text-sm text-gray-500">No image</span>
                  </button>
                  {preview.images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative h-24 overflow-hidden rounded-md border-2 ${
                        selectedImage === img
                          ? "border-blue-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Option ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tags (comma-separated)
                </label>
                <button
                  type="button"
                  onClick={() => void fetchTagSuggestions()}
                  disabled={suggestingTags || !title.trim()}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {suggestingTags ? "Getting suggestions..." : "Suggest tags"}
                </button>
              </div>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                placeholder="tech, article, tutorial"
              />
              {suggestedTags.length > 0 && (
                <div className="mt-2">
                  <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                    Click to add:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addSuggestedTag(tag)}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Link"}
            </button>
          </>
        )}
      </form>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-gray-500">Loading...</div>
    </div>
  );
}

export default function NewLinkPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">Add New Link</h1>
      <Suspense fallback={<LoadingFallback />}>
        <NewLinkForm />
      </Suspense>
    </main>
  );
}
