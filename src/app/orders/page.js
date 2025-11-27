"use client";

import { useState } from "react";
import { FiFileText, FiTrash2, FiEdit, FiPlus } from "react-icons/fi";
import { addCeilingImage } from "@/services/admincontrol";

export default function CabStylesPage() {
  const [cabStyles, setCabStyles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [editMode, setEditMode] = useState(null); 
  const [uploading, setUploading] = useState(false);

  const openUploadModal = () => {
    setSelectedImage(null);
    setSelectedPreview(null);
    setEditMode(null);
    setOpenModal(true);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image");
      return;
    }

    try {
      setUploading(true);

      // Call backend
      const res = await addCeilingImage(selectedImage);
      console.log("Ceiling upload response:", res);

      // Try to get URL from response, else use preview
      const imageUrlFromApi =
        res?.data?.imageUrl || res?.imageUrl || selectedPreview;

      const newCab = {
        id: editMode ? editMode : Date.now(),
        url: imageUrlFromApi,
      };

      if (editMode) {
        setCabStyles((prev) =>
          prev.map((c) => (c.id === editMode ? newCab : c))
        );
      } else {
        setCabStyles((prev) => [newCab, ...prev]);
      }

      setOpenModal(false);
    } catch (err) {
      console.error("Upload ceiling failed:", err);
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this ceiling image?")) return;
    // local-only delete for now
    setCabStyles((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEdit = (style) => {
    // local-only edit
    setEditMode(style.id);
    setSelectedPreview(style.url);
    setOpenModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-800 via-sky-700 to-blue-800 text-white shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,#ffffff33_0,transparent_50%)]" />

        <div className="relative px-6 py-8 md:px-10 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">
              G&R Custom Elevator Cabs
            </p>
            <h1 className="text-3xl font-bold mt-1">Add Ceiling</h1>
            <p className="mt-2 text-sm md:text-base text-cyan-100 max-w-xl">
              Upload and manage ceiling designs used in your elevator cabs.
            </p>
          </div>

          <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <FiFileText className="h-6 w-6 text-cyan-100" />
          </div>
        </div>
      </div>

      {/* LIST CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Ceiling Images
          </h2>

          <button
            onClick={openUploadModal}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg shadow-md transition flex items-center gap-2"
          >
            <FiPlus /> Add Ceiling
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {cabStyles.map((style) => (
            <div
              key={style.id}
              className="border rounded-xl p-3 shadow-sm bg-white hover:shadow-md transition"
            >
              <img
                src={style.url}
                className="w-full h-40 object-cover rounded-lg"
              />

              <div className="mt-3 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">
                  Ceiling Design
                </span>

                <div className="flex items-center gap-3">
                  <button onClick={() => handleEdit(style)}>
                    <FiEdit className="text-blue-600 hover:text-blue-800" />
                  </button>

                  <button onClick={() => handleDelete(style.id)}>
                    <FiTrash2 className="text-red-600 hover:text-red-800" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cabStyles.length === 0 && (
          <p className="text-center py-10 text-slate-500">
            No ceiling styles uploaded yet.
          </p>
        )}
      </div>

      {/* UPLOAD MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              {editMode ? "Edit Ceiling Image" : "Upload Ceiling Image"}
            </h2>

            {/* IMAGE UPLOAD */}
            <label
              className="w-full h-40 border-2 border-dashed border-cyan-400 rounded-xl flex flex-col 
              items-center justify-center cursor-pointer hover:bg-cyan-50 transition"
            >
              {selectedPreview ? (
                <img
                  src={selectedPreview}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <span className="text-slate-600">Click to upload</span>
                  <span className="text-xs text-slate-400">(JPG / PNG)</span>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setSelectedImage(file);
                  setSelectedPreview(URL.createObjectURL(file));
                }}
              />
            </label>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
                disabled={uploading}
              >
                Cancel
              </button>

              <button
                onClick={handleImageUpload}
                className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg shadow disabled:opacity-60"
                disabled={uploading}
              >
                {uploading
                  ? "Uploading..."
                  : editMode
                  ? "Save Changes"
                  : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
