"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Testimonial {
  id?: string;
  name: string;
  text: string;
  role?: string;
  imageUrl?: string;
  createdAt?: any;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<Omit<Testimonial, "id">>({ name: "", text: "", role: "", imageUrl: "" });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    const snap = await getDocs(collection(db, "testimonials"));
    setTestimonials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
    setLoading(false);
  }

  async function handleImageUpload(file: File) {
    const storageRef = ref(storage, `testimonials/${Date.now()}_${file.name}`);
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
        await updateDoc(doc(db, "testimonials", editingId), {
          ...form,
          imageUrl,
        });
        toast.success("Testimonial updated!");
      } else {
        await addDoc(collection(db, "testimonials"), {
          ...form,
          imageUrl,
          createdAt: Timestamp.now(),
        });
        toast.success("Testimonial added!");
      }
      setForm({ name: "", text: "", role: "", imageUrl: "" });
      setSelectedImage(null);
      setEditingId(null);
      fetchTestimonials();
    } catch (err) {
      toast.error("Error saving testimonial");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(t: Testimonial) {
    setForm({ name: t.name, text: t.text, role: t.role || "", imageUrl: t.imageUrl || "" });
    setEditingId(t.id!);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await deleteDoc(doc(db, "testimonials", id));
    toast.success("Testimonial deleted");
    fetchTestimonials();
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-4">Manage Testimonials</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role/Title</label>
            <Input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Customer" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Testimonial</label>
            <Textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} required rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image (optional)</label>
            <Input type="file" accept="image/*" onChange={e => setSelectedImage(e.target.files?.[0] || null)} />
            {form.imageUrl && !selectedImage && (
              <img src={form.imageUrl} alt="Current" className="w-16 h-16 rounded-full mt-2" />
            )}
            {selectedImage && (
              <div className="mt-2 text-sm text-gray-600">Selected: {selectedImage.name}</div>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>{editingId ? "Update" : "Add"} Testimonial</Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={() => { setForm({ name: "", text: "", role: "", imageUrl: "" }); setEditingId(null); setSelectedImage(null); }}>Cancel</Button>
            )}
          </div>
        </form>
        <h2 className="text-xl font-semibold mb-2">All Testimonials</h2>
        {loading ? <div>Loading...</div> : (
          <div className="space-y-4">
            {testimonials.map(t => (
              <div key={t.id} className="flex items-center bg-gray-50 rounded-lg p-4 border border-gray-100">
                {t.imageUrl ? (
                  <img src={t.imageUrl} alt={t.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4" />
                )}
                <div className="flex-1">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                  <div className="text-gray-700 mt-1">{t.text}</div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(t)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id!)}>Delete</Button>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && <div className="text-gray-400">No testimonials yet.</div>}
          </div>
        )}
      </div>
    </div>
  );
} 