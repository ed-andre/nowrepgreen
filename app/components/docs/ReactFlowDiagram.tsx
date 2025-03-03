import { useState, useEffect } from "react";
import type { ReactNode } from "react";

// Define interfaces
interface ReactFlowDiagramProps {
  title?: string;
  description?: string;
  className?: string;
}

// Custom node components (these will be used by the client component)
function SourceNode({
  data,
}: {
  data: { label: string; description?: string; icon?: ReactNode };
}) {
  return (
    <div className="px-4 py-3 shadow-md rounded-md border-2 border-blue-200 bg-blue-50 text-blue-700 w-[200px]">
      <div className="flex items-center gap-2 mb-1">
        {data.icon && <div className="flex-shrink-0">{data.icon}</div>}
        <div className="font-semibold">{data.label}</div>
      </div>
      {data.description && (
        <div className="text-xs opacity-80">{data.description}</div>
      )}
    </div>
  );
}

function ProcessNode({
  data,
}: {
  data: { label: string; description?: string; icon?: ReactNode };
}) {
  return (
    <div className="px-4 py-3 shadow-md rounded-md border-2 border-amber-200 bg-amber-50 text-amber-700 w-[200px]">
      <div className="flex items-center gap-2 mb-1">
        {data.icon && <div className="flex-shrink-0">{data.icon}</div>}
        <div className="font-semibold">{data.label}</div>
      </div>
      {data.description && (
        <div className="text-xs opacity-80">{data.description}</div>
      )}
    </div>
  );
}

function TargetNode({
  data,
}: {
  data: { label: string; description?: string; icon?: ReactNode };
}) {
  return (
    <div className="px-4 py-3 shadow-md rounded-md border-2 border-emerald-200 bg-emerald-50 text-emerald-700 w-[200px]">
      <div className="flex items-center gap-2 mb-1">
        {data.icon && <div className="flex-shrink-0">{data.icon}</div>}
        <div className="font-semibold">{data.label}</div>
      </div>
      {data.description && (
        <div className="text-xs opacity-80">{data.description}</div>
      )}
    </div>
  );
}

function ValidationNode({
  data,
}: {
  data: { label: string; description?: string; icon?: ReactNode };
}) {
  return (
    <div className="px-4 py-3 shadow-md rounded-md border-2 border-purple-200 bg-purple-50 text-purple-700 w-[200px]">
      <div className="flex items-center gap-2 mb-1">
        {data.icon && <div className="flex-shrink-0">{data.icon}</div>}
        <div className="font-semibold">{data.label}</div>
      </div>
      {data.description && (
        <div className="text-xs opacity-80">{data.description}</div>
      )}
    </div>
  );
}

// Main component
export function ReactFlowDiagram({
  title,
  description,
  className = "",
}: ReactFlowDiagramProps) {
  const [ClientComponent, setClientComponent] =
    useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only import the component on the client side
    import("./ClientReactFlowDiagram")
      .then((module) => {
        setClientComponent(() => module.default);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load ReactFlow component:", err);
        setLoading(false);
      });
  }, []);

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

      {loading || !ClientComponent ? (
        <div
          style={{ height: 600 }}
          className="border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
        >
          <div className="text-gray-400">Loading interactive diagram...</div>
        </div>
      ) : (
        <ClientComponent className={className} />
      )}
    </div>
  );
}
