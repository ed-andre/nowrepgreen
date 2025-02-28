import { useState, useEffect, useRef } from "react";

import { useNavigate, useLocation, useLoaderData } from "react-router";

import { AgencyHeader, SidebarMenu } from "~/components/modeling";
import { getBoards } from "~/models/boards.server";
import { generateGradientForBoard } from "~/utils/gradients";

export async function loader() {
  const allBoards = await getBoards();

  // Sort boards alphabetically by title
  const sortedAllBoards = allBoards.sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  return {
    allBoards: sortedAllBoards,
  };
}

// Define keywords that will have hover effects
const accentedWords = [
  { id: "vision", text: "vision", color: "#3a1c71" },
  { id: "creativity", text: "creativity", color: "#d76d77" },
  { id: "talent", text: "talent", color: "#ffaf7b" },
  { id: "identity", text: "identity", color: "#4776E6" },
  { id: "innovation", text: "innovation", color: "#8E54E9" },
  { id: "storytelling", text: "storytelling", color: "#2F80ED" },
  { id: "authenticity", text: "authenticity", color: "#56CCF2" },
  { id: "transformation", text: "transformation", color: "#20BF55" },
  { id: "connection", text: "connection", color: "#01BAEF" },
];

export default function AboutUs() {
  const { allBoards } = useLoaderData<typeof loader>();
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fade in effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

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

  // Handle word hover
  const handleWordHover = (wordId: string | null) => {
    setHoveredWord(wordId);
  };

  // Update background when hovered word changes
  useEffect(() => {
    if (hoveredWord && bgRef.current) {
      const word = accentedWords.find((w) => w.id === hoveredWord);
      if (word) {
        bgRef.current.style.background = `linear-gradient(135deg, ${word.color} 0%, #121212 70%)`;
        bgRef.current.style.opacity = "1";
      }
    } else if (bgRef.current) {
      bgRef.current.style.background =
        "linear-gradient(135deg, #121212 0%, #121212 100%)";
      bgRef.current.style.opacity = "1";
    }
  }, [hoveredWord]);

  // Create a component for accented words with hover effect
  const AccentedWord = ({ id, text }: { id: string; text: string }) => (
    <span
      className="relative inline-block cursor-pointer font-semibold"
      onMouseEnter={() => handleWordHover(id)}
      onMouseLeave={() => handleWordHover(null)}
      style={{
        color: hoveredWord === id ? "white" : "inherit",
        transition: "all 0.5s ease",
        transform: hoveredWord === id ? "scale(1.1)" : "scale(1)",
        display: "inline-block",
      }}
    >
      {text}
      <span
        className="absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300"
        style={{
          background: hoveredWord === id ? "white" : "#666",
          width: hoveredWord === id ? "100%" : "0%",
          opacity: hoveredWord === id ? 1 : 0,
        }}
      />
    </span>
  );

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        opacity: isPageVisible ? 1 : 0,
        transition: "opacity 500ms ease-in-out",
      }}
    >
      {/* Background with gradient that changes on hover */}
      <div
        ref={bgRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0 transition-all duration-1000"
        style={{
          background: "linear-gradient(135deg, #121212 0%, #121212 100%)",
        }}
      />

      {/* Header - Explicitly set to white text */}
      <div className="sticky top-0 z-50 w-full">
        <AgencyHeader
          isTransparent={true}
          textColor="white"
          showMobileMenu={true}
          currentPath={location.pathname}
          handleNavigation={handleNavigation}
        />
      </div>

      {/* Main content */}
      <div className="flex-grow flex flex-col md:flex-row w-full relative z-10">
        {/* Sidebar - Custom styling for white text */}
        <div className="md:w-64 flex-shrink-0 md:fixed md:left-0 md:top-24 md:h-[calc(100vh-6rem)] md:overflow-y-auto px-6 md:py-4 md:box-border overflow-x-hidden text-white">
          <SidebarMenu
            boards={allBoards}
            currentPath={location.pathname}
            handleNavigation={handleNavigation}
          />

          {/* Custom styles for sidebar menu on this page */}
          <style>{`
            .sidebar-menu-container .menu-link {
              color: rgba(255, 255, 255, 0.7) !important;
            }

            .sidebar-menu-container .menu-link:hover {
              color: white !important;
            }

            .sidebar-menu-container .text-black {
              color: white !important;
            }

            .sidebar-menu-container .text-gray-500 {
              color: rgba(255, 255, 255, 0.7) !important;
            }
          `}</style>
        </div>

        {/* Main content area */}
        <div className="flex-grow flex flex-col md:ml-64 px-6 md:px-16 text-white">
          <div className="w-full max-w-5xl mx-auto py-16 md:py-24">
            {/* Creative text layout */}
            <div
              className="opacity-0 mb-16"
              style={{
                animation: isPageVisible
                  ? "fadeIn 1s ease forwards 0.3s"
                  : "none",
              }}
            >
              <p
                className="text-6xl md:text-8xl font-black mb-12 leading-tight tracking-tight"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  background: "linear-gradient(to right, #fff, #666)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Beyond Representation
              </p>
            </div>

            {/* Main content with interactive words */}
            <div
              className="space-y-12 opacity-0"
              style={{
                animation: isPageVisible
                  ? "fadeIn 1s ease forwards 0.6s"
                  : "none",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              <p className="text-2xl md:text-3xl leading-relaxed">
                At NowRep, we believe that true{" "}
                <AccentedWord id="vision" text="vision" /> transcends the
                ordinary. We're not just another agency—we're architects of{" "}
                <AccentedWord id="identity" text="identity" />, curators of{" "}
                <AccentedWord id="talent" text="talent" />, and pioneers of
                cultural evolution. Our collective exists at the intersection of
                art and commerce, where{" "}
                <AccentedWord id="creativity" text="creativity" /> meets
                purpose.
              </p>

              <p className="text-2xl md:text-3xl leading-relaxed">
                We cultivate a constellation of unique voices that challenge
                conventions and redefine boundaries. Through{" "}
                <AccentedWord id="storytelling" text="storytelling" /> and{" "}
                <AccentedWord id="innovation" text="innovation" />, our talents
                don't just participate in culture—they shape it, transform it,
                and propel it forward into unexplored territories.
              </p>

              <p className="text-2xl md:text-3xl leading-relaxed">
                Our approach is built on{" "}
                <AccentedWord id="authenticity" text="authenticity" /> and
                meaningful <AccentedWord id="connection" text="connection" />.
                We nurture each talent's distinctive essence while creating
                bridges between visionary brands and audiences hungry for
                substance. This symbiotic relationship fuels a cycle of{" "}
                <AccentedWord id="transformation" text="transformation" /> that
                resonates across industries and transcends conventional
                boundaries.
              </p>

              <p className="text-2xl md:text-3xl leading-relaxed">
                In a world of fleeting trends, we stand for enduring impact. Our
                collective brings together diverse perspectives, experiences,
                and expressions—creating a tapestry of voices that speaks to the
                complexity and beauty of human experience. This is more than
                representation; this is cultural alchemy.
              </p>
            </div>

            {/* Manifesto-style statement */}
            <div
              className="mt-24 opacity-0"
              style={{
                animation: isPageVisible
                  ? "fadeIn 1s ease forwards 0.9s"
                  : "none",
              }}
            >
              <p
                className="text-xl md:text-2xl italic text-center"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                "We don't follow the zeitgeist. We create it."
              </p>
            </div>

            {/* Social links */}
            <div
              className="mt-24 opacity-0 flex justify-center"
              style={{
                animation: isPageVisible
                  ? "fadeIn 1s ease forwards 1.2s"
                  : "none",
              }}
            >
              <div className="flex space-x-8 text-lg">
                <button className="text-gray-400 hover:text-white transition-colors duration-300">
                  Instagram
                </button>
                <button className="text-gray-400 hover:text-white transition-colors duration-300">
                  Twitter
                </button>
                <button className="text-gray-400 hover:text-white transition-colors duration-300">
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Sticky header styles */
        header {
          backdrop-filter: blur(5px);
          background-color: transparent !important;
          transition: all 0.3s ease;
        }

        /* Override menu colors for this page */
        .main-menu a, .secondary-links a {
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .main-menu a:hover, .secondary-links a:hover {
          color: white !important;
        }

        /* Ensure header text is white */
        header h1 {
          color: white !important;
        }
      `}</style>
    </div>
  );
}
