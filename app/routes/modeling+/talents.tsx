import { useState, useEffect, useMemo, useRef } from "react";

import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link, useNavigate, useLocation } from "react-router";

import {
  LoadingState,
  ErrorDisplay,
  SidebarMenu,
  AgencyHeader,
  TalentCard,
  TalentSearch,
} from "~/components/modeling";
import { searchAnimations } from "~/components/modeling/TalentSearch";
import { getBoards } from "~/models/boards.server";
import { getTalentsByBoard } from "~/models/talents.server";
import { generateGradientForBoard } from "~/utils/gradients";

export async function loader({ request }: LoaderFunctionArgs) {
  const boardsWithTalents = await getTalentsByBoard();
  const allBoards = await getBoards();

  // Sort both board arrays alphabetically by title
  const sortedBoardsWithTalents = boardsWithTalents.sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  const sortedAllBoards = allBoards.sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  return {
    boardsWithTalents: sortedBoardsWithTalents,
    allBoards: sortedAllBoards,
  };
}

export default function TalentDirectory() {
  const { boardsWithTalents, allBoards } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [hoveredTalent, setHoveredTalent] = useState<string | null>(null);
  const [hoveredBoard, setHoveredBoard] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Filter talents based on search term
  const filteredBoards = useMemo(() => {
    if (!searchTerm.trim()) return boardsWithTalents;

    return boardsWithTalents
      .map((board) => {
        const filteredTalents = board.talents.filter((talent) => {
          const fullName =
            `${talent.firstName} ${talent.lastName}`.toLowerCase();
          return fullName.includes(searchTerm.toLowerCase());
        });

        return {
          ...board,
          talents: filteredTalents,
        };
      })
      .filter((board) => board.talents.length > 0);
  }, [boardsWithTalents, searchTerm]);

  // Calculate total talents
  const totalTalents = useMemo(() => {
    return boardsWithTalents.reduce(
      (acc, board) => acc + board.talents.length,
      0,
    );
  }, [boardsWithTalents]);

  // Calculate found talents
  const foundTalents = useMemo(() => {
    return filteredBoards.reduce((acc, board) => acc + board.talents.length, 0);
  }, [filteredBoards]);

  // Fade in effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Detect touch device on mount
  useEffect(() => {
    const detectTouch = () => {
      setIsTouchDevice(true);
      // Remove the event listeners once we've detected touch
      window.removeEventListener("touchstart", detectTouch);
    };

    window.addEventListener("touchstart", detectTouch);

    return () => {
      window.removeEventListener("touchstart", detectTouch);
    };
  }, []);

  // Handle search input change with typing animation
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsTyping(true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  // Handle navigation with animation
  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    e.preventDefault();
    setIsNavigating(true);
    setIsPageVisible(false);
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  // Handle talent click
  const handleTalentClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    boardSlug: string,
    talentId: string,
  ) => {
    e.preventDefault();
    setIsNavigating(true);
    setIsPageVisible(false);
    setTimeout(() => {
      navigate(`/modeling/boards/${boardSlug}?talent=${talentId}`);
    }, 500);
  };

  // Modified handle talent mouse enter
  const handleTalentMouseEnter = (talentId: string, boardId: string) => {
    if (!isNavigating) {
      setHoveredTalent(talentId);
      setHoveredBoard(boardId);

      // For touch devices, set a timeout to clear the hover state
      if (isTouchDevice) {
        if (touchTimeoutRef.current) {
          clearTimeout(touchTimeoutRef.current);
        }

        touchTimeoutRef.current = setTimeout(() => {
          setHoveredTalent(null);
          setHoveredBoard(null);
        }, 3000); // Reset after 3 seconds
      }
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (!isNavigating) {
      setHoveredTalent(null);
      setHoveredBoard(null);
    }
  };

  // Focus search input
  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Get background style for hovered talent
  const getBackgroundStyle = (talent: any, boardId: string) => {
    if (talent.profileImage) {
      return { backgroundImage: `url(${talent.profileImage})` };
    } else {
      return {
        backgroundImage: generateGradientForBoard(boardId),
        backgroundSize: "cover",
      };
    }
  };

  // Update background when hovered talent changes
  useEffect(() => {
    if (hoveredTalent && hoveredBoard && bgImageRef.current) {
      const board = boardsWithTalents.find((b) => b.id === hoveredBoard);
      if (!board) return;

      const talent = board.talents.find((t) => t.id === hoveredTalent);
      if (!talent) return;

      const styles = getBackgroundStyle(talent, hoveredBoard);

      try {
        Object.assign(bgImageRef.current.style, styles);
        bgImageRef.current.style.opacity = "0.7";
      } catch (error) {
        console.error("Error in background style application:", error);
        bgImageRef.current.style.backgroundColor = "#333";
        bgImageRef.current.style.opacity = "0.7";
      }
    } else if (bgImageRef.current) {
      bgImageRef.current.style.opacity = "0";
    }
  }, [hoveredTalent, hoveredBoard, boardsWithTalents]);

  // Update header class based on hover state
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      if (hoveredTalent) {
        header.classList.add("text-white");
        header.classList.remove("text-black");
      } else {
        header.classList.remove("text-white");
        header.classList.add("text-black");
      }
    }
  }, [hoveredTalent]);

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Clear touch timeout on unmount
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  // Add a touch handler for talents
  const handleTalentTouch = (
    e: React.TouchEvent<HTMLDivElement>,
    talentId: string,
    boardId: string,
  ) => {
    // Prevent default to avoid immediate click
    e.preventDefault();

    // If we're already hovering this talent, let the click handler take over
    if (hoveredTalent === talentId) {
      return;
    }

    // Otherwise, simulate hover
    handleTalentMouseEnter(talentId, boardId);
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        isolation: "isolate",
        opacity: isPageVisible ? 1 : 0,
        transition: "opacity 500ms ease-in-out",
      }}
    >
      {/* Background overlay */}
      <div
        className="fixed inset-0 w-full h-full bg-black transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{
          opacity: hoveredTalent ? 1 : 0,
          zIndex: 0,
        }}
      />

      {/* Background image with blur effect */}
      <div
        ref={bgImageRef}
        className="fixed inset-0 w-full h-full transition-all duration-1000 ease-in-out bg-center bg-cover pointer-events-none"
        style={{
          filter: "blur(8px) brightness(0.7)",
          transform: "scale(1.05)",
          zIndex: 0,
        }}
      />

      {/* Header - Made sticky via CSS */}
      <div className="sticky top-0 z-50 w-full">
        <AgencyHeader
          isTransparent={true}
          textColor={hoveredTalent ? "white" : "black"}
          showMobileMenu={true}
          currentPath={location.pathname}
          showBoardsMenu={true}
          boards={allBoards}
          handleNavigation={handleNavigation}
        />
      </div>

      {/* Search Component - Positioned absolutely to center it */}
      <TalentSearch
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        totalTalents={totalTalents}
        foundTalents={foundTalents}
        hoveredTalent={hoveredTalent}
        isTyping={isTyping}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        focusSearch={focusSearch}
        searchInputRef={searchInputRef}
      />

      {/* Main content */}
      <div
        className="flex flex-col md:flex-row mt-32 relative"
        style={{ zIndex: 10 }}
      >
        {/* Sidebar - Made sticky and hidden on mobile and iPad */}
        <div className="hidden lg:block lg:w-64 flex-shrink-0 lg:fixed lg:left-0 lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto px-6 lg:py-4 lg:box-border overflow-x-hidden">
          <SidebarMenu
            boards={allBoards}
            currentPath={location.pathname}
            handleNavigation={handleNavigation}
          />
        </div>

        {/* Main content area - Adjusted for fixed sidebar and search */}
        <div className="flex-grow flex flex-col items-center justify-start lg:ml-64 px-6 md:px-12">
          <div className="w-full max-w-full">
            {/* Boards and talents */}
            {filteredBoards.length > 0 ? (
              <div className="space-y-16">
                {filteredBoards.map((board) => (
                  <div key={board.id} className="mb-12">
                    <h2
                      className={`text-3xl md:text-4xl font-black uppercase tracking-tight mb-8 ${
                        hoveredTalent && hoveredBoard === board.id
                          ? "text-white"
                          : hoveredTalent
                            ? "text-gray-500"
                            : "text-gray-900"
                      }`}
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        transition: "color 500ms ease-in-out",
                      }}
                    >
                      {board.title}
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-6 gap-y-4">
                      {board.talents.map((talent) => (
                        <div
                          key={talent.id}
                          className="group"
                          onMouseEnter={(e) =>
                            handleTalentMouseEnter(talent.id, board.id)
                          }
                          onMouseLeave={handleMouseLeave}
                          onTouchStart={(e) =>
                            handleTalentTouch(e, talent.id, board.id)
                          }
                        >
                          <Link
                            to={`/modeling/boards/${board.slug}?talent=${talent.id}`}
                            onClick={(e) =>
                              handleTalentClick(e, board.slug, talent.id)
                            }
                            className="block"
                          >
                            <div
                              className={`text-base md:text-lg font-medium transition-all duration-500 ease-in-out ${
                                hoveredTalent === talent.id
                                  ? "text-white scale-110 -translate-y-1"
                                  : hoveredTalent
                                    ? "text-gray-500"
                                    : "text-gray-900"
                              }`}
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                              }}
                            >
                              {talent.firstName} {talent.lastName}
                            </div>

                            {/* Animated underline */}
                            <div
                              className="h-0.5 transition-all duration-500 ease-in-out"
                              style={{
                                width:
                                  hoveredTalent === talent.id ? "100%" : "0%",
                                opacity: hoveredTalent === talent.id ? 1 : 0,
                                background: hoveredTalent ? "white" : "black",
                              }}
                            />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`text-center py-16 ${hoveredTalent ? "text-white" : "text-gray-800"}`}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                <p className="text-xl">
                  No talents found matching your search.
                </p>
                <p className="mt-4">
                  Try a different search term or clear the search field.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        ${searchAnimations}

        /* Sticky header styles */
        .sticky {
          position: sticky;
          top: 0;
          z-index: 50;
        }

        header {
          backdrop-filter: blur(5px);
          background-color: transparent;
          transition: all 0.3s ease;
        }

        header.text-white h1 {
          color: white;
        }

        header.text-black h1 {
          color: black;
        }
      `}</style>
    </div>
  );
}
