// src/utils/livePhotoExport.js
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { FILTERS } from '@/utils/canvasExport';

// Candidate AVC / H.264 codecs in order of preference.
// Level 4.2 (0x2a) supports max 2,228,224 macroblock area (fits 1200x1760 = 2,112,000 pixels).
// Level 5.0 (0x32) & Level 5.1 (0x33) support up to 5.6M - 9.4M pixels (4K).
const CANDIDATE_CODECS = [
  'avc1.64002a', // High Profile Level 4.2 (same profile as sample live foto.mp4)
  'avc1.640033', // High Profile Level 5.1
  'avc1.4d0033', // Main Profile Level 5.1
  'avc1.420033', // Baseline Profile Level 5.1
  'avc1.420032', // Baseline Profile Level 5.0
  'avc1.42002a', // Baseline Profile Level 4.2
  'avc1.640028', // High Profile Level 4.0 (for <= 2M pixels)
  'avc1.4d0028', // Main Profile Level 4.0
  'avc1.420028', // Baseline Profile Level 4.0
];

// Helper to query WebCodecs for a supported resolution + codec combo
async function getBestEncoderConfig(requestedWidth, requestedHeight, fps, bitrate) {
  if (
    typeof window === 'undefined' ||
    typeof window.VideoEncoder === 'undefined' ||
    typeof window.VideoEncoder.isConfigSupported !== 'function'
  ) {
    return null;
  }

  // Check resolutions: full resolution first (1200x1760), then 1080p (1080x1584), then 720p
  const resolutions = [
    { width: requestedWidth, height: requestedHeight },
    { width: 1080, height: Math.round(1080 * (requestedHeight / requestedWidth)) },
    { width: 720, height: Math.round(720 * (requestedHeight / requestedWidth)) },
  ];

  for (const res of resolutions) {
    // Width and height for AVC / H.264 must be even integers
    const w = res.width % 2 === 0 ? res.width : res.width - 1;
    const h = res.height % 2 === 0 ? res.height : res.height - 1;

    for (const codec of CANDIDATE_CODECS) {
      try {
        const testConfig = {
          codec,
          width: w,
          height: h,
          bitrate,
          framerate: fps,
        };

        const support = await VideoEncoder.isConfigSupported(testConfig);
        if (support && support.supported) {
          return {
            config: support.config || testConfig,
            width: w,
            height: h,
          };
        }
      } catch (err) {
        // Try next candidate
      }
    }
  }

  return null;
}

// Helper to load image
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) return reject(new Error('Image source is empty'));
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

// Helper to create & initialize a video element from Blob or URL
function createVideoElement(src) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.autoplay = false;
    video.loop = true;

    const onReady = () => {
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('canplay', onReady);
      resolve(video);
    };

    video.addEventListener('loadeddata', onReady);
    video.addEventListener('canplay', onReady);

    video.onerror = () => {
      console.warn('Failed to load video element:', src);
      resolve(null);
    };

    // Fallback timeout in case video fails to fire events
    setTimeout(() => resolve(video), 2000);

    video.src = typeof src === 'string' ? src : URL.createObjectURL(src);
    video.load();
  });
}

// Draw object-cover image or video into slot
function drawMediaCover(ctx, media, x, y, slotWidth, slotHeight) {
  const mediaWidth = media.videoWidth || media.naturalWidth || media.width || slotWidth;
  const mediaHeight = media.videoHeight || media.naturalHeight || media.height || slotHeight;

  const mediaRatio = mediaWidth / mediaHeight;
  const slotRatio = slotWidth / slotHeight;
  let sx = 0, sy = 0, sWidth = mediaWidth, sHeight = mediaHeight;

  if (mediaRatio > slotRatio) {
    sWidth = mediaHeight * slotRatio;
    sx = (mediaWidth - sWidth) / 2;
  } else {
    sHeight = mediaWidth / slotRatio;
    sy = (mediaHeight - sHeight) / 2;
  }

  ctx.drawImage(media, sx, sy, sWidth, sHeight, x, y, slotWidth, slotHeight);
}

// Draw photostrip frame layout (background, photo slots, branding, stickers)
function renderPhotostripFrame({
  ctx,
  canvasWidth,
  canvasHeight,
  slotMedias, // array of { type: 'video'|'image', el }
  activeFilter,
  stickers,
  stickerImages,
  frameIdx = 0,
}) {
  // Proportional scale factor relative to base 1200x1760
  const scale = canvasWidth / 1200;

  // 1. White Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Outer Border Line
  const borderWidth = Math.max(8, Math.round(16 * scale));
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(borderWidth / 2, borderWidth / 2, canvasWidth - borderWidth, canvasHeight - borderWidth);

  // 2. Photo Grid (2 columns x 3 rows)
  const paddingX = Math.round(80 * scale);
  const paddingTop = Math.round(90 * scale);
  const gapX = Math.round(40 * scale);
  const gapY = Math.round(36 * scale);
  const cols = 2;
  const rows = 3;
  const slotWidth = (canvasWidth - paddingX * 2 - gapX) / cols;
  const slotHeight = Math.round(440 * scale);
  const cornerRadius = Math.max(6, Math.round(14 * scale));

  for (let i = 0; i < 6; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = paddingX + col * (slotWidth + gapX);
    const y = paddingTop + row * (slotHeight + gapY);

    const media = slotMedias[i];

    ctx.save();
    // Rounded corner clip
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

    // Filter
    if (activeFilter.canvasFilter && activeFilter.canvasFilter !== 'none') {
      ctx.filter = activeFilter.canvasFilter;
    }

    if (media && media.el) {
      // If animated photo fallback (subtle ken burns zoom if it's static image)
      if (media.type === 'image') {
        const zoom = 1 + 0.04 * Math.sin((frameIdx / 75) * Math.PI * 2);
        ctx.translate(x + slotWidth / 2, y + slotHeight / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-(x + slotWidth / 2), -(y + slotHeight / 2));
      }
      drawMediaCover(ctx, media.el, x, y, slotWidth, slotHeight);
    } else {
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(x, y, slotWidth, slotHeight);
    }

    ctx.restore();

    // Slot subtle border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = Math.max(1, Math.round(2 * scale));
    ctx.strokeRect(x, y, slotWidth, slotHeight);
  }

  // 3. Bottom Branding Watermark
  ctx.save();
  ctx.fillStyle = '#64748b';
  ctx.font = `bold ${Math.round(22 * scale)}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('★ LIVE PHOTOBOOTH ★', canvasWidth / 2, canvasHeight - Math.round(45 * scale));

  ctx.fillStyle = '#94a3b8';
  ctx.font = `${Math.round(16 * scale)}px Arial, sans-serif`;
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  ctx.fillText(today, canvasWidth / 2, canvasHeight - Math.round(20 * scale));
  ctx.restore();

  // 4. Stickers
  stickers.forEach((sticker, sIdx) => {
    const stickerImg = stickerImages[sIdx];
    if (!stickerImg) return;

    const stickerPixelX = (sticker.xPercent / 100) * canvasWidth;
    const stickerPixelY = (sticker.yPercent / 100) * canvasHeight;
    const stickerPixelWidth = (sticker.sizePercent / 100) * canvasWidth;
    const stickerPixelHeight = stickerPixelWidth;

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
  });
}

/**
 * Main export function for MP4 Live Photo
 * @param {Object} params
 * @param {Array<string>} params.photos - 6 photos
 * @param {string} params.filterId - selected filter ID
 * @param {Array<Object>} params.stickers - placed stickers
 * @param {Array<Blob|null>} [params.liveClips] - 6 recorded video clips
 * @param {Function} [params.onProgress] - progress callback (0-100)
 * @returns {Promise<Blob>} - MP4 video blob
 */
export async function exportLivePhotoMP4({
  photos = [],
  filterId = 'none',
  stickers = [],
  liveClips = [],
  onProgress = () => {},
}) {
  const baseWidth = 1200;
  const baseHeight = 1760;
  const totalFrames = 75; // 3 seconds at 25 fps
  const fps = 25;
  const targetBitrate = 4_500_000;

  onProgress(5, 'Preparing assets...');

  const activeFilter = FILTERS.find((f) => f.id === filterId) || FILTERS[0];

  // Load stickers
  const stickerImages = await Promise.all(
    stickers.map((s) => loadImage(s.dataUrl).catch(() => null))
  );

  onProgress(15, 'Loading video clips...');

  // Setup media elements for each of the 6 slots
  const slotMedias = [];
  for (let i = 0; i < 6; i++) {
    const clip = liveClips && liveClips[i];
    if (clip && clip instanceof Blob) {
      const videoEl = await createVideoElement(clip);
      slotMedias.push({ type: 'video', el: videoEl });
    } else {
      // Check if photo is available
      const photoSrc = photos[i];
      if (photoSrc) {
        try {
          const imgEl = await loadImage(photoSrc);
          slotMedias.push({ type: 'image', el: imgEl });
        } catch (e) {
          slotMedias.push({ type: 'placeholder', el: null });
        }
      } else {
        slotMedias.push({ type: 'placeholder', el: null });
      }
    }
  }

  // Check if at least one slot has video, or try to load demo live photo if completely empty
  const hasAnyVideo = slotMedias.some((m) => m.type === 'video' && m.el);
  if (!hasAnyVideo) {
    try {
      const demoRes = await fetch('/demo-live-photo.mp4');
      if (demoRes.ok) {
        const demoBlob = await demoRes.blob();
        for (let i = 0; i < 6; i++) {
          if (slotMedias[i].type !== 'video') {
            const demoVideo = await createVideoElement(demoBlob);
            slotMedias[i] = { type: 'video', el: demoVideo };
          }
        }
      }
    } catch (err) {
      console.warn('Demo live video not loaded, using animated still frames:', err);
    }
  }

  onProgress(25, 'Configuring video encoder...');

  // Query WebCodecs VideoEncoder support for Level 4.2 / 5.1 / 4.0
  const encoderSetup = await getBestEncoderConfig(baseWidth, baseHeight, fps, targetBitrate);

  if (encoderSetup) {
    try {
      const canvasWidth = encoderSetup.width;
      const canvasHeight = encoderSetup.height;

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      const muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: {
          codec: 'avc',
          width: canvasWidth,
          height: canvasHeight,
        },
        fastStart: 'in-memory',
      });

      const encoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: (err) => console.error('VideoEncoder error:', err),
      });

      encoder.configure(encoderSetup.config);

      // Render frames
      for (let frameIdx = 0; frameIdx < totalFrames; frameIdx++) {
        const timeSec = frameIdx / fps;

        // Seek video elements to current frame time
        await Promise.all(
          slotMedias.map((m) => {
            if (m.type === 'video' && m.el) {
              return new Promise((res) => {
                const vid = m.el;
                const targetTime = timeSec % (vid.duration || 3);
                if (Math.abs(vid.currentTime - targetTime) < 0.02) {
                  return res();
                }
                const onSeek = () => {
                  vid.removeEventListener('seeked', onSeek);
                  res();
                };
                vid.addEventListener('seeked', onSeek);
                vid.currentTime = targetTime;
                setTimeout(res, 40);
              });
            }
            return Promise.resolve();
          })
        );

        // Render frame to canvas
        renderPhotostripFrame({
          ctx,
          canvasWidth,
          canvasHeight,
          slotMedias,
          activeFilter,
          stickers,
          stickerImages,
          frameIdx,
        });

        // Encode frame
        const videoFrame = new VideoFrame(canvas, {
          timestamp: Math.round(frameIdx * (1_000_000 / fps)), // in microseconds
        });
        encoder.encode(videoFrame, { keyFrame: frameIdx % fps === 0 });
        videoFrame.close();

        // Progress update
        const percent = Math.round(25 + ((frameIdx + 1) / totalFrames) * 70);
        onProgress(percent, `Encoding frame ${frameIdx + 1} of ${totalFrames}...`);
      }

      await encoder.flush();
      muxer.finalize();

      onProgress(100, 'Finishing MP4 file...');
      const buffer = muxer.target.buffer;
      return new Blob([buffer], { type: 'video/mp4' });
    } catch (err) {
      console.warn('WebCodecs encoding error, falling back to MediaRecorder:', err);
    }
  }

  // Fallback: Real-time recording via MediaRecorder
  return new Promise(async (resolve, reject) => {
    try {
      const canvasWidth = baseWidth;
      const canvasHeight = baseHeight;

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      const stream = canvas.captureStream(fps);
      const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')
        ? 'video/mp4;codecs=avc1'
        : MediaRecorder.isTypeSupported('video/mp4')
        ? 'video/mp4'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: targetBitrate,
      });

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const outBlob = new Blob(chunks, { type: mimeType });
        resolve(outBlob);
      };

      // Play video elements
      slotMedias.forEach((m) => {
        if (m.type === 'video' && m.el) {
          m.el.currentTime = 0;
          m.el.play().catch(() => {});
        }
      });

      recorder.start();
      const startTime = performance.now();

      const drawLoop = (now) => {
        const elapsed = (now - startTime) / 1000;
        const frameIdx = Math.floor(elapsed * fps);

        renderPhotostripFrame({
          ctx,
          canvasWidth,
          canvasHeight,
          slotMedias,
          activeFilter,
          stickers,
          stickerImages,
          frameIdx,
        });

        const percent = Math.min(99, Math.round(25 + (elapsed / 3.0) * 70));
        onProgress(percent, `Recording live photostrip...`);

        if (elapsed < 3.0) {
          requestAnimationFrame(drawLoop);
        } else {
          recorder.stop();
          slotMedias.forEach((m) => {
            if (m.type === 'video' && m.el) m.el.pause();
          });
        }
      };

      requestAnimationFrame(drawLoop);
    } catch (recorderErr) {
      reject(recorderErr);
    }
  });
}
