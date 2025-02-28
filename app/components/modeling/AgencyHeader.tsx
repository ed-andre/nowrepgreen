import { Link } from "react-router";

import { MenuList } from "./MenuList";
import { MobileMenu } from "./MobileMenu";

interface AgencyHeaderProps {
  handleNavigation?: (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => void;
  isTransparent?: boolean;
  textColor?: string;
  showMobileMenu?: boolean;
  currentPath?: string;
  showBoardsMenu?: boolean;
  boards?: Array<{
    id: string;
    title: string;
  }>;
  currentBoardSlug?: string;
}

export function AgencyHeader({
  handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // This is a no-op default function that will be overridden by the actual handler
  },
  isTransparent = true,
  textColor = "black",
  showMobileMenu = true,
  currentPath = "",
  showBoardsMenu = false,
  boards = [],
  currentBoardSlug = "",
}: AgencyHeaderProps) {
  // Check if we're on the index page
  const isIndexPage =
    currentPath === "/modeling" || currentPath === "/modeling/";

  return (
    <header className="py-4 bg-transparent relative w-full">
      {/* Container with three columns for layout */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between lg:justify-center lg:relative">
          {/* Left spacer - same width as right menu to keep logo centered */}
          <div className="w-10 lg:hidden"></div>

          {/* Centered logo */}
          <div className="text-center">
            <Link
              to="/modeling"
              onClick={(e) => handleNavigation(e, "/modeling")}
              className="inline-block"
            >
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold tracking-widest uppercase transition-colors duration-500 whitespace-nowrap"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: textColor,
                }}
              >
                NOWREP AGENCY
              </h1>
            </Link>
          </div>

          {/* Right side - Mobile menu */}
          {showMobileMenu && (
            <div className="lg:hidden w-10 flex justify-end">
              <MobileMenu
                textColor={textColor}
                currentPath={currentPath}
                showBoardsMenu={showBoardsMenu}
                boards={boards}
                currentBoardSlug={currentBoardSlug}
                handleNavigation={handleNavigation}
                inlineWithHeader={true}
              />
            </div>
          )}

          {/* Desktop mobile menu - positioned absolutely to maintain centered logo */}
          {showMobileMenu && (
            <div className="hidden lg:block lg:absolute lg:right-0">
              <MobileMenu
                textColor={textColor}
                currentPath={currentPath}
                showBoardsMenu={showBoardsMenu}
                boards={boards}
                currentBoardSlug={currentBoardSlug}
                handleNavigation={handleNavigation}
                inlineWithHeader={true}
              />
            </div>
          )}
        </div>

        {/* Desktop Menu - Only visible on large screens and only on the index page */}
        {isIndexPage && (
          <div className="hidden lg:block mt-2">
            <div className="flex justify-center">
              <MenuList
                textColor={textColor}
                className="flex space-x-10"
                currentPath={currentPath}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
