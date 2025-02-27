export interface ErrorDisplayProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorDisplay({
  title = "Error",
  message,
  retry,
}: ErrorDisplayProps) {
  return (
    <div className="modeling-error">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="mb-4">{message}</p>

      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
