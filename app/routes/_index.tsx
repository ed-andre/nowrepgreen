import { ChevronRight, MoveRight, RefreshCw } from "lucide-react";
import { Link } from "react-router";

import {
  DocHero,
  DocSection,
  FeatureCard,
  SystemDiagram,
  ReactFlowDiagram,
  CodeExample,
  DataPipelineDiagram,
} from "~/components/docs";

export function meta() {
  return [
    { title: "NowRep Suite - Modern Agency Management Platform" },
    {
      name: "description",
      content:
        "A comprehensive suite of applications for modern agency management, portfolio showcasing, and reporting.",
    },
  ];
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Main Hero */}
      <DocHero
        title="NowRep Suite"
        subtitle="A comprehensive platform for modern agency management, portfolio showcasing, and reporting"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        }
      />

      {/* Introduction */}
      <div className="mb-12 text-lg text-gray-700 max-w-6xl">
        <p>
          The NowRep Suite is a collection of integrated applications designed
          to streamline agency operations, showcase talent portfolios, and
          provide comprehensive reporting. Each component serves a specific
          purpose while maintaining seamless data flow between systems.
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="relative">
          <Link
            to="#nowrepgreen"
            className="block bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold mb-2">NowRepGreen</h3>
            <p className="text-white/90">
              Portfolio platform for showcasing talent and media
            </p>
          </Link>
          <a
            href="https://github.com/Edmaximus/nowrepgreen"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 right-2 p-2 text-white/90 hover:text-white transition-colors"
            aria-label="View NowRepGreen on GitHub"
          >
            {/* GitHub logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
        </div>
        <Link
          to="#nowrepblue"
          className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-bold mb-2">NowRepBlue</h3>
          <p className="text-white/90">
            Administrative system for talent and portfolio management
          </p>
        </Link>
        <Link
          to="#nowrepyellow"
          className="bg-gradient-to-br from-amber-500 to-yellow-400 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-bold mb-2">NowRepYellow</h3>
          <p className="text-white/90">
            Reporting layer for analytics and insights with Metabase and Evidence.dev
          </p>
        </Link>
      </div>

      {/* NowRepGreen Section */}
      <DocSection
        id="nowrepgreen"
        title="NowRepGreen"
        description="The public-facing portfolio platform showcasing agency talent and media to potential clients."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Overview
            </h3>
            <p className="text-gray-600 mb-4">
              NowRepGreen provides a beautiful, performant interface for
              showcasing agency talent and portfolios. It's designed to be
              visually stunning while maintaining excellent performance across
              all devices.
            </p>
            <p className="text-gray-600">
              The platform includes a fully functional modeling agency portfolio
              site that demonstrates the capabilities of the NowRep suite,
              featuring interactive navigation, talent directories, and media
              galleries.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Tech Stack
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>React Router with TypeScript</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>TailwindCSS for styling</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>Prisma ORM with SQLite</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>Vitest for unit and integration testing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>
                  Trigger.dev for data sync and event-driven automation
                </span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Key Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <FeatureCard
            title="Interactive Homepage"
            description="Dynamic board navigation with hover effects and smooth transitions"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            }
          />
          <FeatureCard
            title="Talent Directory"
            description="Searchable talent listings organized by board categories"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            }
          />
          <FeatureCard
            title="Media Galleries"
            description="Beautiful portfolio displays with optimized image loading"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            }
          />
        </div>

        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Data Synchronization Architecture
        </h3>
        <p className="text-gray-600 mb-6">
          NowRepGreen implements an API-driven data synchronization system
          designed for reliability and zero-downtime updates. The architecture
          ensures consistent data presentation across all views while
          maintaining high performance.
        </p>

        {/* React Flow Diagram (modern, interactive) */}
        <div className="hidden md:block">
          <ReactFlowDiagram
            title="Data Flow"
            description="The synchronization process flows from NowRepBlue to NowRepGreen through a series of orchestrated tasks and API endpoints."
            className="mb-10"
          />
        </div>

        {/* Fallback for mobile or if React Flow fails to load */}
        <div className="md:hidden">
          <SystemDiagram
            title="Data Flow"
            description="The synchronization process flows from NowRepBlue to NowRepGreen through a series of orchestrated tasks and API endpoints."
            nodes={[
              {
                id: "nowrep-blue-api",
                title: "NowRepBlue API",
                description: "Source of truth for all agency data",
                position: "left",
                type: "source",
                connections: ["validation-check"],
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                ),
              },
              {
                id: "validation-check",
                title: "Boards Data Validation",
                description: "Validates if boards data exists",
                position: "center",
                type: "validation",
                connections: ["orchestration-api", "empty-data-handler"],
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ),
              },
              {
                id: "empty-data-handler",
                title: "Empty Data Handler",
                description: "Creates empty tables when no data exists",
                position: "center",
                type: "process",
                connections: ["versioned-tables"],
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                  </svg>
                ),
              },
              {
                id: "orchestration-api",
                title: "Orchestration API",
                description: "Coordinates the sync process",
                position: "center",
                type: "process",
                connections: ["trigger-dev-tasks"],
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                ),
              },
              {
                id: "trigger-dev-tasks",
                title: "Trigger.dev Tasks",
                description: "Event-driven automation",
                position: "center",
                type: "process",
                connections: ["sync-task", "transform-task"],
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                ),
              },
              {
                id: "sync-task",
                title: "Sync API Task",
                description: "Fetches data from source API",
                position: "center",
                type: "process",
                connections: ["json-stage-tables"],
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                ),
              },
              {
                id: "json-stage-tables",
                title: "JSON Stage Tables",
                description: "Raw data storage",
                position: "center",
                type: "process",
                connections: ["transform-task"],
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  </svg>
                ),
              },
              {
                id: "transform-task",
                title: "Transform API Task",
                description: "Transforms JSON to relational data",
                position: "center",
                type: "process",
                connections: ["versioned-tables"],
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v12"></path>
                    <path d="m8 11 4 4 4-4"></path>
                    <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"></path>
                  </svg>
                ),
              },
              {
                id: "versioned-tables",
                title: "Versioned Tables",
                description: "Normalized relational data",
                position: "right",
                type: "target",
                connections: ["current-views"],
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3v18h18"></path>
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                  </svg>
                ),
              },
              {
                id: "current-views",
                title: "Current Views",
                description: "Dynamic view switching for zero-downtime",
                position: "right",
                type: "target",
                connections: ["nowrep-green-app"],
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                ),
              },
              {
                id: "nowrep-green-app",
                title: "NowRepGreen App",
                description: "Public-facing portfolio site",
                position: "right",
                type: "target",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                  </svg>
                ),
              },
            ]}
            className="mb-10"
          />
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Key Architectural Features
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mt-0.5">
                ✓
              </span>
              <span>
                <strong className="text-gray-800">Zero-downtime updates</strong>{" "}
                through versioned tables and dynamic view switching
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mt-0.5">
                ✓
              </span>
              <span>
                <strong className="text-gray-800">API-driven approach</strong>{" "}
                ensures compatibility with Trigger.dev cloud environment
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mt-0.5">
                ✓
              </span>
              <span>
                <strong className="text-gray-800">
                  Comprehensive validation
                </strong>{" "}
                with empty data handling and user warnings
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mt-0.5">
                ✓
              </span>
              <span>
                <strong className="text-gray-800">Rollback capability</strong>{" "}
                with retention of previous versions
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-10 text-center">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Explore the Code
          </h3>
          <p className="text-gray-600 mb-4">
            Check out our GitHub repository for the complete source code,
            including the orchestration tasks and data synchronization
            implementation.
          </p>
          <a
            href="https://github.com/Edmaximus/nowrepgreen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md transition-colors"
          >
            {/* GitHub logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>

            <span>View on GitHub</span>
            <MoveRight className="h-5 w-5" />
          </a>
        </div>

        <div className="relative mb-10 rounded-lg overflow-hidden shadow-lg">
          <img
            src="/images/nowrepgreensamplesite.png"
            alt="NowRep Agency Portfolio Site"
            className="w-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Link
              to="/modeling"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              <span>View Sample Portfolio Site</span>
              <MoveRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </DocSection>

      {/* NowRepBlue Section */}
      <DocSection
        id="nowrepblue"
        title="NowRepBlue"
        description="The administrative system for talent and portfolio management."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Overview
            </h3>
            <p className="text-gray-600 mb-4">
              NowRepBlue is a comprehensive talent management platform designed
              to streamline and revolutionize how modeling and creative agencies
              operate. The platform provides a centralized hub for managing
              talent profiles, media assets, bookings, client interactions, and
              more.
            </p>
            <p className="text-gray-600">
              This administrative system serves as the backbone of the NowRep
              Suite, providing the data management capabilities that power the
              public-facing portfolio site and reporting tools.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Tech Stack
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>React Router 7 (Upgraded from Remix v2)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>PostgreSQL with Prisma ORM</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>TailwindCSS with Shadcn UI Components</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Tigris (S3-compatible storage) for file storage</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Trigger.dev for event-driven automation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Playwright for E2E testing, Vitest for unit testing</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Key Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <FeatureCard
            title="Talent Management"
            description="Comprehensive talent profiles with detailed information management"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            }
          />
          <FeatureCard
            title="Portfolio System"
            description="Advanced media management with external/internal portfolio support"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            }
          />
          <FeatureCard
            title="Board Management"
            description="Organize talents into boards with customizable portfolio assignments"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Testing Strategy
            </h3>
            <p className="text-gray-600 mb-4">
              NowRepBlue implements a comprehensive testing strategy with three
              layers:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong className="text-gray-800">Unit Tests</strong> for
                  individual components and functions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong className="text-gray-800">Integration Tests</strong>{" "}
                  for testing multiple components working together
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong className="text-gray-800">E2E Tests</strong> for
                  complete user flows through the UI
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Deployment
            </h3>
            <p className="text-gray-600 mb-4">
              The project uses GitHub Actions for CI/CD with deployments to
              Fly.io:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong className="text-gray-800">
                    Automated deployments
                  </strong>{" "}
                  on merge to main (production) and dev (staging)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong className="text-gray-800">
                    Multi-region support
                  </strong>{" "}
                  with health checks and region fallbacks
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong className="text-gray-800">Docker containers</strong>{" "}
                  for consistent deployment environments
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">
            Try the Admin System
          </h3>
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="text-gray-800">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 mb-6">
                  <p className="mb-2">Access Credentials:</p>
                  <code className="block bg-black/10 rounded px-3 py-2 font-mono text-sm mb-3">
                    demo@nowrep.com | rachel1scHo0l
                  </code>
                  <a
                    href="https://nowrepblue-e197-staging.fly.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <span>Access Admin System</span>
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="font-medium mb-3">To sync updated data:</p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>
                        Go to Boards and make changes to the talent assignments
                      </li>
                      <li>Click the refresh icon in the top right corner</li>
                      <li>Select "Sync Now" from the dropdown</li>
                    </ol>
                  </div>
                  <div>
                    <p className="font-medium mb-3">Data points synced:</p>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                      <li className="bg-white/60 rounded-lg px-3 py-2">
                        Boards & Assignments
                      </li>
                      <li className="bg-white/60 rounded-lg px-3 py-2">
                        Talent Profiles
                      </li>
                      <li className="bg-white/60 rounded-lg px-3 py-2">
                        Portfolios & Media
                      </li>
                      <li className="bg-white/60 rounded-lg px-3 py-2">
                        Media Tags
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 shadow-lg w-full max-w-[300px] transform transition-transform hover:scale-105">
                  <img
                    src="/images/syncdropdown.png"
                    alt="Sync dropdown interface"
                    className="w-full rounded border border-white/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mb-10 rounded-lg overflow-hidden shadow-lg">
          <img
            src="/images/nowrepblueadminsite.png"
            alt="NowRepBlue Admin System"
            className="w-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <a
              href="https://nowrepblue-e197-staging.fly.dev"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              <span>Visit Admin System</span>
              <MoveRight className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Additional Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Directory System
              </h4>
              <p className="text-gray-600">
                Manage company and contact relationships with a comprehensive
                directory system.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Modern Interface
              </h4>
              <p className="text-gray-600">
                User-friendly and responsive design across all devices for
                efficient workflow management.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Booking System (In Development)
              </h4>
              <p className="text-gray-600">
                FullCalendar integration for comprehensive scheduling
                capabilities.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Email Services (Pending Development)
              </h4>
              <p className="text-gray-600">
                Resend integration for reliable email communication with clients
                and talents.
              </p>
            </div>
          </div>
        </div>
      </DocSection>

      {/* NowRepYellow Section */}
      <DocSection
        id="nowrepyellow"
        title="NowRepYellow"
        description="The reporting layer for analytics and insights with Metabase and Evidence.dev."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Overview
            </h3>
            <p className="text-gray-600 mb-4">
              NowRepYellow is the reporting pillar of the NowRep suite that transforms raw data from NowRepBlue into actionable insights. It will implement a modern data stack with robust ELT processes and advanced analytics capabilities.
            </p>
            <p className="text-gray-600">
              The platform will provide both embedded analytics through Evidence.dev and advanced reporting via Metabase, enabling data-driven decision making across the NowRep suite.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Tech Stack
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span>Apache Airflow for data orchestration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span>dbt for data transformation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span>BigQuery as data warehouse</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span>Evidence.dev for embedded analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span>Metabase for advanced reporting</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">
            Data Pipeline Architecture (Subject to change)
          </h3>
          <p className="text-gray-600 mb-6">
            The data pipeline will follow a modern ELT architecture, with data flowing from NowRepBlue to various analytics endpoints through a series of transformations and quality checks.
          </p>

          {/* React Flow Diagram (modern, interactive) */}
          <div className="hidden md:block">
            <DataPipelineDiagram
              title="Data Flow"
              description="The data pipeline flows from NowRepBlue to analytics endpoints through a series of transformations and quality checks. This system design is subject to change throughout the development process."
              className="mb-10"
            />
          </div>

          {/* Fallback for mobile or if React Flow fails to load */}
          <div className="md:hidden">
            <SystemDiagram
              title="Data Flow"
              description="The data pipeline flows from NowRepBlue to analytics endpoints through a series of transformations and quality checks. This system design is subject to change throughout the development process."
              nodes={[
                {
                  id: "nowrep-blue-postgres",
                  title: "NowRepBlue PostgreSQL",
                  description: "Source database with agency data",
                  position: "left",
                  type: "source",
                  connections: ["airflow-dags"],
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                    </svg>
                  ),
                },
                {
                  id: "airflow-dags",
                  title: "Airflow DAGs",
                  description: "Data orchestration and scheduling",
                  position: "center",
                  type: "process",
                  connections: ["raw-data-load"],
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v20M2 12h20"></path>
                      <path d="M12 2a10 10 0 0 1 10 10"></path>
                    </svg>
                  ),
                },
                {
                  id: "raw-data-load",
                  title: "Raw Data Load",
                  description: "Initial data ingestion to BigQuery",
                  position: "center",
                  type: "process",
                  connections: ["dbt-transforms"],
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  ),
                },
                {
                  id: "dbt-transforms",
                  title: "dbt Transforms",
                  description: "Data transformation and modeling",
                  position: "center",
                  type: "process",
                  connections: ["bigquery-warehouse"],
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3v12"></path>
                      <path d="m8 11 4 4 4-4"></path>
                      <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"></path>
                    </svg>
                  ),
                },
                {
                  id: "bigquery-warehouse",
                  title: "BigQuery Warehouse",
                  description: "Transformed data for analytics",
                  position: "right",
                  type: "target",
                  connections: ["evidence-dev", "metabase"],
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3v18h18"></path>
                      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                    </svg>
                  ),
                },
                {
                  id: "evidence-dev",
                  title: "Evidence.dev",
                  description: "Embedded analytics reports",
                  position: "right",
                  type: "target",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                  ),
                },
                {
                  id: "metabase",
                  title: "Metabase",
                  description: "Advanced analytics dashboard",
                  position: "right",
                  type: "target",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                  ),
                },
              ]}
              className="mb-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Key Features
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong className="text-gray-800">Automated ETL</strong>{" "}
                  with Airflow for reliable data pipelines
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong className="text-gray-800">Data Quality</strong>{" "}
                  through dbt tests and documentation
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong className="text-gray-800">Scalable Analytics</strong>{" "}
                  with BigQuery for high-performance queries
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Development Status
            </h3>
            <p className="text-gray-600 mb-4">
              NowRepYellow is in early development phase with core infrastructure in place:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong className="text-gray-800">Infrastructure</strong>{" "}
                  setup with Docker and CI/CD
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong className="text-gray-800">Data Pipeline</strong>{" "}
                  architecture and initial models
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mt-0.5">
                  ⚡
                </span>
                <span>
                  <strong className="text-gray-800">Analytics</strong>{" "}
                  implementation in progress
                </span>
              </li>
            </ul>
          </div>
        </div>
      </DocSection>

      {/* Future Considerations Section */}
      <DocSection
        id="future"
        title="Future Considerations"
        description="Planned enhancements and features for the NowRep suite."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Enterprise Features
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mt-0.5">
                  ⚡
                </span>
                <span>
                  <strong className="text-gray-800">Multi-tenancy</strong>{" "}
                  support with isolated data and custom branding per agency
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mt-0.5">
                  ⚡
                </span>
                <span>
                  <strong className="text-gray-800">SSO and MFA Integration</strong>{" "}
                  with support for major identity providers
                </span>
              </li>

            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Platform Enhancements
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mt-0.5">
                  ⚡
                </span>
                <span>
                  <strong className="text-gray-800">Event Bus</strong>{" "}
                  for real-time updates across NowRepBlue
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mt-0.5">
                  ⚡
                </span>
                <span>
                  <strong className="text-gray-800">Accounting Integration</strong>{" "}
                  with Quickbooks/Xero for invoicing and billing
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mt-0.5">
                  ⚡
                </span>
                <span>
                  <strong className="text-gray-800">Social Media Integration</strong>{" "}
                  with Instagram for talent and organization updates
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mt-0.5">
                  ⚡
                </span>
                <span>
                  <strong className="text-gray-800">Monitoring</strong>{" "}
                  and observability with centralized logging
                </span>
              </li>
            </ul>
          </div>
        </div>
      </DocSection>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-900">
              NowRep Suite
            </h3>
            <p className="text-gray-600">Modern agency management platform</p>
          </div>
          <div className="flex gap-6">
            <a
              href="https://github.com/Edmaximus"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit GitHub Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} NowRep Suite. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
