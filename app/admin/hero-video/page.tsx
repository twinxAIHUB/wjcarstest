"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/lib/contexts/AuthContext";
import { collection, getDocs } from "firebase/firestore";

export default function AdminHeroVideoPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const MAX_SIZE_MB = 100;

  useEffect(() => {
    const fetchVideoUrl = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "siteConfig", "hero");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVideoUrl(docSnap.data().videoUrl || "");
        }
      } catch (error) {
        toast.error("Failed to fetch hero video URL");
      } finally {
        setLoading(false);
      }
    };
    fetchVideoUrl();
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      try {
        const adminDoc = await getDoc(doc(db, "admins", user.uid));
        setIsAdmin(adminDoc.exists());
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Only video files are allowed.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error("File size must be 100MB or less.");
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setProgress(0);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `hero-section/${Date.now()}_${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(percent);
        },
        (error) => {
          toast.error("Failed to upload video");
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setVideoUrl(url);
          toast.success("Video uploaded! Click Save to update hero section.");
          setUploading(false);
        }
      );
    } catch (error) {
      toast.error("Failed to upload video");
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) {
      toast.error("You must be an admin to update the hero video.");
      return;
    }
    if (!videoUrl) {
      toast.error("Please provide a video URL or upload a video.");
      return;
    }
    setSaving(true);
    try {
      const docRef = doc(db, "siteConfig", "hero");
      await setDoc(docRef, { videoUrl }, { merge: true });
      toast.success("Hero video URL updated!");
    } catch (error) {
      toast.error("Failed to update hero video URL");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Hero Section Video</h1>
        <p className="text-gray-500 mb-6">Update the video shown in the hero section of your homepage. You can upload a new video or paste a direct video URL.</p>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium mb-2 text-gray-700">
              Video URL
            </label>
            <Input
              id="videoUrl"
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://..."
              required={!selectedFile}
              disabled={loading || saving || uploading}
            />
            <p className="text-xs text-gray-400 mt-1">Paste a direct link to a video file (e.g., .mp4, .webm).</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Or Upload Video</label>
            <Input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={uploading || saving || loading}
            />
            <p className="text-xs text-gray-400 mt-1">Max size: 100MB. Only video files are allowed.</p>
            {selectedFile && !uploading && (
              <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                <span className="font-medium">Selected:</span> {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                <Button type="button" size="sm" variant="outline" onClick={() => setSelectedFile(null)} className="ml-2">Remove</Button>
                <Button type="button" size="sm" onClick={handleUpload} disabled={uploading} className="ml-2">Upload</Button>
              </div>
            )}
            {uploading && (
              <div className="text-sm text-gray-500 mt-2">
                Uploading... {progress}%
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving || loading || uploading} className="w-full">
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
        {videoUrl && (
          <div className="mt-8">
            <label className="block text-sm font-medium mb-2 text-gray-700">Current Video Preview</label>
            <video src={videoUrl} controls className="w-full rounded-lg border border-gray-200 shadow-sm" />
          </div>
        )}
      </div>
    </div>
  );
} 