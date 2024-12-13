export async function compressImage(file: File, maxSizeMB = 1): Promise<File> {
  // If file is already smaller than maxSizeMB, return it as is
  if (file.size / 1024 / 1024 < maxSizeMB) {
    return file;
  }

  // Create canvas
  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Load image
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

  // Calculate new dimensions
  let { width, height } = img;
  const maxDimension = 1920; // Max dimension for compressed image

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }
  }

  // Set canvas dimensions
  canvas.width = width;
  canvas.height = height;

  // Draw image on canvas
  ctx.drawImage(img, 0, 0, width, height);

  // Convert to blob with quality adjustment
  const blob = await new Promise<Blob>((resolve) => {
    let quality = 0.7; // Initial quality
    const tryCompress = () => {
      canvas.toBlob(
        (result) => {
          if (result) {
            if (result.size / 1024 / 1024 > maxSizeMB && quality > 0.1) {
              // If still too large and quality can be reduced, try again
              quality -= 0.1;
              tryCompress();
            } else {
              resolve(result);
            }
          } else {
            resolve(new Blob([file], { type: file.type }));
          }
        },
        file.type,
        quality
      );
    };
    tryCompress();
  });

  // Create new file
  return new File([blob], file.name, {
    type: file.type,
    lastModified: file.lastModified,
  });
}

export async function compressImages(files: File[]): Promise<File[]> {
  return Promise.all(files.map((file) => compressImage(file)));
}
