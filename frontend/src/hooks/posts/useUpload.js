export const useUpload = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_URL.split("@")[1];

  async function upload(file) {
    const isVideo = file.type.startsWith("video/");
    const endpoint = isVideo ? "video" : "image";

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "rebev_preset"); // preset Unsigned của bạn

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${endpoint}/upload`,
      { method: "POST", body: fd }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || "Upload thất bại");

    return {
      type: endpoint,
      url: `${endpoint} ${data.secure_url}`, // "image https://..." | "video https://..."
      public_id: data.public_id,
    };
  }

  return { upload };
};
