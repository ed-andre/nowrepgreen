import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";

export interface SystemNodeProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  position: "left" | "center" | "right";
  type: "source" | "process" | "target" | "validation";
  id: string;
  connections?: string[];
}

interface SystemDiagramProps {
  title?: string;
  description?: string;
  nodes: SystemNodeProps[];
  className?: string;
  interactive?: boolean;
}

function SystemNode({
  title,
  description,
  icon,
  position,
  type,
  id,
  isActive = false,
  onClick,
}: SystemNodeProps & { isActive?: boolean; onClick?: () => void }) {
  const typeClasses = {
    source: "bg-blue-50 border-blue-200 text-blue-700",
    process: "bg-amber-50 border-amber-200 text-amber-700",
    target: "bg-emerald-50 border-emerald-200 text-emerald-700",
    validation: "bg-purple-50 border-purple-200 text-purple-700",
  };

  return (
    <button
      id={id}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
      tabIndex={0}
      aria-label={`${title} node`}
      className={`relative border-2 rounded-lg p-4 ${typeClasses[type]} max-w-xs mx-auto transition-all duration-300 hover:shadow-md ${isActive ? "ring-2 ring-offset-2 ring-blue-400" : ""} text-left w-full`}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <h4 className="font-semibold">{title}</h4>
      </div>
      {description && <p className="text-sm opacity-90">{description}</p>}
    </button>
  );
}

export function SystemDiagram({
  title,
  description,
  nodes,
  className = "",
  interactive = true,
}: SystemDiagramProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [paths, setPaths] = useState<React.ReactElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Group nodes by position
  const leftNodes = nodes.filter((node) => node.position === "left");
  const centerNodes = nodes.filter((node) => node.position === "center");
  const rightNodes = nodes.filter((node) => node.position === "right");

  // Add default connections if not provided
  const nodesWithConnections = nodes.map((node, index) => {
    if (node.connections) return node;

    // Default connection logic based on position
    let connections: string[] = [];

    if (node.position === "left") {
      // Left nodes connect to first center node if available
      const firstCenterNode = centerNodes[0];
      if (firstCenterNode) connections = [firstCenterNode.id];
    } else if (node.position === "center") {
      // Center nodes connect to right nodes or next center node
      const rightNode = rightNodes[Math.min(index, rightNodes.length - 1)];
      const nextCenterNode = centerNodes[index + 1];

      if (rightNode) connections.push(rightNode.id);
      if (nextCenterNode) connections.push(nextCenterNode.id);
    }

    return { ...node, connections };
  });

  // Calculate connection paths
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const newPaths: React.ReactElement[] = [];
      const nodeElements: Record<string, DOMRect | null> = {};

      // Get node positions
      nodesWithConnections.forEach((node) => {
        const element = document.getElementById(node.id);
        if (element) {
          nodeElements[node.id] = element.getBoundingClientRect();
        }
      });

      // Create SVG container dimensions
      const svgContainer = containerRef.current;
      if (!svgContainer) return;

      const containerRect = svgContainer.getBoundingClientRect();

      nodesWithConnections.forEach((node) => {
        if (node.connections && node.connections.length > 0) {
          node.connections.forEach((targetId, connIndex) => {
            const targetNode = nodesWithConnections.find(
              (n) => n.id === targetId,
            );
            if (targetNode && nodeElements[node.id] && nodeElements[targetId]) {
              const sourceRect = nodeElements[node.id]!;
              const targetRect = nodeElements[targetId]!;

              // Calculate source and target points relative to SVG container
              const sourceX =
                sourceRect.left + sourceRect.width / 2 - containerRect.left;
              const sourceY =
                sourceRect.top + sourceRect.height / 2 - containerRect.top;
              const targetX = targetRect.left - containerRect.left;
              const targetY =
                targetRect.top + targetRect.height / 2 - containerRect.top;

              // Create curved path
              const isActive =
                activeNode === node.id || activeNode === targetId;
              const controlPointX = (sourceX + targetX) / 2;
              const controlPointY = sourceY + connIndex * 20; // Offset for multiple connections

              const path = `M ${sourceX},${sourceY} C ${controlPointX},${controlPointY} ${controlPointX},${targetY} ${targetX},${targetY}`;

              newPaths.push(
                <path
                  key={`${node.id}-${targetId}`}
                  d={path}
                  stroke={isActive ? "#0ea5e9" : "#94a3b8"}
                  strokeWidth={isActive ? "2.5" : "1.5"}
                  strokeDasharray={isActive ? "none" : "4 2"}
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className="transition-all duration-300"
                />,
              );
            }
          });
        }
      });

      setPaths(newPaths);
    }, 500); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, [nodesWithConnections, activeNode]);

  return (
    <div className={`${className}`}>
      {title && (
        <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      )}
      {description && (
        <p className="text-gray-600 mb-6 text-center max-w-2xl mx-auto">
          {description}
        </p>
      )}

      <div className="relative" style={{ minHeight: "500px" }}>
        <div
          ref={containerRef}
          id="svg-container"
          className="absolute inset-0 pointer-events-none"
        >
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
            </defs>
            <g>{paths}</g>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {/* Left column */}
          <div className="space-y-8">
            {leftNodes.map((node, index) => (
              <div
                key={`left-${index}`}
                onMouseEnter={
                  interactive ? () => setActiveNode(node.id) : undefined
                }
                onMouseLeave={
                  interactive ? () => setActiveNode(null) : undefined
                }
                className="transition-transform duration-300 hover:scale-105"
              >
                <SystemNode {...node} isActive={activeNode === node.id} />
              </div>
            ))}
          </div>

          {/* Center column */}
          <div className="space-y-8">
            {centerNodes.map((node, index) => (
              <div
                key={`center-${index}`}
                onMouseEnter={
                  interactive ? () => setActiveNode(node.id) : undefined
                }
                onMouseLeave={
                  interactive ? () => setActiveNode(null) : undefined
                }
                className="transition-transform duration-300 hover:scale-105"
              >
                <SystemNode {...node} isActive={activeNode === node.id} />
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {rightNodes.map((node, index) => (
              <div
                key={`right-${index}`}
                onMouseEnter={
                  interactive ? () => setActiveNode(node.id) : undefined
                }
                onMouseLeave={
                  interactive ? () => setActiveNode(null) : undefined
                }
                className="transition-transform duration-300 hover:scale-105"
              >
                <SystemNode {...node} isActive={activeNode === node.id} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded-sm"></div>
          <span className="text-sm text-gray-600">Source</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-sm"></div>
          <span className="text-sm text-gray-600">Process</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded-sm"></div>
          <span className="text-sm text-gray-600">Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded-sm"></div>
          <span className="text-sm text-gray-600">Validation</span>
        </div>
      </div>
    </div>
  );
}
