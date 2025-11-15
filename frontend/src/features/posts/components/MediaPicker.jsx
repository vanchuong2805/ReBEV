// MediaPicker.jsx - Component cho ảnh và video
import React from "react";
import { EmptyAdd, Thumb, AddSquare, AddRow, VideoThumb } from "./atoms";

const MAX_IMAGES = 8;
const MAX_VIDEOS = 1;

export default function MediaPicker({
  imagePreviews,
  videoPreviews,
  coverImageIndex,
  onCoverImageChange,
  fileInputRef,
  videoInputRef,
  onImageChange,
  onVideoChange,
  onRemoveImage,
  onRemoveVideo,
}) {
  return (
    <div className="mb-6 space-y-3 md:mb-0 md:col-span-1">
      <div className="mb-3 text-xs text-gray-500">
        Tối đa <b>{MAX_IMAGES} ảnh</b> (≤10MB/ảnh), <b>{MAX_VIDEOS} video</b>{" "}
        (≤30MB).
      </div>

      {/* Images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onImageChange}
        accept="image/*"
        className="hidden"
        multiple
      />
      <div
        className="w-full overflow-hidden border-2 border-dashed rounded-lg aspect-video bg-gray-50"
        onClick={() => fileInputRef.current?.click()}
      >
        {imagePreviews.length > 0 ? (
          <img
            src={imagePreviews[coverImageIndex] || imagePreviews[0]}
            alt="Ảnh chính"
            className="object-cover w-full h-full"
          />
        ) : (
          <EmptyAdd label="Thêm ảnh" />
        )}
      </div>

      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {imagePreviews.map((preview, index) => (
            <Thumb
              key={index}
              src={preview}
              isCover={index === coverImageIndex}
              onClick={() => onCoverImageChange(index)}
              onRemove={() => onRemoveImage(index)}
            />
          ))}
          {imagePreviews.length < MAX_IMAGES && (
            <AddSquare onClick={() => fileInputRef.current?.click()} />
          )}
        </div>
      )}

      {/* Video */}
      <input
        type="file"
        ref={videoInputRef}
        onChange={onVideoChange}
        accept="video/*"
        className="hidden"
      />
      <div className="mt-3">
        <div className="mb-2 text-sm font-medium text-gray-700 ">
          Video (tuỳ chọn)
        </div>
        {videoPreviews.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {videoPreviews.map((src, i) => (
              <VideoThumb key={i} src={src} onRemove={() => onRemoveVideo(i)} />
            ))}
          </div>
        )}
        {videoPreviews.length < MAX_VIDEOS && (
          <AddRow
            onClick={() => videoInputRef.current?.click()}
            label="Thêm video"
          />
        )}
      </div>
    </div>
  );
}
