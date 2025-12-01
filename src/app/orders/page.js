"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FiPlus } from "react-icons/fi";

// Ceiling API imports
import { addCeilingImage, getCeilingList } from "@/services/admincontrol";

export default function CabStylesPage() {
  const params = useSearchParams();
  const selectedType = params.get("page") || "ceiling";

  const [cabStyles, setCabStyles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [itemName, setItemName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Finishes
  const [finishCategory, setFinishCategory] = useState("plastic");

  // Handrail extra images
  const [selectedThumb, setSelectedThumb] = useState(null);
  const [selectedThumbPreview, setSelectedThumbPreview] = useState(null);

  // LOAD DATA
  useEffect(() => {
    loadData();
  }, [selectedType, finishCategory]);

  const loadData = async () => {
    try {
      // CEILING
      if (selectedType === "ceiling") {
        const res = await getCeilingList();
        setCabStyles(
          res?.data?.map((item) => ({
            id: item._id,
            url: item.image,
            name: item.name,
          }))
        );
        return;
      }

      // FINISHES
      if (selectedType === "finishes") {
        const res = await fetch("http://mobileappindia.com:5001/api/v1/user/finishes")
          .then((r) => r.json());

        const list = res?.data?.[finishCategory] || [];

        setCabStyles(
          list.map((item) => ({
            id: item._id,
            url: item.image,
            name: item.name,
          }))
        );

        return;
      }

      // HANDRAIL
      if (selectedType === "handrail") {
        const res = await fetch("http://mobileappindia.com:5001/api/v1/user/handrail")
          .then((r) => r.json());

        setCabStyles(
          res?.data?.map((item) => ({
            id: item._id,
            url: item.thumbimage, // small image
            fullUrl: item.handimage, // main image
            name: item.name,
          }))
        );
        return;
      }

    } catch (error) {
      console.log("Error loading data:", error);
    }
  };

  // OPEN MODAL
  const openUploadModal = () => {
    setSelectedImage(null);
    setSelectedPreview(null);
    setItemName("");
    setSelectedThumb(null);
    setSelectedThumbPreview(null);
    setOpenModal(true);
  };

  // UPLOAD HANDLER
  const handleImageUpload = async () => {
    if (!itemName.trim()) return alert("Enter a name");

    try {
      setUploading(true);

      // ---- CEILING ----
      if (selectedType === "ceiling") {
        if (!selectedImage) return alert("Choose an image");

        const fd = new FormData();
        fd.append("image", selectedImage);
        fd.append("name", itemName);
        fd.append("type", "ceiling");

        await fetch("http://mobileappindia.com:5001/api/v1/user/add-ceiling", {
          method: "POST",
          body: fd,
        });
      }

      // ---- FINISHES ----
      if (selectedType === "finishes") {
        if (!selectedImage) return alert("Choose an image");

        const fd = new FormData();
        fd.append("image", selectedImage);
        fd.append("name", itemName);
        fd.append("type", finishCategory);

        await fetch("http://mobileappindia.com:5001/api/v1/user/add-finishes", {
          method: "POST",
          body: fd,
        });
      }

      // ---- HANDRAIL ----
      if (selectedType === "handrail") {
        if (!selectedImage) return alert("Choose MAIN image");
        if (!selectedThumb) return alert("Choose THUMBNAIL image");

        const fd = new FormData();
        fd.append("handimage", selectedImage);
        fd.append("thumbimage", selectedThumb);
        fd.append("name", itemName);
        fd.append("type", "handrail");

        await fetch("http://mobileappindia.com:5001/api/v1/user/add-handrail", {
          method: "POST",
          body: fd,
        });
      }

      await loadData();
      setOpenModal(false);

    } catch (error) {
      console.log(error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">

      {/* HEADER */}
      <div className="relative rounded-2xl bg-gradient-to-r from-cyan-800 to-blue-800 text-white shadow-lg p-6">
        <h1 className="text-3xl font-bold">
          {selectedType === "ceiling" && "Ceiling Management"}
          {selectedType === "finishes" && "Finishes Management"}
          {selectedType === "handrail" && "Handrail Management"}
        </h1>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">

        {/* FINISHES CATEGORY */}
        {selectedType === "finishes" && (
          <div className="mb-6">
            <select
              className="border p-2 rounded-lg"
              value={finishCategory}
              onChange={(e) => setFinishCategory(e.target.value)}
            >
              <option value="plastic">Plastic</option>
              <option value="marble">Marble</option>
              <option value="steel">Steel</option>
            </select>
          </div>
        )}

        {/* HEADER WITH BUTTON */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {selectedType === "ceiling" && "Ceiling Images"}
            {selectedType === "finishes" && `${finishCategory} Finishes`}
            {selectedType === "handrail" && "Handrail Images"}
          </h2>

          <button
            onClick={openUploadModal}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow flex items-center gap-2"
          >
            <FiPlus /> Add
          </button>
        </div>

        {/* GRID */}
        {selectedType === "handrail" ? (
          /* ---- HANDRAIL GALLERY LAYOUT ---- */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {cabStyles.map((style) => (
              <div
                key={style.id}
                className="border rounded-xl p-3 shadow-sm bg-white cursor-pointer"
                onClick={() =>
                  setFullscreenImage({
                    main: style.fullUrl,
                    thumb: style.url,
                    name: style.name,
                  })
                }
              >

                <div className="flex flex-col gap-3">
                  {/* MAIN IMAGE */}
                  <div className="w-full h-36 rounded-lg overflow-hidden bg-gray-100">
                    <img src={style.fullUrl} className="w-full h-full object-cover" />
                  </div>

                  {/* THUMBNAIL */}
                  <div className="flex justify-center">
                    <img
                      src={style.url}
                      className="w-20 h-16 object-cover rounded-md shadow border"
                    />
                  </div>
                </div>

                <div className="mt-3 text-center text-slate-700 text-sm font-medium">
                  {style.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ---- ORIGINAL GRID (CEILING & FINISHES) ---- */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {cabStyles.map((style) => (
              <div key={style.id} className="border rounded-xl p-3 shadow-sm bg-white">
                <img
                  src={style.url}
                  className="w-full h-40 object-cover rounded-lg cursor-pointer"
                  onClick={() =>
                    setFullscreenImage(style.fullUrl || style.url)
                  }
                />
                <div className="mt-2 text-center text-slate-700 text-sm">
                  {style.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Add New</h2>

            <input
              className="border p-2 w-full rounded-lg mb-4"
              placeholder="Enter name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />

            {/* MAIN IMAGE UPLOAD */}
            <label className="w-full h-60 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer">
              {selectedPreview ? (
                <img src={selectedPreview} className="w-full h-full object-contain" />
              ) : (
                <span>Click to upload image</span>
              )}

              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setSelectedImage(file);
                  setSelectedPreview(URL.createObjectURL(file));
                }}
              />
            </label>

            {/* THUMBNAIL ONLY FOR HANDRAIL */}
            {selectedType === "handrail" && (
              <label className="w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer mt-4">
                {selectedThumbPreview ? (
                  <img
                    src={selectedThumbPreview}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span>Click to upload Thumbnail</span>
                )}

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setSelectedThumb(file);
                    setSelectedThumbPreview(URL.createObjectURL(file));
                  }}
                />
              </label>
            )}

            <div className="flex justify-end mt-6 gap-3">
              <button onClick={() => setOpenModal(false)} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>

              <button
                onClick={handleImageUpload}
                className="px-4 py-2 bg-cyan-700 text-white rounded-lg"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN VIEWER */}
    {fullscreenImage && (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-[9999]"
    onClick={() => setFullscreenImage(null)}
  >
    <div
      className="bg-white/10 p-6 rounded-xl backdrop-blur-md text-white max-w-3xl w-full flex flex-col items-center gap-6"
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking content
    >
      {/* NAME */}
      <h2 className="text-2xl font-semibold">{fullscreenImage.name}</h2>

      {/* HANDRAIL IMAGE */}
      <div className="text-lg mb-1">Handrail Image</div>
      <img
        src={fullscreenImage.main}
        className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-lg"
      />

      {/* THUMBNAIL IMAGE */}
      <div className="text-lg mt-4 mb-1">Thumbnail Image</div>
      <img
        src={fullscreenImage.thumb}
        className="w-40 h-40 object-contain rounded-lg shadow-md bg-white"
      />
    </div>
  </div>
)}

    </div>
  );
}
