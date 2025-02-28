import { useState, useEffect, useRef } from "react";

import { type LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link, useNavigate, useLocation } from "react-router";

import {
  LoadingState,
  ErrorDisplay,
  AgencyHeader,
  Footer,
} from "~/components/modeling";
import { prisma } from "~/db.server";
import { getBoards } from "~/models/boards.server";
import { generateGradientForBoard } from "~/utils/gradients";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const boards = await getBoards();

  // Get model counts for each board
  const boardsWithCounts = await Promise.all(
    boards.map(async (board) => {
      const count = await prisma.boardsTalents_current.count({
        where: { boardId: board.id },
      });

      return {
        id: board.id,
        title: board.title,
        description: board.description || undefined,
        coverImage: board.coverImage || undefined,
        talentCount: count,
      };
    }),
  );

  // Sort boards alphabetically by title
  const sortedBoards = boardsWithCounts.sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  // Get total talent count for the directory link
  const totalTalentCount = await prisma.talents_current.count();

  return { boards: sortedBoards, totalTalentCount };
};

export default function ModelingIndex() {
  const { boards, totalTalentCount } = useLoaderData<typeof loader>();
  const [hoveredBoard, setHoveredBoard] = useState<string | null>(null);
  const [hoveredDirectory, setHoveredDirectory] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<
    Record<string, boolean>
  >({});
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect touch device on mount
  useEffect(() => {
    const detectTouch = () => {
      setIsTouchDevice(true);
      // Remove the event listeners once we've detected touch
      window.removeEventListener('touchstart', detectTouch);
    };

    window.addEventListener('touchstart', detectTouch);

    return () => {
      window.removeEventListener('touchstart', detectTouch);
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

  // Fade in effect when component mounts
  useEffect(() => {
    // Small delay to ensure the transition is visible
    const timer = setTimeout(() => {
      setIsPageVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Preload images for smoother transitions
  useEffect(() => {
    boards.forEach((board) => {
      if (board.coverImage) {
        // If there's a real image, preload it
        const img = new Image();
        img.src = board.coverImage;
        img.onload = () => {
          setPreloadedImages((prev) => ({ ...prev, [board.id]: true }));
        };
      } else {
        // For boards without images, we don't need to preload anything
        // Just mark them as "loaded"
        setPreloadedImages((prev) => ({ ...prev, [board.id]: true }));
      }
    });
  }, [boards]);

  // Get the current background image URL or gradient
  const getBackgroundStyle = (boardId: string) => {
    const board = boards.find((b) => b.id === boardId);

    if (board?.coverImage) {
      // Return the actual image URL if available
      return { backgroundImage: `url(${board.coverImage})` };
    } else {
      // Return a generated gradient for boards without images
      return {
        backgroundImage: generateGradientForBoard(boardId),
        backgroundSize: "cover",
      };
    }
  };

  // Modified handler for mouse enter to work with touch
  const handleMouseEnter = (boardId: string) => {
    if (!isNavigating) {
      setHoveredBoard(boardId);
      setHoveredDirectory(false);

      // For touch devices, set a timeout to clear the hover state
      if (isTouchDevice) {
        if (touchTimeoutRef.current) {
          clearTimeout(touchTimeoutRef.current);
        }

        touchTimeoutRef.current = setTimeout(() => {
          setHoveredBoard(null);
          setHoveredDirectory(false);
        }, 3000); // Reset after 3 seconds
      }
    }
  };

  // Modified handler for directory mouse enter
  const handleDirectoryMouseEnter = () => {
    if (!isNavigating) {
      setHoveredBoard(null);
      setHoveredDirectory(true);

      // For touch devices, set a timeout to clear the hover state
      if (isTouchDevice) {
        if (touchTimeoutRef.current) {
          clearTimeout(touchTimeoutRef.current);
        }

        touchTimeoutRef.current = setTimeout(() => {
          setHoveredBoard(null);
          setHoveredDirectory(false);
        }, 3000); // Reset after 3 seconds
      }
    }
  };

  // Add a touch handler for boards
  const handleBoardTouch = (
    e: React.TouchEvent<HTMLDivElement>,
    boardId: string
  ) => {
    // Prevent default to avoid immediate click
    e.preventDefault();

    // If we're already hovering this board, let the click handler take over
    if (hoveredBoard === boardId) {
      return;
    }

    // Otherwise, simulate hover
    handleMouseEnter(boardId);
  };

  // Add a touch handler for directory
  const handleDirectoryTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    // Prevent default to avoid immediate click
    e.preventDefault();

    // If we're already hovering directory, let the click handler take over
    if (hoveredDirectory) {
      return;
    }

    // Otherwise, simulate hover
    handleDirectoryMouseEnter();
  };

  const handleMouseLeave = () => {
    if (!isNavigating) {
      setHoveredBoard(null);
      setHoveredDirectory(false);
    }
  };

  // Handle navigation to board detail page
  const handleBoardClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    boardTitle: string,
  ) => {
    e.preventDefault();
    setIsNavigating(true);

    // Keep the hovered board state during transition
    const boardId = boards.find((b) => b.title === boardTitle)?.id || "";
    setHoveredBoard(boardId);

    // Fade out the page
    setIsPageVisible(false);

    // Create URL-friendly slug from board title
    const boardSlug = boardTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Wait for fade out animation to complete before navigating
    setTimeout(() => {
      navigate(`/modeling/boards/${boardSlug}`);
    }, 500);
  };

  // Handle navigation to talent directory
  const handleDirectoryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsNavigating(true);
    setHoveredDirectory(true);

    // Fade out the page
    setIsPageVisible(false);

    // Wait for fade out animation to complete before navigating
    setTimeout(() => {
      navigate("/modeling/talents");
    }, 500);
  };

  // Force update of background image when hoveredBoard changes
  useEffect(() => {
    if (hoveredBoard && bgImageRef.current) {
      const styles = getBackgroundStyle(hoveredBoard);

      try {
        // Apply the background style
        Object.assign(bgImageRef.current.style, styles);
        bgImageRef.current.style.opacity = "0.7";
      } catch (error) {
        console.error("Error in background style application:", error);
        // Fallback to a solid color if style application fails
        bgImageRef.current.style.backgroundColor = "#333";
        bgImageRef.current.style.opacity = "0.7";
      }
    } else if (hoveredDirectory && bgImageRef.current) {
      // Special gradient background for directory hover
      bgImageRef.current.style.backgroundImage =
        "linear-gradient(135deg, #000000 0%, #434343 100%)";
      bgImageRef.current.style.opacity = "0.7";
    } else if (bgImageRef.current) {
      bgImageRef.current.style.opacity = "0";
    }
  }, [hoveredBoard, hoveredDirectory]);

  // Calculate font size based on number of boards to ensure everything fits
  const calculateFontSize = () => {
    const totalItems = boards.length + 1; // boards + all talents link

    // More granular font size adjustments based on number of items and screen size
    if (totalItems > 10) {
      return {
        boardFontSize: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
        directoryFontSize: "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl",
        gap: "gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12",
      };
    } else if (totalItems > 8) {
      return {
        boardFontSize: "text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl",
        directoryFontSize: "text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl",
        gap: "gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12",
      };
    } else if (totalItems > 6) {
      return {
        boardFontSize: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
        directoryFontSize: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
        gap: "gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16",
      };
    } else {
      return {
        boardFontSize: "text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl",
        directoryFontSize: "text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl",
        gap: "gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20",
      };
    }
  };

  const { boardFontSize, directoryFontSize, gap } = calculateFontSize();

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        isolation: "isolate",
        opacity: isPageVisible ? 1 : 0,
        transition: "opacity 500ms ease-in-out",
      }}
    >
      {/* Background image that changes on hover */}
      <div
        className="fixed inset-0 w-full h-full bg-black transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{
          opacity: hoveredBoard || hoveredDirectory ? 1 : 0,
          zIndex: 0,
        }}
      />

      {/* Actual background image with blur effect */}
      <div
        ref={bgImageRef}
        className="fixed inset-0 w-full h-full transition-all duration-1000 ease-in-out bg-center bg-cover pointer-events-none"
        style={{
          filter: "blur(8px) brightness(0.7)",
          transform: "scale(1.05)",
          zIndex: 0,
        }}
      />

      {/* Use the AgencyHeader component */}
      <div className="sticky top-0 z-50 w-full">
        <AgencyHeader
          isTransparent={true}
          textColor={hoveredBoard || hoveredDirectory ? "white" : "black"}
          showMobileMenu={true}
          currentPath={location.pathname}
        />
      </div>

      {/* Main content - bold striking board names */}
      <div
        className="flex-grow flex flex-col items-center justify-center pt-4 md:pt-6 pb-6 relative"
        style={{ zIndex: 10 }}
      >
        <div className="w-full max-w-6xl px-4">
          <div className={`grid grid-cols-1 ${gap}`}>
            {boards.map((board) => (
              <div key={board.id} className="relative">
                <div
                  className="text-center cursor-pointer"
                  onMouseEnter={() => handleMouseEnter(board.id)}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={(e) => handleBoardTouch(e, board.id)}
                >
                  <Link
                    to={`/modeling/boards/${board.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")}`}
                    className="group block"
                    onClick={(e) => handleBoardClick(e, board.title)}
                  >
                    <div
                      className={`${boardFontSize} font-black uppercase tracking-tight transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-2`}
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        WebkitTextStroke:
                          hoveredBoard === board.id ? "2px white" : "0",
                        color:
                          hoveredBoard === board.id
                            ? "transparent"
                            : hoveredBoard
                              ? "rgba(255,255,255,0.3)"
                              : "black",
                        lineHeight: "0.9",
                      }}
                    >
                      {board.title}
                    </div>

                    {/* Animated underline */}
                    <div
                      className="h-1 mx-auto transition-all duration-500 ease-in-out"
                      style={{
                        width: hoveredBoard === board.id ? "100%" : "0%",
                        opacity: hoveredBoard === board.id ? 1 : 0,
                        background: hoveredBoard ? "white" : "black",
                      }}
                    />

                    {/* Talent count */}
                    <div
                      className="mt-2 text-sm uppercase tracking-widest transition-all duration-500 ease-in-out"
                      style={{
                        opacity: hoveredBoard === board.id ? 1 : 0,
                        transform:
                          hoveredBoard === board.id
                            ? "translateY(0)"
                            : "translateY(-10px)",
                        color: hoveredBoard ? "white" : "black",
                      }}
                    >
                      {board.talentCount}{" "}
                      {board.talentCount === 1 ? "TALENT" : "TALENTS"}
                    </div>
                  </Link>
                </div>
              </div>
            ))}

            {/* Talent Directory Link */}
            <div className="relative mt-4">
              <div
                className="text-center cursor-pointer"
                onMouseEnter={handleDirectoryMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleDirectoryTouch}
              >
                <Link
                  to="/modeling/talents"
                  className="group block"
                  onClick={handleDirectoryClick}
                >
                  <div
                    className={`${directoryFontSize} font-black uppercase tracking-tight transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:-translate-y-2`}
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      WebkitTextStroke: hoveredDirectory
                        ? "2px white"
                        : "1px rgba(0,0,0,0.3)",
                      color: hoveredDirectory
                        ? "transparent"
                        : hoveredBoard
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(0,0,0,0.7)",
                      lineHeight: "0.9",
                    }}
                  >
                    All Talents
                  </div>

                  {/* Animated underline */}
                  <div
                    className="h-1 mx-auto transition-all duration-500 ease-in-out"
                    style={{
                      width: hoveredDirectory ? "100%" : "0%",
                      opacity: hoveredDirectory ? 1 : 0,
                      background: hoveredDirectory ? "white" : "black",
                    }}
                  />

                  {/* Talent count */}
                  <div
                    className="mt-2 text-sm uppercase tracking-widest transition-all duration-500 ease-in-out"
                    style={{
                      opacity: hoveredDirectory ? 1 : 0,
                      transform: hoveredDirectory
                        ? "translateY(0)"
                        : "translateY(-10px)",
                      color: hoveredDirectory ? "white" : "black",
                    }}
                  >
                    {totalTalentCount}{" "}
                    {totalTalentCount === 1 ? "TALENT" : "TALENTS"} TOTAL
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error boundary
export function ErrorBoundary() {
  return (
    <div className="modeling-container py-12">
      <ErrorDisplay
        title="Error Loading Boards"
        message="We couldn't load the boards. Please try again later."
      />
    </div>
  );
}

// Loading state
export function HydrateFallback() {
  return (
    <div className="modeling-container py-12">
      <LoadingState message="Loading boards..." />
    </div>
  );
}
