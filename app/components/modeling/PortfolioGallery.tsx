import { useState, useEffect, useRef, useCallback } from "react";

import { Link } from "react-router";

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
  isNonDefaultPortfolio?: boolean;
  handleBackToDefaultPortfolio?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  currentBoardSlug?: string;
}

// Default cover image for videos without one
const DEFAULT_VIDEO_COVER = "/images/default-video-cover.svg";

export function PortfolioGallery({
  mediaItems,
  title,
  talentName,
  onImagesLoaded,
  isNonDefaultPortfolio = false,
  handleBackToDefaultPortfolio,
  currentBoardSlug,
}: PortfolioGalleryProps) {
  // Refs for image dimensions
  const imageRefs = useRef<Record<string, HTMLImageElement | null>>({});
  // Ref for video metadata
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Track which images have been processed for orientation
  const [processedImages, setProcessedImages] = useState<Set<string>>(
    new Set(),
  );

  // Track which videos have been processed for orientation
  const [processedVideos, setProcessedVideos] = useState<Set<string>>(
    new Set(),
  );

  // Track image orientations
  const [imageOrientations, setImageOrientations] = useState<Record<string, "portrait" | "landscape">>(
    {},
  );

  // Track video orientations
  const [videoOrientations, setVideoOrientations] = useState<Record<string, "portrait" | "landscape">>(
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

  // Ref for the top back link
  const topBackLinkRef = useRef<HTMLDivElement>(null);
  // State to track if bottom link should be visible
  const [showBottomLink, setShowBottomLink] = useState(false);

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

  // Function to determine video orientation from metadata or dimensions
  const checkVideoOrientation = useCallback(
    (videoId: string, item: MediaItem) => {
      if (processedVideos.has(videoId)) return;

      // If we have width and height metadata, use that
      if (item.width && item.height) {
        const isPortrait = item.height > item.width;

        setVideoOrientations((prev) => ({
          ...prev,
          [videoId]: isPortrait ? "portrait" : "landscape",
        }));

        setProcessedVideos((prev) => {
          const newSet = new Set(prev);
          newSet.add(videoId);
          return newSet;
        });
      }
      // Otherwise, we'll try to determine from the cover image or default to landscape
      else {
        // Default to landscape if we can't determine
        const orientation = "landscape";

        // If there's a cover image, we can try to load it to determine orientation
        if (item.coverImage) {
          const img = new Image();
          img.onload = () => {
            const isPortrait = img.naturalHeight > img.naturalWidth;

            setVideoOrientations((prev) => ({
              ...prev,
              [videoId]: isPortrait ? "portrait" : "landscape",
            }));

            setProcessedVideos((prev) => {
              const newSet = new Set(prev);
              newSet.add(videoId);
              return newSet;
            });
          };
          img.src = item.coverImage;
        } else {
          // If no cover image, default to landscape
          setVideoOrientations((prev) => ({
            ...prev,
            [videoId]: "landscape",
          }));

          setProcessedVideos((prev) => {
            const newSet = new Set(prev);
            newSet.add(videoId);
            return newSet;
          });
        }
      }
    },
    [processedVideos],
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

  // Process video orientations on component mount
  useEffect(() => {
    // Process all videos to determine orientation
    mediaItems.forEach((item) => {
      if (item.type.toLowerCase() === "video") {
        checkVideoOrientation(item.id, item);
      }
    });
  }, [mediaItems, checkVideoOrientation]);

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

      // Handle videos based on their orientation
      if (itemType === "video") {
        const orientation = videoOrientations[item.id] || "landscape";
        const isPortrait = orientation === "portrait";

        // Videos get their own row
        rows.push([{ item, isPortrait }]);
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
              ref={(el) => {
                videoRefs.current[item.id] = el;
              }}
              src={item.url}
              controls
              autoPlay
              className={`w-full h-full ${isPortrait ? "object-contain" : "object-cover"}`}
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
                className={`w-full h-full ${isPortrait ? "object-contain" : "object-cover"}`}
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

  // Check if top link is visible
  useEffect(() => {
    if (!isNonDefaultPortfolio || !handleBackToDefaultPortfolio) return;

    const checkVisibility = () => {
      if (!topBackLinkRef.current) return;

      const rect = topBackLinkRef.current.getBoundingClientRect();
      // Show bottom link if top link is out of viewport
      setShowBottomLink(rect.bottom <= 0);
    };

    // Initial check
    checkVisibility();

    // Add scroll listener
    window.addEventListener('scroll', checkVisibility);

    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, [isNonDefaultPortfolio, handleBackToDefaultPortfolio]);

  // Back to Main Portfolio link component
  const BackToMainPortfolioLink = () => (
    <button
      onClick={handleBackToDefaultPortfolio}
      className="text-xs uppercase tracking-wider text-gray-500 hover:text-black transition-colors flex items-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to Main Portfolio
    </button>
  );

  return (
    <div className="mb-8">
      {title && <h3 className="text-md font-medium mb-4">{title}</h3>}

      {/* Top Back to Main Portfolio link */}
      {isNonDefaultPortfolio && handleBackToDefaultPortfolio && (
        <div className="mb-4" ref={topBackLinkRef}>
          <BackToMainPortfolioLink />
        </div>
      )}

      <div className="space-y-6">
        {galleryRows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`grid ${row.length > 1 ? "lg:grid-cols-2" : "lg:grid-cols-1"} md:grid-cols-1 sm:grid-cols-1 gap-4`}
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

      {/* Bottom Back to Main Portfolio link - only shown when top link is not visible */}
      {isNonDefaultPortfolio && handleBackToDefaultPortfolio && showBottomLink && (
        <div className="mt-6">
          <BackToMainPortfolioLink />
        </div>
      )}
    </div>
  );
}
