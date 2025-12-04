"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import {
  getCeilingList,
  addCeilingImage,
  getFinishesList,
  addFinishesImage,
  getHandrailList,
  addHandrailImage,
  getCabSizeList,
  addCabSize,
  deleteItem, // this API i am deleting all cabsize,finishes,handrail,ceiling(logic one function which deletes the all the images  )
} from "@/services/admincontrol";

export default function CabStylesPage() {
  const params = useSearchParams();
  const selectedType = params.get("page") || "ceiling";

  const [cabStyles, setCabStyles] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);

  const [selectedThumb, setSelectedThumb] = useState(null);
  const [selectedThumbPreview, setSelectedThumbPreview] = useState(null);

  const [itemName, setItemName] = useState("");
  const [uploading, setUploading] = useState(false);

  const [fullscreenImage, setFullscreenImage] = useState(null);

  const [finishCategory, setFinishCategory] = useState("plastic");

  // SIZE FIELDS
  const [weight, setWeight] = useState("");
  const [dim, setDim] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");

  // POPUP + delete confirm
  const [popupMessage, setPopupMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    loadData();
  }, [selectedType, finishCategory]);

  const loadData = async () => {
    try {
      if (selectedType === "ceiling") {
        const res = await getCeilingList();
        setCabStyles(res?.data?.map(x => ({
          id: x._id,
          url: x.image,
          name: x.name
        })));
        return;
      }

      if (selectedType === "finishes") {
        const res = await getFinishesList();
        const list = res?.data?.[finishCategory] || [];
        setCabStyles(list.map(x => ({
          id: x._id,
          url: x.image,
          name: x.name
        })));
        return;
      }

      if (selectedType === "handrail") {
        const res = await getHandrailList();
        setCabStyles(res?.data?.map(x => ({
          id: x._id,
          url: x.thumbimage,
          fullUrl: x.handimage,
          name: x.name
        })));
        return;
      }

      if (selectedType === "size") {
        const res = await getCabSizeList();
        setCabStyles(res?.data?.map((x, i) => ({
          sno: i + 1,
          id: x._id,
          weight: x.weight,
          dim: x.dim,
          height: x.height,
          width: x.width
        })));
        return;
      }
    } catch (err) {
      console.error("Load error:", err);
    }
  };


  // OPEN MODAL — FIXED
  const openUploadModal = () => {
    setPopupMessage("");
    setPendingDeleteId(null);

    setSelectedImage(null);
    setSelectedPreview(null);

    setSelectedThumb(null);
    setSelectedThumbPreview(null);

    setItemName("");

    setWeight("");
    setDim("");
    setHeight("");
    setWidth("");

    setOpenModal(true);
  };


  // UPLOAD HANDLER — SAME LOGIC
  const handleUpload = async () => {
    if (selectedType !== "size" && !itemName.trim()) {
      setPopupMessage("Enter name");
      return;
    }

    try {
      setUploading(true);

      if (selectedType === "ceiling") {
        if (!selectedImage) return setPopupMessage("Choose image");
        await addCeilingImage(selectedImage, itemName);
      }

      if (selectedType === "finishes") {
        if (!selectedImage) return setPopupMessage("Choose image");
        await addFinishesImage(selectedImage, itemName, finishCategory);
      }

      if (selectedType === "handrail") {
        if (!selectedImage) return setPopupMessage("Choose main image");
        if (!selectedThumb) return setPopupMessage("Choose thumbnail");
        await addHandrailImage(selectedImage, selectedThumb, itemName);
      }

      if (selectedType === "size") {
        if (!weight || !dim || !height || !width)
          return setPopupMessage("All fields required");

        await addCabSize(weight, dim, height, width);
      }

      await loadData();
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      setPopupMessage("Upload failed");
    } finally {
      setUploading(false);
    }
  };


  // UNIVERSAL DELETE — works for all types
  const askDelete = (id) => {
    setPendingDeleteId(id);
    setPopupMessage("Do you want to delete?");
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;

    try {
      await deleteItem(pendingDeleteId);
      await loadData();
      setPopupMessage("Deleted successfully");
    } catch (err) {
      console.error("Delete err:", err);
      setPopupMessage("Delete failed");
    }

    setPendingDeleteId(null);

    setTimeout(() => setPopupMessage(""), 1500);
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

        {/* FINISHES DROPDOWN */}
        {selectedType === "finishes" && (
          <select
            className="border p-2 rounded-lg mb-6"
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
          <h2 className="text-lg font-semibold">Items</h2>

          <button
            onClick={openUploadModal}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg flex items-center gap-2"
          >
            <FiPlus /> Add
          </button>
        </div>


        {/* SIZE TABLE */}
        {selectedType === "size" ? (
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">S.No</th>
                <th className="p-2 border">Weight</th>
                <th className="p-2 border">Dim</th>
                <th className="p-2 border">Height</th>
                <th className="p-2 border">Width</th>
                <th className="p-2 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {cabStyles.map((row) => (
                <tr key={row.id}>
                  <td className="border p-2">{row.sno}</td>
                  <td className="border p-2">{row.weight}</td>
                  <td className="border p-2">{row.dim}</td>
                  <td className="border p-2">{row.height}</td>
                  <td className="border p-2">{row.width}</td>

                  <td className="border p-2 text-center">
                    <button
                      onClick={() => askDelete(row.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        ) : selectedType !== "handrail" ? (

          /* CEILING + FINISHES GRID */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {cabStyles.map(style => (
              <div key={style.id} className="relative border rounded-xl p-3 shadow-sm">

                {/* DELETE BUTTON */}
                <button
                  onClick={() => askDelete(style.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
                >
                  <FiTrash2 size={16} />
                </button>

                <img
                  src={style.url}
                  className="w-full h-40 object-cover rounded-lg cursor-pointer"
                  onClick={() => setFullscreenImage(style.url)}
                />
                <p className="text-center mt-2">{style.name}</p>
              </div>
            ))}
          </div>

        ) : (

          /* HANDRAIL GRID */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {cabStyles.map(style => (
              <div key={style.id} className="relative border rounded-xl p-3 shadow-sm">

                {/* DELETE BUTTON */}
                <button
                  onClick={() => askDelete(style.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
                >
                  <FiTrash2 size={16} />
                </button>

                <div onClick={() =>
                  setFullscreenImage({
                    main: style.fullUrl,
                    thumb: style.url,
                    name: style.name
                  })
                }>
                  <div className="h-36 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={style.fullUrl} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex justify-center mt-3">
                    <img src={style.url} className="w-20 h-16 object-cover rounded-md" />
                  </div>

                  <p className="text-center mt-3">{style.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>


      {/* - MODAL - */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white max-w-md w-full p-6 rounded-xl">

            <h2 className="text-xl font-semibold mb-4">Add New</h2>

            {selectedType !== "size" && (
              <>
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
                  ) : "Click to upload image"}

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

                {/* THUMBNAIL for handrail */}
                {selectedType === "handrail" && (
                  <label className="w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center mt-4">
                    {selectedThumbPreview ? (
                      <img src={selectedThumbPreview} className="w-full h-full object-contain" />
                    ) : "Upload Thumbnail"}

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
              </>
            )}

            {/* SIZE FIELDS */}
            {selectedType === "size" && (
              <>
                <input type="number" placeholder="Weight" className="border p-2 w-full rounded-lg mb-4"
                  value={weight} onChange={e => setWeight(e.target.value)} />

                <input type="number" placeholder="Dimension" className="border p-2 w-full rounded-lg mb-4"
                  value={dim} onChange={e => setDim(e.target.value)} />

                <input type="number" placeholder="Height" className="border p-2 w-full rounded-lg mb-4"
                  value={height} onChange={e => setHeight(e.target.value)} />

                <input type="number" placeholder="Width" className="border p-2 w-full rounded-lg mb-4"
                  value={width} onChange={e => setWidth(e.target.value)} />
              </>
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
                {uploading ? "Saving..." : "Save"}
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
          {selectedType === "handrail" ? (
            <div
              className="bg-white/10 p-6 rounded-xl backdrop-blur-md text-white max-w-3xl w-full flex flex-col items-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{fullscreenImage.name}</h2>

              <img src={fullscreenImage.main} className="max-w-full max-h-[50vh] object-contain" />
              <img src={fullscreenImage.thumb} className="w-40 h-40 object-contain bg-white rounded-md" />
            </div>
          ) : (
            <img src={fullscreenImage} className="max-w-[60%] max-h-[60%]" />
          )}
        </div>
      )}


      {/* - POPUP DELETE CONFIRM - */}
      {popupMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg z-[99999] flex items-center gap-4">

          <span>{popupMessage}</span>

          {pendingDeleteId ? (
            <>
              <button
                onClick={handleConfirmDelete}
                className="bg-white text-red-600 px-3 py-1 rounded"
              >
                Yes
              </button>

              <button
                onClick={() => { setPendingDeleteId(null); setPopupMessage(""); }}
                className="bg-gray-300 text-black px-3 py-1 rounded"
              >
                No
              </button>
            </>
          ) : (
            <button className="font-bold text-xl" onClick={() => setPopupMessage("")}>✕</button>
          )}

        </div>
      )}

    </div>
  );
}
