"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FiPlus } from "react-icons/fi";

// Import ALL API functions
import {
  getCeilingList,
  addCeilingImage,
  getFinishesList,
  addFinishesImage,
  getHandrailList,
  addHandrailImage,
  getCabSizeList,
  addCabSize,
  deleteCabSize
} from "@/services/admincontrol";

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

  // Finishes category
  const [finishCategory, setFinishCategory] = useState("plastic");

  // Handrail thumbnail
  const [selectedThumb, setSelectedThumb] = useState(null);
  const [selectedThumbPreview, setSelectedThumbPreview] = useState(null);

  //  Size fields
  const [weight, setWeight] = useState("");
  const [dim, setDim] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");

  // ----------------------------------------------------
  // LOAD DATA BASED ON TAB
  // ----------------------------------------------------
  useEffect(() => {
    loadData();
  }, [selectedType, finishCategory]);

  const loadData = async () => {
    try { 
      //  CEILING
      if (selectedType === "ceiling") {
        const res = await getCeilingList();
        setCabStyles(
          res?.data?.map((x) => ({
            id: x._id,
            url: x.image,
            name: x.name,
          }))
        );
        return;
      }

      //  FINISHES
      if (selectedType === "finishes") {
        const res = await getFinishesList();
        const list = res?.data?.[finishCategory] || [];

        setCabStyles(
          list.map((x) => ({
            id: x._id,
            url: x.image,
            name: x.name,
          }))
        );
        return;
      }

      //  HANDRAIL
      if (selectedType === "handrail") {
        const res = await getHandrailList();

        setCabStyles(
          res?.data?.map((x) => ({
            id: x._id,
            url: x.thumbimage,
            fullUrl: x.handimage,
            name: x.name,
          }))
        );
        return;
      }

      //  SIZE MANAGEMENT
      if (selectedType === "size") {
        const res = await getCabSizeList();
        setCabStyles(
          res?.data?.map((x, index) => ({
            sno: index + 1,
            id: x._id,
            weight: x.weight,
            dim: x.dim,
            height: x.height,
            width: x.width,
          }))
        );
        return;
      }
    } catch (err) {
      console.error("Error loading:", err);
    }
  };

  
  // OPEN MODAL
  
  const openUploadModal = () => {
    setSelectedImage(null);
    setSelectedPreview(null);
    setSelectedThumb(null);
    setSelectedThumbPreview(null);
    setItemName("");

    // Reset size fields
    setWeight("");
    setDim("");
    setHeight("");
    setWidth("");

    setOpenModal(true);
  };

 
  // UPLOAD HANDLER
  
  const handleUpload = async () => {
    if (selectedType !== "size" && !itemName.trim()) {
      return alert("Enter a name");
    }

    try {
      setUploading(true);

      //  CEILING
      if (selectedType === "ceiling") {
        if (!selectedImage) return alert("Choose an image");
        await addCeilingImage(selectedImage, itemName);
      }

      //  FINISHES
      if (selectedType === "finishes") {
        if (!selectedImage) return alert("Choose an image");
        await addFinishesImage(selectedImage, itemName, finishCategory);
      }

      //  HANDRAIL
      if (selectedType === "handrail") {
        if (!selectedImage) return alert("Choose MAIN image");
        if (!selectedThumb) return alert("Choose THUMBNAIL");
        await addHandrailImage(selectedImage, selectedThumb, itemName);
      }

      //  SIZE MANAGEMENT
      if (selectedType === "size") {
        if (!weight || !dim || !height || !width)
          return alert("All fields required");

        await addCabSize(weight, dim, height, width);
      }

      await loadData();
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };
  
  //handle delete 
    const handleDeleteSize = async (id) => {
  if (!confirm("Are you sure you want to delete this size?")) return;

  try {
    await deleteCabSize(id);   // call API
    await loadData();          // refresh table
  } catch (err) {
    console.error(err);
    alert("Delete failed");
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
          {selectedType === "size" && "Size Management"}
        </h1>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">

        {/* FINISHES SELECTOR */}
        {selectedType === "finishes" && (
          <select
            className="border p-2 mb-6 rounded-lg"
            value={finishCategory}
            onChange={(e) => setFinishCategory(e.target.value)}
          >
            <option value="plastic">Plastic</option>
            <option value="marble">Marble</option>
            <option value="steel">Steel</option>
          </select>
        )}

        {/* HEADER + ADD BUTTON */}
        <div className="flex justify-between mb-6">
          <h2 className="text-lg font-semibold">
            {selectedType === "ceiling" && "Ceiling Images"}
            {selectedType === "finishes" &&
              `${finishCategory.charAt(0).toUpperCase() + finishCategory.slice(1)} Finishes`}
            {selectedType === "handrail" && "Handrail Images"}
            {selectedType === "size" && "Cab Size Table"}
          </h2>

          <button
            onClick={openUploadModal}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg flex items-center gap-2"
          >
            <FiPlus /> Add
          </button>
        </div>

        {/* SIZE TABLE VIEW */}
        {selectedType === "size" ? (
          <table className="w-full text-left border">
           <thead>
  <tr className="bg-gray-100">
    <th className="p-3 border">S.No</th>
    <th className="p-3 border">Weight</th>
    <th className="p-3 border">Dim</th>
    <th className="p-3 border">Height</th>
    <th className="p-3 border">Width</th>
    <th className="p-3 border text-center">Action</th>   
  </tr>
</thead>

            <tbody>
            {cabStyles.map((row) => (
  <tr key={row.id} className="border">
    <td className="p-3 border">{row.sno}</td>
    <td className="p-3 border">{row.weight}</td>
    <td className="p-3 border">{row.dim}</td>
    <td className="p-3 border">{row.height}</td>
    <td className="p-3 border">{row.width}</td>

    {/* DELETE BUTTON */}
    <td className="p-3 border text-center">
      <button
        onClick={() => handleDeleteSize(row.id)}
        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Delete
      </button>
    </td>
  </tr>
))}
            </tbody>
          </table>
        ) : 

        /* NORMAL IMAGES (CEILING + FINISHES) */
        selectedType !== "handrail" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {cabStyles.map((style) => (
              <div key={style.id} className="border rounded-xl p-3 shadow-sm bg-white">
                <img
                  src={style.url}
                  className="w-full h-40 object-cover rounded-lg cursor-pointer"
                  onClick={() => setFullscreenImage(style.fullUrl || style.url)}
                />
                <p className="text-center mt-2 text-sm">{style.name}</p>
              </div>
            ))}
          </div>
        ) : (

          /* HANDRAIL DOUBLE IMAGE VIEW */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {cabStyles.map((style) => (
              <div
                key={style.id}
                className="border rounded-xl p-3 shadow-sm"
                onClick={() =>
                  setFullscreenImage({
                    main: style.fullUrl,
                    thumb: style.url,
                    name: style.name,
                  })
                }
              >
                <div className="h-36 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={style.fullUrl} className="w-full h-full object-cover" />
                </div>

                <div className="flex justify-center mt-3">
                  <img
                    src={style.url}
                    className="w-20 h-16 object-cover rounded-md shadow"
                  />
                </div>

                <p className="text-center mt-3 text-sm">{style.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL SECTION */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          {/* SIZE MODAL */}
          {selectedType === "size" ? (
            <div className="bg-white max-w-md w-full p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Add Size</h2>

              <input
                type="number"
                placeholder="Weight"
                className="border p-2 w-full rounded-lg mb-4"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />

              <input
                type="number"
                placeholder="Dimension"
                className="border p-2 w-full rounded-lg mb-4"
                value={dim}
                onChange={(e) => setDim(e.target.value)}
              />

              <input
                type="number"
                placeholder="Height"
                className="border p-2 w-full rounded-lg mb-4"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />

              <input
                type="number"
                placeholder="Width"
                className="border p-2 w-full rounded-lg mb-4"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-cyan-700 text-white rounded-lg"
                >
                  {uploading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (

            /* IMAGE MODAL FOR CEILING + FINISHES + HANDRAIL */
            <div className="bg-white max-w-md w-full p-6 rounded-xl">

              <h2 className="text-xl font-semibold mb-4">Add New</h2>

              {/* NAME FIELD */}
              <input
                className="border p-2 w-full rounded-lg mb-4"
                placeholder="Enter name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />

              {/* MAIN IMAGE */}
              <label className="w-full h-60 border-2 border-dashed rounded-lg flex items-center justify-center">
                {selectedPreview ? (
                  <img src={selectedPreview} className="w-full h-full object-contain" />
                ) : (
                  "Click to upload image"
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

              {/* HANDRAIL THUMB (ONLY IN HANDRAIL) */}
              {selectedType === "handrail" && (
                <label className="w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center mt-4">
                  {selectedThumbPreview ? (
                    <img
                      src={selectedThumbPreview}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    "Click to upload Thumbnail"
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
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-cyan-700 text-white rounded-lg"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FULLSCREEN VIEWER */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-[9999]"
          onClick={() => setFullscreenImage(null)}
        >
          {selectedType === "handrail" ? (
            <div
              className="bg-white/10 p-6 rounded-xl backdrop-blur-md text-white max-w-3xl w-full flex flex-col items-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold">{fullscreenImage.name}</h2>

              <div className="text-lg">Handrail Image</div>
              <img
                src={fullscreenImage.main}
                className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-lg"
              />

              <div className="text-lg mt-4">Thumbnail Image</div>
              <img
                src={fullscreenImage.thumb}
                className="w-40 h-40 object-contain rounded-lg shadow-md bg-white"
              />
            </div>
          ) : (
            <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
              <img src={fullscreenImage} className="max-w-[60%] max-h-[60%]" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
