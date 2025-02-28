import { useState, useEffect, useRef } from "react";

export interface TalentCardProps {
  talent: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
    measurements?: {
      heightFtIn?: string | null;
      bustIn?: number | null;
      waistIn?: number | null;
      hipsIn?: number | null;
      shoeSizeUs?: number | null;
      eyeColor?: string | null;
      hairColor?: string | null;
    } | null;
  };
  boardSlug: string;
  handleNavigation: (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => void;
}

export function TalentCard({
  talent,
  boardSlug,
  handleNavigation,
}: TalentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Check if image is already loaded when component mounts
  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setImageLoaded(true);
    }
  }, []);

  // Format all measurements and attributes in a compact way
  const formatTalentDetails = () => {
    const { measurements } = talent;
    if (!measurements) return null;

    const parts = [];

    // Add height
    if (measurements.heightFtIn) {
      parts.push(measurements.heightFtIn);
    }

    // Add bust/waist/hips
    const bwh = [];
    if (measurements.bustIn) bwh.push(`${measurements.bustIn}"`);
    if (measurements.waistIn) bwh.push(`${measurements.waistIn}"`);
    if (measurements.hipsIn) bwh.push(`${measurements.hipsIn}"`);

    if (bwh.length > 0) {
      parts.push(bwh.join("/"));
    }

    // Add hair/eye color
    const colors = [];
    if (measurements.hairColor) colors.push(measurements.hairColor.toUpperCase());
    if (measurements.eyeColor) colors.push(measurements.eyeColor.toUpperCase());

    if (colors.length > 0) {
      parts.push(colors.join("/"));
    }

    // Add shoe size
    if (measurements.shoeSizeUs) {
      parts.push(`SZ ${measurements.shoeSizeUs}`);
    }

    return parts.join(" · ");
  };

  const talentDetails = formatTalentDetails();

  return (
    <div className="flex flex-col">
      <div
        className={`block aspect-[3/4] overflow-hidden bg-gray-100 relative group ${!imageLoaded ? "animate-pulse" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {talent.profileImage ? (
          <>
            <div
              className={`w-full h-full transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            >
              <img
                ref={imageRef}
                src={talent.profileImage}
                alt={`${talent.firstName} ${talent.lastName}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </div>

            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-b-2 border-gray-400 rounded-full animate-spin"></div>
              </div>
            )}

            {/* Overlay with talent info - visible on hover for desktop */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 flex flex-col justify-end items-center text-white p-4 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              } hidden lg:flex`}
            >
              <div className="text-center font-bold uppercase tracking-wider mb-2">
                {talent.firstName} {talent.lastName}
              </div>
              {talentDetails && (
                <div className="text-center text-xs tracking-wide mb-2 opacity-90">
                  {talentDetails}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">
              {talent.firstName} {talent.lastName}
            </span>
          </div>
        )}
      </div>

      {/* Mobile info - below the image */}
      <div className="lg:hidden mt-2">
        <div className="text-sm font-medium uppercase tracking-wider text-center">
          {talent.firstName} {talent.lastName}
        </div>
        {talentDetails && (
          <div className="text-xs text-gray-600 text-center mt-1 truncate">
            {talentDetails}
          </div>
        )}
      </div>
    </div>
  );
}
