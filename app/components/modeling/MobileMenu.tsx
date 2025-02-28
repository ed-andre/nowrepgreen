import { useState, useEffect } from "react";

import { Menu, X } from 'lucide-react';
import { Link } from "react-router";

import { MenuList } from "./MenuList";

interface MobileMenuProps {
  textColor?: string;
  currentPath?: string;
  showBoardsMenu?: boolean;
  boards?: Array<{
    id: string;
    title: string;
  }>;
  currentBoardSlug?: string;
  handleNavigation?: (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => void;
  inlineWithHeader?: boolean;
}

export function MobileMenu({
  textColor = "rgba(0,0,0,0.5)",
  currentPath = "",
  showBoardsMenu = false,
  boards = [],
  currentBoardSlug = "",
  handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // This is a no-op default function that will be overridden by the actual handler
  },
  inlineWithHeader = false,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.mobile-menu-container') && !target.closest('.hamburger-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  // Close menu when escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      {/* Mobile Menu Button - No extra container when inline with header */}
      <button
        className="hamburger-button focus:outline-none p-1 pr-3"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <Menu
          size={22}
          color={textColor === "white" ? "white" : "black"}
          strokeWidth={1.5}
        />
      </button>

      {/* Mobile Menu Dropdown */}
      <div
        className={`mobile-menu-container fixed top-16 left-0 right-0 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        style={{ zIndex: 30 }}
      >
        <div
          className="mx-4 rounded-lg shadow-lg py-4 relative backdrop-blur-md"
          style={{
            backgroundColor: textColor === "white" ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.9)',
          }}
        >
          {/* Close button */}
          <button
            className="absolute top-2 right-3 p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            style={{
              color: textColor === "white" ? "white" : "black",
            }}
          >
            <X size={16} />
          </button>

          {/* Menu Items */}
          <div className="px-6 pt-4 pb-2">
            <MenuList
              textColor={textColor === "white" ? "white" : "black"}
              className="flex flex-col space-y-4"
              itemClassName="text-left text-base py-2 font-light tracking-wide"
              currentPath={currentPath}
            />
          </div>

          {/* Boards Menu - Only shown if enabled, without title and border */}
          {showBoardsMenu && boards.length > 0 && (
            <div className="mt-2 px-6">
              <ul className="space-y-2">
                {/* All Talent link */}
                <li>
                  <Link
                    to="/modeling/talents"
                    onClick={(e) => handleNavigation(e, "/modeling/talents")}
                    className={`block py-1.5 px-2 rounded-md transition-colors ${
                      currentPath === "/modeling/talents"
                        ? textColor === "white"
                          ? "bg-white/20 text-white"
                          : "bg-black/10 text-black"
                        : ""
                    }`}
                    style={{
                      color: textColor === "white" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)",
                    }}
                  >
                    All Talent
                  </Link>
                </li>

                {/* Board links */}
                {boards.map((board) => {
                  const boardSlug = board.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");
                  const isActive = boardSlug === currentBoardSlug;

                  return (
                    <li key={board.id}>
                      <Link
                        to={`/modeling/boards/${boardSlug}`}
                        onClick={(e) =>
                          handleNavigation(e, `/modeling/boards/${boardSlug}`)
                        }
                        className={`block py-1.5 px-2 rounded-md transition-colors ${
                          isActive
                            ? textColor === "white"
                              ? "bg-white/20 text-white"
                              : "bg-black/10 text-black"
                            : ""
                        }`}
                        style={{
                          color: textColor === "white" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)",
                        }}
                      >
                        {board.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}