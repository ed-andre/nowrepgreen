interface CodeExampleProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeExample({
  code,
  language = "typescript",
  title,
  showLineNumbers = true,
  className = "",
}: CodeExampleProps) {
  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-mono">
          {title}
        </div>
      )}
      <div className="bg-gray-900 p-4 overflow-x-auto">
        <pre
          className={`text-gray-300 text-sm ${
            showLineNumbers ? "line-numbers" : ""
          }`}
        >
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
