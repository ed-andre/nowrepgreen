import { useState } from "react";

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  Globe,
  MessageSquare,
  X,
} from "lucide-react";

interface Portfolio {
  id: string;
  title: string;
  description: string | null;
  isDefault: boolean;
  category: string | null;
  coverImage: string | null;
}

interface MobileTalentHeaderProps {
  talent: any;
  nonDefaultPortfolios?: Portfolio[];
  currentPortfolioId?: string | null;
  handlePortfolioSelect?: (e: React.MouseEvent<HTMLButtonElement>, portfolioId: string) => void;
  handleBackToDefaultPortfolio?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function MobileTalentHeader({
  talent,
  nonDefaultPortfolios = [],
  currentPortfolioId,
  handlePortfolioSelect,
  handleBackToDefaultPortfolio,
}: MobileTalentHeaderProps) {
  const [isBioOpen, setIsBioOpen] = useState(false);

  const toggleBio = () => {
    setIsBioOpen(!isBioOpen);
  };

  // Check if talent has a bio
  const hasBio = talent.bio && talent.bio.trim().length > 0;

  return (
    <div className="lg:hidden mb-4 p-2">
      <div className="flex flex-row gap-2">
        {/* Measurements section - no title needed */}
        <div className="w-1/2">
          {talent.measurements && (
            <div className="grid grid-cols-2 gap-x-1 gap-y-1">
              {talent.measurements.heightFtIn && (
                <div className="measurement-item">
                  <span className="text-2xs uppercase tracking-wider text-gray-400 block">
                    HEIGHT
                  </span>
                  <span className="text-xs font-light">
                    {talent.measurements.heightFtIn}
                  </span>
                </div>
              )}

              {talent.measurements.bustIn && (
                <div className="measurement-item">
                  <span className="text-2xs uppercase tracking-wider text-gray-400 block">
                    BUST
                  </span>
                  <span className="text-xs font-light">
                    {talent.measurements.bustIn}"
                  </span>
                </div>
              )}

              {talent.measurements.waistIn && (
                <div className="measurement-item">
                  <span className="text-2xs uppercase tracking-wider text-gray-400 block">
                    WAIST
                  </span>
                  <span className="text-xs font-light">
                    {talent.measurements.waistIn}"
                  </span>
                </div>
              )}

              {talent.measurements.hipsIn && (
                <div className="measurement-item">
                  <span className="text-2xs uppercase tracking-wider text-gray-400 block">
                    HIPS
                  </span>
                  <span className="text-xs font-light">
                    {talent.measurements.hipsIn}"
                  </span>
                </div>
              )}

              {talent.measurements.shoeSizeUs && (
                <div className="measurement-item">
                  <span className="text-2xs uppercase tracking-wider text-gray-400 block">
                    SHOES
                  </span>
                  <span className="text-xs font-light">
                    {talent.measurements.shoeSizeUs}
                  </span>
                </div>
              )}

              {talent.measurements.eyeColor && (
                <div className="measurement-item">
                  <span className="text-2xs uppercase tracking-wider text-gray-400 block">
                    EYES
                  </span>
                  <span className="text-xs font-light">
                    {talent.measurements.eyeColor}
                  </span>
                </div>
              )}

              {talent.measurements.hairColor && (
                <div className="measurement-item">
                  <span className="text-2xs uppercase tracking-wider text-gray-400 block">
                    HAIR
                  </span>
                  <span className="text-xs font-light">
                    {talent.measurements.hairColor}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Name, Bio, and Portfolio Links - pushed further right */}
        <div className="w-1/2 pl-1">
          <h2 className="mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <span className="block text-base uppercase font-light tracking-widest">
              {talent.firstName}
            </span>
            <span className="block text-base uppercase font-semibold tracking-widest">
              {talent.lastName}
            </span>
          </h2>

          {/* Bio Link - only show if talent has a bio */}
          {hasBio && (
            <button
              onClick={toggleBio}
              className="text-xs uppercase tracking-wider text-gray-600 hover:text-black transition-colors mb-1 flex items-center"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <span>VIEW BIO</span>
              <span className="ml-1">{isBioOpen ? '−' : '+'}</span>
            </button>
          )}

          {/* Portfolio Links - no title needed */}
          {nonDefaultPortfolios && nonDefaultPortfolios.length > 0 && (
            <div className="portfolio-links">
              <ul className="space-y-0.5">
                {/* Link to default portfolio */}
                {currentPortfolioId && handleBackToDefaultPortfolio && (
                  <li>
                    <button
                      onClick={handleBackToDefaultPortfolio}
                      className="text-2xs uppercase tracking-wider text-gray-500 hover:text-black transition-colors block"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      NEW PORT
                    </button>
                  </li>
                )}

                {/* Links to non-default portfolios */}
                {nonDefaultPortfolios.map((portfolio) => (
                  <li key={portfolio.id}>
                    <button
                      onClick={
                        handlePortfolioSelect
                          ? (e) => handlePortfolioSelect(e, portfolio.id)
                          : undefined
                      }
                      className={`text-2xs uppercase tracking-wider ${currentPortfolioId === portfolio.id ? "text-black font-medium" : "text-gray-500"} hover:text-black transition-colors block`}
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {portfolio.title ||
                        `PORTFOLIO ${portfolio.id.substring(0, 1)}`}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Social Media Icons - moved to the right */}
      {talent.socials && talent.socials.length > 0 && (
        <div className="mt-1 flex justify-end">
          <div className="flex flex-wrap gap-3">
            {talent.socials.map((social: any) => {
              // Determine which icon to use based on platform
              let SocialIcon = Globe;
              const iconSize = 14;

              if (social.platform.toLowerCase() === "instagram")
                SocialIcon = Instagram;
              else if (social.platform.toLowerCase() === "twitter")
                SocialIcon = Twitter;
              else if (social.platform.toLowerCase() === "facebook")
                SocialIcon = Facebook;
              else if (social.platform.toLowerCase() === "youtube")
                SocialIcon = Youtube;
              else if (social.platform.toLowerCase() === "linkedin")
                SocialIcon = Linkedin;
              else if (social.platform.toLowerCase() === "tiktok")
                SocialIcon = MessageSquare;

              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-black transition-colors"
                  title={
                    social.platform.charAt(0).toUpperCase() +
                    social.platform.slice(1)
                  }
                >
                  <SocialIcon size={iconSize} strokeWidth={1.5} />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Bio Modal */}
      {isBioOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={toggleBio}
          onKeyDown={(e) => {
            if (e.key === 'Escape') toggleBio();
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') toggleBio();
              e.stopPropagation();
            }}
            tabIndex={0}
          >
            <button
              onClick={toggleBio}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              aria-label="Close bio"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl mb-4 font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {talent.firstName} {talent.lastName}
            </h3>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: talent.bio || "" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}