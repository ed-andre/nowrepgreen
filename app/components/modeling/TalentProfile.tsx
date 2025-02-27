import { useState, useEffect, useRef } from "react";

import { Link } from "react-router";

import { PortfolioGallery, TalentBio } from "~/components/modeling";

// Define the media item type
type MediaItem = {
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
};

interface TalentProfileProps {
  talent: any;
  board: any;
  boardPortfolio: any;
  boardPortfolioMedia: MediaItem[];
  currentBoardSlug: string;
  handleNavigation: (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => void;
  onImagesLoaded?: () => void;
  showBioAndHero?: boolean;
  portfolioTitle?: string;
}

export function TalentProfile({
  talent,
  board,
  boardPortfolio,
  boardPortfolioMedia,
  currentBoardSlug,
  handleNavigation,
  onImagesLoaded,
  showBioAndHero = true,
  portfolioTitle,
}: TalentProfileProps) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  const imageRefs = useRef<Set<HTMLImageElement>>(new Set());
  const processedImages = useRef<Set<HTMLImageElement>>(new Set());

  // Get the talent's full name for use in the gallery
  const talentFullName = `${talent.firstName} ${talent.lastName}`;

  // Handle when all images are loaded
  useEffect(() => {
    if (imagesLoaded && onImagesLoaded) {
      onImagesLoaded();
    }
  }, [imagesLoaded, onImagesLoaded]);

  // Check if all tracked images are loaded
  const checkAllImagesLoaded = () => {
    if (imageRefs.current.size === 0) {
      setImagesLoaded(true);
      return;
    }

    const allLoaded = Array.from(imageRefs.current).every(
      (img) => img.complete,
    );

    if (allLoaded) {
      setImagesLoaded(true);
    }
  };

  // Handle image load event
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;

    if (!processedImages.current.has(img)) {
      processedImages.current.add(img);
      checkAllImagesLoaded();
    }
  };

  // Handle hero image load
  const handleHeroImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    handleImageLoad(e);
    setHeroImageLoaded(true);
  };

  // Register an image to be tracked
  const registerImage = (img: HTMLImageElement | null) => {
    if (img && !imageRefs.current.has(img)) {
      imageRefs.current.add(img);

      // Check if the image is already loaded
      if (img.complete) {
        processedImages.current.add(img);
        checkAllImagesLoaded();
      }
    }
  };

  return (
    <div className="flex-1 py-4 md:py-6 md:pl-12">
      {/* Hero image and bio side by side - only shown for default portfolio */}
      {showBioAndHero && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Hero image with enhanced styling */}
          <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative talent-hero-container">
            {talent.profileImage ? (
              <>
                <img
                  ref={registerImage}
                  src={talent.profileImage}
                  alt={`${talent.firstName} ${talent.lastName}`}
                  className={`w-full h-full object-cover transition-transform duration-700 ease-out ${heroImageLoaded ? "scale-100" : "scale-110"}`}
                  onLoad={handleHeroImageLoad}
                />
                <div
                  className={`absolute inset-0 bg-black transition-opacity duration-700 ${heroImageLoaded ? "opacity-0" : "opacity-50"}`}
                ></div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">
                  {talent.firstName} {talent.lastName}
                </span>
              </div>
            )}
          </div>

          {/* Bio - using the new TalentBio component */}
          <div className="flex flex-col justify-center h-full">
            <TalentBio
              bio={talent.bio || ""}
              firstName={talent.firstName}
              lastName={talent.lastName}
            />
          </div>
        </div>
      )}

      {/* Portfolio gallery - APM style */}
      {boardPortfolioMedia && boardPortfolioMedia.length > 0 ? (
        <div className="mb-12">
          <PortfolioGallery
            mediaItems={boardPortfolioMedia}
            talentName={talentFullName}
            onImagesLoaded={checkAllImagesLoaded}
          />
        </div>
      ) : (
        <div className="mb-12">
          <p className="text-gray-500">No portfolio items available</p>
        </div>
      )}

      {/* Global styles for animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .talent-hero-container {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          animation: fadeIn 1s ease forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `,
        }}
      />
    </div>
  );
}
