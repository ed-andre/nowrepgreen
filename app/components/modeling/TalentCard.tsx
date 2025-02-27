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

  // Format measurements in the style shown in the screenshot
  const formatMeasurements = () => {
    const { measurements } = talent;
    if (!measurements) return null;

    const height = measurements.heightFtIn ? measurements.heightFtIn : "";
    const bust = measurements.bustIn ? `${measurements.bustIn}"` : "";
    const waist = measurements.waistIn ? `${measurements.waistIn}"` : "";
    const hips = measurements.hipsIn ? `${measurements.hipsIn}"` : "";

    // Format as: 5'10", 34" / 25" / 35"
    const heightStr = height;
    const measurementsStr = [bust, waist, hips].filter(Boolean).join(" / ");

    return (
      <>
        <div className="text-center">{heightStr}</div>
        {measurementsStr && (
          <div className="text-center">{measurementsStr}</div>
        )}
      </>
    );
  };

  // Format colors and shoe size
  const formatColors = () => {
    const { measurements } = talent;
    if (!measurements) return null;

    const hairColor = measurements.hairColor || "";
    const eyeColor = measurements.eyeColor || "";
    const shoeSize = measurements.shoeSizeUs
      ? `${measurements.shoeSizeUs}`
      : "";

    const colorParts = [];
    if (hairColor) colorParts.push(hairColor.toUpperCase());
    if (eyeColor) colorParts.push(eyeColor.toUpperCase());

    return (
      <>
        {colorParts.length > 0 && (
          <div className="text-center text-xs mt-1">
            {colorParts.join(" / ")}
          </div>
        )}
        {shoeSize && (
          <div className="text-center text-xs mt-1">SHOE {shoeSize}</div>
        )}
      </>
    );
  };

  return (
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
            className={`absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-white p-4 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            } hidden md:flex`}
          >
            <div className="text-center font-bold uppercase tracking-wider mb-2">
              {talent.firstName} {talent.lastName}
            </div>
            {formatMeasurements()}
            {formatColors()}
          </div>

          {/* Always visible info for mobile */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 md:hidden">
            <div className="text-center text-sm font-bold uppercase tracking-wider">
              {talent.firstName} {talent.lastName}
            </div>
            <div className="text-center text-xs">
              {formatMeasurements()}
              {formatColors()}
            </div>
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
  );
}
