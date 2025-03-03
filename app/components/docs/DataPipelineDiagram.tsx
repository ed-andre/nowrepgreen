import { useState, useEffect } from "react";

interface DataPipelineDiagramProps {
  title?: string;
  description?: string;
  className?: string;
}

export function DataPipelineDiagram({
  title,
  description,
  className = "",
}: DataPipelineDiagramProps) {
  const [ClientComponent, setClientComponent] =
    useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only import the component on the client side
    import("./ClientDataPipelineDiagram")
      .then((module) => {
        setClientComponent(() => module.default);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load DataPipelineDiagram component:", err);
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