import { useEffect, useState, useRef } from "react";

import { type LoaderFunctionArgs } from "react-router";
import {
  useLoaderData,
  useParams,
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router";

import {
  LoadingState,
  ErrorDisplay,
  SidebarMenu,
  AgencyHeader,
  TalentCard,
  TalentProfile,
  TalentSidebar,
} from "~/components/modeling";
import { prisma } from "~/db.server";
import { getBoardBySlug, getBoards } from "~/models/boards.server";
import {
  getTalentPortfolios,
  getPortfolioMedia,
} from "~/models/portfolios.server";
import {
  getTalentsByBoardId,
  getTalentWithDetails,
} from "~/models/talents.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { boardSlug } = params;
  const url = new URL(request.url);
  const talentId = url.searchParams.get("talent");
  const portfolioId = url.searchParams.get("portfolio");

  if (!boardSlug) {
    throw new Response("Board slug is required", { status: 400 });
  }

  // Get all boards for the sidebar menu
  const allBoards = await getBoards();

  const board = await getBoardBySlug(boardSlug);

  if (!board) {
    throw new Response("Board not found", { status: 404 });
  }

  // Get models with their measurements
  const models = await getTalentsByBoardId(board.id);

  // If a talent ID is provided, get the talent details
  let talent = null;
  let boardPortfolio = null;
  let boardPortfolioMedia = null;
  let nonDefaultPortfolios = null;

  if (talentId) {
    try {
      // Get talent basic info and measurements
      talent = await getTalentWithDetails(talentId);

      if (!talent) {
        throw new Response("Talent not found", { status: 404 });
      }

      // Verify that the talent belongs to this board
      const boardTalentRelation = await prisma.boardsTalents_current.findFirst({
        where: {
          talentId,
          boardId: board.id,
        },
      });

      if (!boardTalentRelation) {
        throw new Response("Talent not found in this board", { status: 404 });
      }

      // Get all non-default portfolios for the sidebar
      nonDefaultPortfolios = await getTalentPortfolios(talentId, {
        onlyNonDefault: true,
      });

      // If a specific portfolio ID is provided, use that
      if (portfolioId) {
        // Get the specific portfolio
        const portfolios = await getTalentPortfolios(talentId);
        boardPortfolio = portfolios.find((p) => p.id === portfolioId) || null;

        if (boardPortfolio) {
          // Get the media items for this portfolio
          boardPortfolioMedia = await getPortfolioMedia(boardPortfolio.id);
        } else {
          throw new Response("Portfolio not found", { status: 404 });
        }
      } else {
        // No specific portfolio ID provided, prioritize in this order:
        // 1. Default portfolio
        // 2. Board-specific portfolio
        // 3. Any available portfolio

        // First, try to get the default portfolio
        const defaultPortfolios = await getTalentPortfolios(talentId, {
          onlyDefault: true,
        });

        if (defaultPortfolios.length > 0) {
          // Use the default portfolio
          boardPortfolio = defaultPortfolios[0];
          boardPortfolioMedia = await getPortfolioMedia(boardPortfolio.id);
        } else {
          // No default portfolio, check for board-specific portfolio
          const boardPortfolioRelation =
            await prisma.boardsPortfolios_current.findFirst({
              where: {
                talentId,
                boardId: board.id,
              },
            });

          if (boardPortfolioRelation) {
            // Get the portfolio details
            const portfolios = await getTalentPortfolios(talentId);
            boardPortfolio =
              portfolios.find(
                (p) => p.id === boardPortfolioRelation.portfolioId,
              ) || null;

            if (boardPortfolio) {
              // Get the media items for this portfolio
              boardPortfolioMedia = await getPortfolioMedia(boardPortfolio.id);
            }
          } else {
            // No board-specific portfolio, get any available portfolio
            const allPortfolios = await getTalentPortfolios(talentId);

            if (allPortfolios.length > 0) {
              boardPortfolio = allPortfolios[0];
              boardPortfolioMedia = await getPortfolioMedia(boardPortfolio.id);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading talent details:", error);
      // Don't throw here, just return null for talent details
      // This allows the board to still load even if talent details fail
    }
  }

  return {
    board,
    models,
    allBoards,
    talent,
    boardPortfolio,
    boardPortfolioMedia,
    nonDefaultPortfolios,
  };
};

export default function BoardDetail() {
  const {
    board,
    models,
    allBoards,
    talent,
    boardPortfolio,
    boardPortfolioMedia,
    nonDefaultPortfolios,
  } = useLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useSearchParams();
  const talentId = searchParams.get("talent");
  const portfolioId = searchParams.get("portfolio");
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "profile">(
    talentId ? "profile" : "grid",
  );
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const prevTalentIdRef = useRef<string | null>(talentId);
  const prevPortfolioIdRef = useRef<string | null>(portfolioId);
  const navigate = useNavigate();
  const location = useLocation();
  const currentBoardSlug = board.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  // Handle URL parameter changes
  useEffect(() => {
    const currentTalentId = talentId;
    const prevTalentId = prevTalentIdRef.current;
    const currentPortfolioId = portfolioId;
    const prevPortfolioId = prevPortfolioIdRef.current;

    // Reset loading states when talent or portfolio changes
    if (
      currentTalentId !== prevTalentId ||
      currentPortfolioId !== prevPortfolioId
    ) {
      setImagesLoaded(false);
      setContentReady(false);

      // Start transition
      setIsTransitioning(true);
      setIsPageVisible(false);

      // After fade out, update view mode
      const timer = setTimeout(() => {
        setViewMode(currentTalentId ? "profile" : "grid");

        // After view mode is updated, prepare content before showing
        setTimeout(() => {
          // Mark content as ready, but keep overlay until images load
          setContentReady(true);

          // If we're going back to grid view, we can fade in immediately
          // For profile view, we'll wait for images to load
          if (!currentTalentId) {
            setIsPageVisible(true);
            setIsTransitioning(false);
          }
        }, 100);
      }, 300);

      prevTalentIdRef.current = currentTalentId;
      prevPortfolioIdRef.current = currentPortfolioId;
      return () => clearTimeout(timer);
    }
  }, [talentId, portfolioId]);

  // Handle images loaded event
  useEffect(() => {
    if (contentReady && (imagesLoaded || viewMode === "grid")) {
      // Small delay to ensure everything is rendered
      const timer = setTimeout(() => {
        setIsPageVisible(true);
        setIsTransitioning(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [contentReady, imagesLoaded, viewMode]);

  // Preload images when in profile view
  useEffect(() => {
    if (viewMode === "profile" && talent && boardPortfolioMedia) {
      // Create an array of image URLs to preload
      const imagesToPreload = [
        talent.profileImage,
        ...boardPortfolioMedia
          .filter((item) => item.type.toLowerCase() === "image" && item.url)
          .map((item) => item.url as string),
      ].filter(Boolean) as string[];

      if (imagesToPreload.length === 0) {
        // No images to preload, mark as loaded
        setImagesLoaded(true);
        return;
      }

      let loadedCount = 0;
      const totalImages = imagesToPreload.length;

      // Preload each image
      imagesToPreload.forEach((url) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
        img.src = url;
      });

      // Fallback in case images take too long
      const fallbackTimer = setTimeout(() => {
        setImagesLoaded(true);
      }, 3000);

      return () => clearTimeout(fallbackTimer);
    } else if (viewMode === "grid") {
      // For grid view, we don't wait for images
      setImagesLoaded(true);
    }
  }, [viewMode, talent, boardPortfolioMedia]);

  // Handle navigation to another page
  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    e.preventDefault();
    navigate(path);
  };

  // Handle talent selection
  const handleTalentSelect = (
    e: React.MouseEvent<HTMLAnchorElement>,
    selectedTalentId: string,
  ) => {
    e.preventDefault();
    setSearchParams({ talent: selectedTalentId });
  };

  // Handle portfolio selection
  const handlePortfolioSelect = (
    e: React.MouseEvent<HTMLButtonElement>,
    portfolioId: string,
  ) => {
    e.preventDefault();
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("portfolio", portfolioId);
      return newParams;
    });
  };

  // Handle back to default portfolio
  const handleBackToDefaultPortfolio = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("portfolio");
      return newParams;
    });
  };

  // Handle back to board (clear talent selection)
  const handleBackToBoard = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSearchParams({});
  };

  // Check if we're viewing a non-default portfolio
  const isViewingNonDefaultPortfolio = !!portfolioId;

  return (
    <div className="min-h-screen bg-white relative">
      {/* Main content with fade transition */}
      <div
        className="min-h-screen transition-opacity duration-300 ease-in-out flex flex-col"
        style={{ opacity: isPageVisible ? 1 : 0 }}
      >
        {/* fixed at the top */}
        <div className="sticky top-0 z-50">
          <AgencyHeader
            handleNavigation={handleNavigation}
            isTransparent={viewMode === "profile"}
          />
        </div>

        <div className="flex flex-col md:flex-row w-full px-6 md:px-12 md:pr-28 flex-1">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0 md:sticky md:top-24 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto">
            <SidebarMenu
              boards={allBoards}
              currentBoardSlug={currentBoardSlug}
              handleNavigation={handleNavigation}
              currentPath={location.pathname}
            />

            {/* If a talent is selected, show talent sidebar */}
            {viewMode === "profile" && talent && (
              <TalentSidebar
                talent={talent}
                board={board}
                allBoards={allBoards}
                currentBoardSlug={currentBoardSlug}
                handleNavigation={handleBackToBoard}
                nonDefaultPortfolios={nonDefaultPortfolios || []}
                currentPortfolioId={portfolioId}
                handlePortfolioSelect={handlePortfolioSelect}
                handleBackToDefaultPortfolio={handleBackToDefaultPortfolio}
              />
            )}
          </div>

          {/* Main content - either talent profile or model grid */}
          {viewMode === "profile" && talent ? (
            <TalentProfile
              talent={talent}
              board={board}
              boardPortfolio={boardPortfolio}
              boardPortfolioMedia={boardPortfolioMedia || []}
              currentBoardSlug={currentBoardSlug}
              handleNavigation={handleNavigation}
              onImagesLoaded={() => setImagesLoaded(true)}
              showBioAndHero={!isViewingNonDefaultPortfolio}
              portfolioTitle={boardPortfolio?.title}
            />
          ) : (
            <div className="flex-1 py-4 md:py-6 overflow-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {models.map((model) => (
                  <Link
                    key={model.id}
                    to={`/modeling/boards/${currentBoardSlug}?talent=${model.id}`}
                    className="block cursor-pointer"
                  >
                    <TalentCard
                      talent={model}
                      boardSlug={currentBoardSlug}
                      handleNavigation={handleNavigation}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay during transitions */}
      {(isTransitioning ||
        !contentReady ||
        (viewMode === "profile" && !imagesLoaded)) && (
        <div
          className="fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out pointer-events-none"
          style={{
            opacity: isPageVisible ? 0 : 1,
            pointerEvents: isPageVisible ? "none" : "auto",
          }}
        >
          <div className="text-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-gray-900 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 font-light">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Error boundary
export function ErrorBoundary() {
  const { boardSlug } = useParams();
  // Format the slug for display
  const displayName = boardSlug ? boardSlug.replace(/-/g, " ") : "";

  return (
    <div className="modeling-container py-12">
      <ErrorDisplay
        title="Error Loading Board"
        message={`We couldn't load the board "${displayName}". Please try again later.`}
      />
    </div>
  );
}

// Loading state
export function HydrateFallback() {
  return (
    <div className="modeling-container py-12">
      <LoadingState message="Loading models..." />
    </div>
  );
}
