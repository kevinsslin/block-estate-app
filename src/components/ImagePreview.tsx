import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ImagePreviewProps {
  images: File[];
  onRemove: (index: number) => void;
}

export function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (!images.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {Array.from(images).map((image, index) => (
        <div key={index} className="group relative">
          <div className="relative aspect-square">
            <Image
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
              fill
              className="rounded object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
          <p className="mt-1 truncate text-sm text-gray-500">{image.name}</p>
        </div>
      ))}
    </div>
  );
}
