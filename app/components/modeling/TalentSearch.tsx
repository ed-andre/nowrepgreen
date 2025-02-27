import { type RefObject } from "react";

interface TalentSearchProps {
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalTalents: number;
  foundTalents: number;
  hoveredTalent: string | null;
  isTyping: boolean;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  focusSearch: () => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export function TalentSearch({
  searchTerm,
  handleSearchChange,
  totalTalents,
  foundTalents,
  hoveredTalent,
  isTyping,
  isFocused,
  setIsFocused,
  focusSearch,
  searchInputRef,
}: TalentSearchProps) {
  return (
    <div className="w-full flex justify-center items-center py-8 absolute top-24 left-0 right-0 z-20">
      <div
        className={`transition-all duration-500 ease-in-out ${
          isFocused ? "scale-105" : ""
        }`}
        style={{
          width: isFocused ? "min(800px, 80vw)" : "min(700px, 80vw)",
        }}
        onClick={focusSearch}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            focusSearch();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Focus search"
      >
        <div
          className={`relative rounded-full overflow-hidden transition-all duration-500 ease-in-out ${
            isFocused ? "shadow-[0_0_25px_rgba(255,255,255,0.2)]" : ""
          }`}
          style={{
            background: hoveredTalent
              ? "rgba(30, 30, 30, 0.6)"
              : "rgba(245, 245, 245, 0.8)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${
              hoveredTalent ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"
            }`,
          }}
        >
          {/* Animated particles */}
          {isTyping && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: hoveredTalent ? "white" : "black",
                    opacity: 0.6,
                    transform: `scale(${Math.random() * 2 + 1})`,
                    animation: `particleFloat ${Math.random() * 2 + 1}s linear infinite`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Animated border */}
          <div
            className="absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out"
            style={{
              width: isFocused ? "100%" : "0%",
              background: `linear-gradient(90deg,
                ${hoveredTalent ? "rgba(255,255,255,0)" : "rgba(0,0,0,0)"} 0%,
                ${hoveredTalent ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)"} 50%,
                ${hoveredTalent ? "rgba(255,255,255,0)" : "rgba(0,0,0,0)"} 100%)`,
              opacity: isTyping ? 1 : 0.7,
              animation: isTyping
                ? "borderPulse 2s ease-in-out infinite"
                : "none",
            }}
          />

          <div className="flex items-center px-6 py-4">
            {/* Search icon with animation */}
            <div
              className={`mr-4 transition-all duration-300 ${
                isTyping ? "scale-110 rotate-45" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transition-colors duration-300 ${
                  hoveredTalent ? "text-white" : "text-gray-800"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{
                  filter: isFocused
                    ? `drop-shadow(0 0 3px ${hoveredTalent ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"})`
                    : "none",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Input field */}
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search talents..."
              className={`w-full bg-transparent focus:outline-none text-xl transition-all duration-300 ${
                hoveredTalent
                  ? "text-white placeholder-gray-400"
                  : "text-gray-800 placeholder-gray-500"
              }`}
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            />

            {/* Results counter with animation */}
            <div
              className={`ml-4 text-sm transition-all duration-300 ${
                hoveredTalent ? "text-gray-300" : "text-gray-600"
              } ${searchTerm ? "opacity-100" : "opacity-0"}`}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                transform: isTyping ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              {foundTalents}/{totalTalents}
            </div>
          </div>
        </div>

        {/* Animated hint text */}
        <div
          className={`text-center mt-3 text-xs uppercase tracking-widest transition-all duration-500 ${
            isFocused ? "opacity-100" : "opacity-0"
          } ${hoveredTalent ? "text-gray-400" : "text-gray-500"}`}
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {isTyping ? "Searching..." : "Type to search across all talents"}
        </div>
      </div>
    </div>
  );
}

// Export CSS animations to be used in the parent component
export const searchAnimations = `
  @keyframes borderPulse {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
  }

  @keyframes particleFloat {
    0% { transform: translateY(0) scale(1); opacity: 0.6; }
    100% { transform: translateY(-20px) scale(0); opacity: 0; }
  }
`;
