import { useState, useEffect, useRef, useCallback } from "react";

interface MediaItem {
  id: string;
  mediaId: string;
  type: string;
  url: string | null;
  filename: string | null;
  coverImage: string | null;
  order: number;
  width: number | null;
  height: number | null;
  size: number | null;
  caption: string | null;
  title?: string | null;
}

export interface PortfolioGalleryProps {
  mediaItems: MediaItem[];
  title?: string;
  talentName: string;
  onImagesLoaded?: () => void;
}

// Default cover image for videos without one
const DEFAULT_VIDEO_COVER = "/images/default-video-cover.svg";

export function PortfolioGallery({
  mediaItems,
  title,
  talentName,
  onImagesLoaded,
}: PortfolioGalleryProps) {
  // Refs for image dimensions
  const imageRefs = useRef<Record<string, HTMLImageElement | null>>({});

  // Track which images have been processed for orientation
  const [processedImages, setProcessedImages] = useState<Set<string>>(
    new Set(),
  );

  // Track image orientations
  const [imageOrientations, setImageOrientations] = useState<Record<string, "portrait" | "landscape">>(
    {},
  );

  // State to track which videos are currently playing
  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>(
    {},
  );

  // Track loaded images for parent notification
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const totalImages = mediaItems.filter(
    (item) => item.type.toLowerCase() === "image",
  ).length;

  // Function to determine image orientation - fixed to prevent infinite loops
  const checkImageOrientation = useCallback(
    (imageId: string) => {
      const img = imageRefs.current[imageId];
      if (!img || processedImages.has(imageId)) return;

      // Only process if the image is loaded
      if (img.complete) {
        const isPortrait = img.naturalHeight > img.naturalWidth;

        setImageOrientations((prev) => ({
          ...prev,
          [imageId]: isPortrait ? "portrait" : "landscape",
        }));

        setProcessedImages((prev) => {
          const newSet = new Set(prev);
          newSet.add(imageId);
          return newSet;
        });
      }
    },
    [processedImages],
  );

  // Handle image load event
  const handleImageLoad = (mediaId: string, imageId: string) => {
    checkImageOrientation(imageId);

    setLoadedImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(mediaId);
      return newSet;
    });
  };

  // Check if all images are loaded
  useEffect(() => {
    if (totalImages === 0 || loadedImages.size === totalImages) {
      onImagesLoaded?.();
    }
  }, [loadedImages, totalImages, onImagesLoaded]);

  // Check image orientations when refs change
  useEffect(() => {
    Object.entries(imageRefs.current).forEach(([id, img]) => {
      if (img && !processedImages.has(id)) {
        checkImageOrientation(id);
      }
    });
  }, [checkImageOrientation, processedImages]);

  // Sort media items by order
  const sortedMediaItems = [...mediaItems].sort((a, b) => a.order - b.order);

  // Separate portrait and landscape images while preserving order
  const portraitImages = sortedMediaItems.filter(
    (item) =>
      item.type.toLowerCase() === "image" &&
      imageOrientations[item.id] === "portrait",
  );

  const landscapeImages = sortedMediaItems.filter(
    (item) =>
      item.type.toLowerCase() === "image" &&
      imageOrientations[item.id] === "landscape",
  );

  // If no images have been processed yet, show all in a single column
  const unprocessedImages = sortedMediaItems.filter(
    (item) =>
      item.type.toLowerCase() === "image" && !processedImages.has(item.id),
  );

  // Videos are always treated as landscape
  const videos = sortedMediaItems.filter(
    (item) => item.type.toLowerCase() === "video",
  );

  // Create gallery layout
  // We'll create a more structured layout approach
  const createGalleryLayout = () => {
    const allItems = [...sortedMediaItems];
    const rows: Array<Array<{ item: MediaItem; isPortrait: boolean }>> = [];

    // Process items in order
    while (allItems.length > 0) {
      const item = allItems.shift();
      if (!item) continue;

      const itemType = item.type.toLowerCase();

      // Handle videos (always in their own row)
      if (itemType === "video") {
        rows.push([{ item, isPortrait: false }]);
        continue;
      }

      // Handle images
      if (itemType === "image") {
        const orientation = imageOrientations[item.id];

        // Landscape images get their own row
        if (orientation === "landscape") {
          rows.push([{ item, isPortrait: false }]);
          continue;
        }

        // Portrait images can be paired
        if (orientation === "portrait") {
          // Check if we can pair with another portrait image
          const nextItem = allItems[0];
          if (
            nextItem &&
            nextItem.type.toLowerCase() === "image" &&
            imageOrientations[nextItem.id] === "portrait"
          ) {
            // Pair two portrait images
            rows.push([
              { item, isPortrait: true },
              { item: allItems.shift()!, isPortrait: true },
            ]);
          } else {
            // Single portrait image
            rows.push([{ item, isPortrait: true }]);
          }
          continue;
        }

        // Unprocessed images (orientation not determined yet)
        // Put them in their own row for now
        rows.push([{ item, isPortrait: false }]);
      }
    }

    return rows;
  };

  const galleryRows = createGalleryLayout();

  // Render media item based on type
  const renderMediaItem = (item: MediaItem, isPortrait: boolean) => {
    if (item.type.toLowerCase() === "image" && item.url) {
      return (
        <img
          ref={(el) => {
            imageRefs.current[item.id] = el;
          }}
          src={item.url}
          alt={item.caption || `${talentName} portfolio image`}
          className={`w-full h-full object-cover`}
          data-media-id={item.mediaId}
          onLoad={() => handleImageLoad(item.mediaId, item.id)}
          onError={() => handleImageLoad(item.mediaId, item.id)}
        />
      );
    } else if (item.type.toLowerCase() === "video" && item.url) {
      const isPlaying = playingVideos[item.id] || false;

      return (
        <div className="relative w-full h-full">
          {isPlaying ? (
            <video
              src={item.url}
              controls
              autoPlay
              className="w-full h-full object-cover"
              onPause={() =>
                setPlayingVideos((prev) => ({ ...prev, [item.id]: false }))
              }
            />
          ) : (
            <div
              className="w-full h-full cursor-pointer relative"
              onClick={() =>
                setPlayingVideos((prev) => ({ ...prev, [item.id]: true }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setPlayingVideos((prev) => ({ ...prev, [item.id]: true }));
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Play video"
            >
              <img
                src={item.coverImage || DEFAULT_VIDEO_COVER}
                alt={item.caption || `${talentName} video thumbnail`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mb-8">
      {title && <h3 className="text-md font-medium mb-4">{title}</h3>}

      <div className="space-y-6">
        {galleryRows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`grid ${row.length > 1 ? "grid-cols-2 gap-4" : "grid-cols-1"}`}
          >
            {row.map(({ item, isPortrait }) => (
              <div
                key={item.id}
                className={`overflow-hidden bg-gray-100 ${isPortrait ? "aspect-[3/4]" : "aspect-[4/3]"}`}
              >
                {item.url || item.coverImage ? (
                  renderMediaItem(item, isPortrait)
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-xs">
                      No media available
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
