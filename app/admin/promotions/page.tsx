"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Promotion {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt?: any;
}

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [form, setForm] = useState<Omit<Promotion, "id">>({ title: "", description: "", imageUrl: "" });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPromos();
  }, []);

  async function fetchPromos() {
    setLoading(true);
    const snap = await getDocs(collection(db, "promotions"));
    setPromos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion)));
    setLoading(false);
  }

  async function handleImageUpload(file: File) {
    const storageRef = ref(storage, `promotions/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.imageUrl || "";
      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage);
      }
      if (editingId) {
        await updateDoc(doc(db, "promotions", editingId), {
          ...form,
          imageUrl,
        });
        toast.success("Promotion updated!");
      } else {
        await addDoc(collection(db, "promotions"), {
          ...form,
          imageUrl,
          createdAt: Timestamp.now(),
        });
        toast.success("Promotion added!");
      }
      setForm({ title: "", description: "", imageUrl: "" });
      setSelectedImage(null);
      setEditingId(null);
      fetchPromos();
    } catch (err) {
      toast.error("Error saving promotion");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(p: Promotion) {
    setForm({ title: p.title, description: p.description, imageUrl: p.imageUrl });
    setEditingId(p.id!);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this promotion?")) return;
    await deleteDoc(doc(db, "promotions", id));
    toast.success("Promotion deleted");
    fetchPromos();
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-4">Manage Promotions</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <Input type="file" accept="image/*" onChange={e => setSelectedImage(e.target.files?.[0] || null)} />
            {form.imageUrl && !selectedImage && (
              <img src={form.imageUrl} alt="Current" className="w-24 h-16 rounded-lg mt-2 object-cover" />
            )}
            {selectedImage && (
              <div className="mt-2 text-sm text-gray-600">Selected: {selectedImage.name}</div>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>{editingId ? "Update" : "Add"} Promotion</Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={() => { setForm({ title: "", description: "", imageUrl: "" }); setEditingId(null); setSelectedImage(null); }}>Cancel</Button>
            )}
          </div>
        </form>
        <h2 className="text-xl font-semibold mb-2">All Promotions</h2>
        {loading ? <div>Loading...</div> : (
          <div className="space-y-4">
            {promos.map(p => (
              <div key={p.id} className="flex items-center bg-gray-50 rounded-lg p-4 border border-gray-100">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="w-20 h-14 rounded-lg object-cover mr-4" />
                ) : (
                  <div className="w-20 h-14 rounded-lg bg-gray-200 mr-4" />
                )}
                <div className="flex-1">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-gray-500 text-sm mb-1">{p.description}</div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id!)}>Delete</Button>
                </div>
              </div>
            ))}
            {promos.length === 0 && <div className="text-gray-400">No promotions yet.</div>}
          </div>
        )}
      </div>
    </div>
  );
} 