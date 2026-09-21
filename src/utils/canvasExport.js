// src/utils/canvasExport.js

export const FILTERS = [
  {
    id: 'none',
    name: 'None',
    cssFilter: 'none',
    canvasFilter: 'none',
    previewGradient: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
  },
  {
    id: 'bw',
    name: 'B&W',
    cssFilter: 'grayscale(100%) contrast(110%)',
    canvasFilter: 'grayscale(100%) contrast(110%)',
    previewGradient: 'linear-gradient(135deg, #475569 0%, #0f172a 100%)',
  },
  {
    id: 'sepia',
    name: 'Sepia',
    cssFilter: 'sepia(85%) contrast(105%) brightness(95%)',
    canvasFilter: 'sepia(85%) contrast(105%) brightness(95%)',
    previewGradient: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)',
  },
  {
    id: 'analog',
    name: 'Analog',
    cssFilter: 'contrast(115%) brightness(105%) saturate(85%) sepia(25%)',
    canvasFilter: 'contrast(115%) brightness(105%) saturate(85%) sepia(25%)',
    previewGradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
  },
  {
    id: 'neon',
    name: 'Neon',
    cssFilter: 'contrast(135%) saturate(170%) brightness(105%)',
    canvasFilter: 'contrast(135%) saturate(170%) brightness(105%)',
    previewGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  },
  {
    id: 'warm',
    name: 'Warm',
    cssFilter: 'sepia(35%) saturate(135%) brightness(105%)',
    canvasFilter: 'sepia(35%) saturate(135%) brightness(105%)',
    previewGradient: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
  },
  {
    id: 'cool',
    name: 'Cool',
    cssFilter: 'hue-rotate(185deg) contrast(110%) saturate(120%)',
    canvasFilter: 'hue-rotate(185deg) contrast(110%) saturate(120%)',
    previewGradient: 'linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    cssFilter: 'brightness(95%) contrast(120%) saturate(80%) sepia(40%)',
    canvasFilter: 'brightness(95%) contrast(120%) saturate(80%) sepia(40%)',
    previewGradient: 'linear-gradient(135deg, #a1a1aa 0%, #52525b 100%)',
  },
];

// Helper to load HTMLImageElement asynchronously
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      return reject(new Error('Image source is empty'));
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

/**
 * Render complete Photostrip Canvas with Frame, Photos, Filter, and Stickers
 * Returns high-resolution Data URL (PNG or JPEG)
 */
export async function renderPhotostripCanvas({
  photos = [],
  filterId = 'none',
  stickers = [],
  format = 'image/png',
  quality = 0.95
}) {
  const canvasWidth = 1200;
  const canvasHeight = 1760; // 3:4.4 ratio, standard aesthetic photostrip

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context could not be created');
  }

  // 1. Draw Outer Frame Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Outer Border Line for sleek photo booth edge
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, canvasWidth - 16, canvasHeight - 16);

  // 2. Photo Grid Coordinates (2 columns x 3 rows)
  const paddingX = 80;
  const paddingTop = 90;
  const gapX = 40;
  const gapY = 36;
  const cols = 2;
  const rows = 3;

  const slotWidth = (canvasWidth - (paddingX * 2) - gapX) / cols; // ~500px
  const slotHeight = 440; // ~440px each

  const activeFilter = FILTERS.find((f) => f.id === filterId) || FILTERS[0];

  // Draw 6 Photos
  for (let i = 0; i < 6; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const x = paddingX + col * (slotWidth + gapX);
    const y = paddingTop + row * (slotHeight + gapY);

    const photoSrc = photos[i];

    if (photoSrc) {
      try {
        const img = await loadImage(photoSrc);

        ctx.save();
        // Rounded corner clip for each photo slot
        const cornerRadius = 14;
        ctx.beginPath();
        ctx.moveTo(x + cornerRadius, y);
        ctx.lineTo(x + slotWidth - cornerRadius, y);
        ctx.quadraticCurveTo(x + slotWidth, y, x + slotWidth, y + cornerRadius);
        ctx.lineTo(x + slotWidth, y + slotHeight - cornerRadius);
        ctx.quadraticCurveTo(x + slotWidth, y + slotHeight, x + slotWidth - cornerRadius, y + slotHeight);
        ctx.lineTo(x + cornerRadius, y + slotHeight);
        ctx.quadraticCurveTo(x, y + slotHeight, x, y + slotHeight - cornerRadius);
        ctx.lineTo(x, y + cornerRadius);
        ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
        ctx.closePath();
        ctx.clip();

        // Apply visual filter
        if (activeFilter.canvasFilter && activeFilter.canvasFilter !== 'none') {
          ctx.filter = activeFilter.canvasFilter;
        }

        // Object-cover calculation to avoid stretching
        const imgRatio = img.width / img.height;
        const slotRatio = slotWidth / slotHeight;
        let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;

        if (imgRatio > slotRatio) {
          sWidth = img.height * slotRatio;
          sx = (img.width - sWidth) / 2;
        } else {
          sHeight = img.width / slotRatio;
          sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, slotWidth, slotHeight);
        ctx.restore();

        // Slot subtle border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 2;
        ctx.stroke();
      } catch (err) {
        console.warn(`Failed to render photo slot ${i}:`, err);
        drawSlotPlaceholder(ctx, x, y, slotWidth, slotHeight, i + 1);
      }
    } else {
      drawSlotPlaceholder(ctx, x, y, slotWidth, slotHeight, i + 1);
    }
  }

  // 3. Draw Bottom Frame Watermark / Branding
  ctx.save();
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★ ONLINE PHOTOBOOTH ★', canvasWidth / 2, canvasHeight - 45);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px Arial, sans-serif';
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  ctx.fillText(today, canvasWidth / 2, canvasHeight - 20);
  ctx.restore();

  // 4. Draw Stickers on top of the Frame
  for (const sticker of stickers) {
    try {
      const stickerImg = await loadImage(sticker.dataUrl);

      // Percentage coordinate to canvas pixel
      const stickerPixelX = (sticker.xPercent / 100) * canvasWidth;
      const stickerPixelY = (sticker.yPercent / 100) * canvasHeight;
      const stickerPixelWidth = (sticker.sizePercent / 100) * canvasWidth;
      const stickerPixelHeight = stickerPixelWidth; // square aspect ratio default

      ctx.save();
      ctx.translate(stickerPixelX, stickerPixelY);
      if (sticker.rotation) {
        ctx.rotate((sticker.rotation * Math.PI) / 180);
      }

      ctx.drawImage(
        stickerImg,
        -stickerPixelWidth / 2,
        -stickerPixelHeight / 2,
        stickerPixelWidth,
        stickerPixelHeight
      );

      ctx.restore();
    } catch (err) {
      console.warn('Failed to render sticker:', sticker.id, err);
    }
  }

  return canvas.toDataURL(format, quality);
}

function drawSlotPlaceholder(ctx, x, y, width, height, slotNumber) {
  ctx.save();
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Slot ${slotNumber}`, x + width / 2, y + height / 2);
  ctx.restore();
}

/**
 * Trigger browser file download from Data URL
 */
export function downloadDataUrl(dataUrl, filename = 'photobooth-strip.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Save rendered photostrip to localStorage gallery
 */
export function saveToLocalGallery(imageDataUrl, title = 'Photostrip') {
  try {
    const existingStr = localStorage.getItem('photobooth_gallery');
    const existing = existingStr ? JSON.parse(existingStr) : [];

    const newPhoto = {
      id: Date.now(),
      title: `${title} #${existing.length + 1}`,
      date: new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
      imageUrl: imageDataUrl,
    };

    const updated = [newPhoto, ...existing];
    localStorage.setItem('photobooth_gallery', JSON.stringify(updated));
    return newPhoto;
  } catch (err) {
    console.error('Failed to save to local gallery:', err);
    throw err;
  }
}
