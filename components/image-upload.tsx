import { useCallback, useState } from 'react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onClick: () => void;
}

export function ImageUpload({ onImageUpload, onClick }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  }, [onImageUpload]);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer ${
        dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onClick}
    >
      <input
        type="file"
        id="image-upload"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
      <p className="text-gray-500 mb-4">
        Click or drag and drop your image here
      </p>
    </div>
  );
}