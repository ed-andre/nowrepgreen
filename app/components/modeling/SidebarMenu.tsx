import { Link } from "react-router";

import { MenuList } from "./MenuList";

interface SidebarMenuProps {
  boards: Array<{
    id: string;
    title: string;
  }>;
  currentBoardSlug?: string;
  currentPath?: string;
  handleNavigation: (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => void;
}

export function SidebarMenu({
  boards,
  currentBoardSlug,
  currentPath = "",
  handleNavigation,
}: SidebarMenuProps) {
  return (
    <div className="w-full md:w-full sidebar-menu-container overflow-hidden">
      <nav className="pt-2">
        {/* Boards navigation with minimal styling */}
        <div className="mb-8 main-menu">
          <ul className="space-y-3 ml-3">
            {boards.map((board) => {
              const boardSlug = board.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
              return (
                <li key={board.id}>
                  <Link
                    to={`/modeling/boards/${boardSlug}`}
                    className={`menu-link text-xs uppercase tracking-wider ${
                      boardSlug === currentBoardSlug
                        ? "text-black font-medium"
                        : "text-gray-500 hover:text-black transition-colors"
                    }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {board.title}
                  </Link>
                </li>
              );
            })}

            {/* All Talents link with the boards */}
            <li className="all-talents-item">
              <Link
                to="/modeling/talents"
                onClick={(e) => handleNavigation(e, "/modeling/talents")}
                className={`menu-link text-xs uppercase tracking-wider ${
                  currentPath === "/modeling/talents"
                    ? "text-black font-medium"
                    : "text-gray-500 hover:text-black transition-colors"
                }`}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                All Talents
              </Link>
            </li>
          </ul>
        </div>

        {/* Agency links with shared MenuList component */}
        <div className="mt-8 secondary-links">
          <MenuList
            className="space-y-3 ml-3"
            itemClassName=""
            textColor="rgba(0,0,0,0.5)"
            currentPath={currentPath}
          />
        </div>
      </nav>

      {/* Global styles for animations and layout */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .sidebar-menu-container {
          animation: fadeIn 0.8s ease forwards;
          position: relative;
        }

        .sidebar-menu-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          height: 40px;
          background-color: #000;
          opacity: 0.5;
        }

        .main-menu {
          position: relative;
        }

        .secondary-links {
          position: relative;
        }

        .menu-link {
          position: relative;
          display: inline-block;
          padding-bottom: 2px;
          letter-spacing: 0.1em;
          transition: color 0.3s ease;
        }

        .main-menu li {
          opacity: 0;
          animation: staggerFadeIn 0.5s ease forwards;
        }

        .main-menu li:nth-child(1) { animation-delay: 0.1s; }
        .main-menu li:nth-child(2) { animation-delay: 0.2s; }
        .main-menu li:nth-child(3) { animation-delay: 0.3s; }
        .main-menu li:nth-child(4) { animation-delay: 0.4s; }
        .main-menu li:nth-child(5) { animation-delay: 0.5s; }
        .main-menu li:nth-child(6) { animation-delay: 0.6s; }
        .main-menu li:nth-child(7) { animation-delay: 0.7s; }
        .main-menu li:nth-child(8) { animation-delay: 0.8s; }
        .main-menu li:nth-child(9) { animation-delay: 0.9s; }
        .main-menu li:nth-child(10) { animation-delay: 1s; }

        .all-talents-item {
          margin-top: 0.5rem;
        }

        .secondary-links li {
          opacity: 0;
          animation: staggerFadeIn 0.5s ease forwards;
        }

        .secondary-links li:nth-child(1) { animation-delay: 1.1s; }
        .secondary-links li:nth-child(2) { animation-delay: 1.2s; }
        .secondary-links li:nth-child(3) { animation-delay: 1.3s; }
        .secondary-links li:nth-child(4) { animation-delay: 1.4s; }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes staggerFadeIn {
          from {
            opacity: 0;
            transform: translateX(-5px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `,
        }}
      />
    </div>
  );
}
