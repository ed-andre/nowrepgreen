import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  Globe,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router";

interface Portfolio {
  id: string;
  title: string;
  description: string | null;
  isDefault: boolean;
  category: string | null;
  coverImage: string | null;
}

interface TalentSidebarProps {
  talent: any;
  board: any;
  allBoards: any[];
  currentBoardSlug: string;
  handleNavigation: (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => void;
  nonDefaultPortfolios?: Portfolio[];
  currentPortfolioId?: string | null;
  handlePortfolioSelect?: (
    e: React.MouseEvent<HTMLButtonElement>,
    portfolioId: string,
  ) => void;
  handleBackToDefaultPortfolio?: (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  handleContactClick?: () => void;
  isContactOpen?: boolean;
}

export function TalentSidebar({
  talent,
  board,
  allBoards,
  currentBoardSlug,
  handleNavigation,
  nonDefaultPortfolios = [],
  currentPortfolioId,
  handlePortfolioSelect,
  handleBackToDefaultPortfolio,
}: TalentSidebarProps) {
  return (
    <div className="mt-12 talent-sidebar overflow-hidden">
      <div>
        {/* Talent name with artistic styling */}
        <div className="mb-8">
          <h2
            className="talent-name"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <span className="block text-2xl uppercase font-light tracking-widest talent-first-name">
              {talent.firstName}
            </span>
            <span className="block text-2xl uppercase font-semibold tracking-widest talent-last-name">
              {talent.lastName}
            </span>
          </h2>
        </div>

        {/* Measurements with minimal styling */}
        {talent.measurements && (
          <div className="mb-6 measurements-container">
            <div
              className="measurements-grid"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {talent.measurements.heightFtIn && (
                <div className="measurement-item">
                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    Height
                  </span>
                  <span className="text-sm font-light">
                    {talent.measurements.heightFtIn}
                  </span>
                </div>
              )}

              {talent.measurements.bustIn && (
                <div className="measurement-item">
                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    Bust
                  </span>
                  <span className="text-sm font-light">
                    {talent.measurements.bustIn}"
                  </span>
                </div>
              )}

              {talent.measurements.waistIn && (
                <div className="measurement-item">
                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    Waist
                  </span>
                  <span className="text-sm font-light">
                    {talent.measurements.waistIn}"
                  </span>
                </div>
              )}

              {talent.measurements.hipsIn && (
                <div className="measurement-item">
                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    Hips
                  </span>
                  <span className="text-sm font-light">
                    {talent.measurements.hipsIn}"
                  </span>
                </div>
              )}

              {talent.measurements.shoeSizeUs && (
                <div className="measurement-item">
                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    Shoes
                  </span>
                  <span className="text-sm font-light">
                    {talent.measurements.shoeSizeUs}
                  </span>
                </div>
              )}

              {talent.measurements.hairColor && (
                <div className="measurement-item">
                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    Hair
                  </span>
                  <span className="text-sm font-light">
                    {talent.measurements.hairColor}
                  </span>
                </div>
              )}

              {talent.measurements.eyeColor && (
                <div className="measurement-item">
                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    Eyes
                  </span>
                  <span className="text-sm font-light">
                    {talent.measurements.eyeColor}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Media Icons with minimal styling */}
        {talent.socials && talent.socials.length > 0 && (
          <div className="mb-6 social-container">
            <div className="flex flex-wrap gap-5">
              {talent.socials.map((social: any) => {
                // Determine which icon to use based on platform
                let SocialIcon = Globe;
                const iconSize = 18;

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
                    className="text-gray-400 hover:text-black transition-colors social-icon"
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

        {/* Portfolio Links with minimal styling */}
        {nonDefaultPortfolios && nonDefaultPortfolios.length > 0 && (
          <div className="my-12 portfolio-container">
            <ul className="space-y-3 ml-3">
              {/* Link to default portfolio */}
              {currentPortfolioId && handleBackToDefaultPortfolio && (
                <li>
                  <button
                    onClick={handleBackToDefaultPortfolio}
                    className="text-xs uppercase tracking-wider text-gray-500 hover:text-black transition-colors block portfolio-link"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Main Portfolio
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
                    className={`text-xs uppercase tracking-wider ${currentPortfolioId === portfolio.id ? "text-black font-medium" : "text-gray-500"} hover:text-black transition-colors block portfolio-link`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {portfolio.title ||
                      `Portfolio ${portfolio.id.substring(0, 4)}`}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Back to board link with minimal styling */}
        <div className="mt-8 back-link-container">
          <Link
            to={`/modeling/boards/${currentBoardSlug}`}
            className="text-xs uppercase tracking-wider text-gray-400 hover:text-black transition-colors back-link"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            ← Back to {board.title} Board
          </Link>
        </div>
      </div>

      {/* Global styles for animations and layout */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .talent-sidebar {
          animation: fadeIn 0.8s ease forwards;
          position: relative;
          overflow-x: hidden;
        }

        .talent-sidebar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          height: 40px;
          background-color: #000;
          opacity: 0.5;
        }

        .talent-name {
          position: relative;
          margin-left: 12px;
        }

        .talent-first-name {
          font-weight: 300;
          letter-spacing: 0.1em;
          line-height: 1.1;
          animation: slideIn 0.6s ease forwards;
          animation-delay: 0.1s;
          opacity: 0;
          transform: translateY(10px);
        }

        .talent-last-name {
          font-weight: 600;
          letter-spacing: 0.1em;
          line-height: 1.1;
          animation: slideIn 0.6s ease forwards;
          animation-delay: 0.2s;
          opacity: 0;
          transform: translateY(10px);
        }

        .measurements-container {
          animation: fadeIn 0.8s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
          position: relative;
          margin-left: 12px;
        }

        .measurements-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.2rem 2.5rem;
        }

        .measurement-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .social-container {
          animation: fadeIn 0.8s ease forwards;
          animation-delay: 0.4s;
          opacity: 0;
          position: relative;
          margin-left: 12px;
        }

        .social-icon {
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .social-icon:hover {
          transform: translateY(-2px);
        }

        .portfolio-container {
          animation: fadeIn 0.8s ease forwards;
          animation-delay: 0.5s;
          opacity: 0;
          position: relative;
          margin-left: 12px;
        }

        .back-link-container {
          animation: fadeIn 0.8s ease forwards;
          animation-delay: 0.6s;
          opacity: 0;
          position: relative;
          margin-left: 12px;
        }

        .all-talents-link {
          animation: fadeIn 0.8s ease forwards;
          animation-delay: 0.7s;
          opacity: 0;
          position: relative;
          margin-left: 12px;
        }

        .portfolio-link {
          position: relative;
          display: inline-block;
          padding-bottom: 2px;
          letter-spacing: 0.1em;
          transition: color 0.3s ease;
        }

        .back-link {
          position: relative;
          display: inline-block;
          padding-bottom: 2px;
          transition: color 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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
