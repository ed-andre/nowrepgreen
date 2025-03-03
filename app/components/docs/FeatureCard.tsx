import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
  variant?: "default" | "outlined";
}

export function FeatureCard({
  title,
  description,
  icon,
  className = "",
  variant = "default",
}: FeatureCardProps) {
  const variantClasses = {
    default: "bg-white shadow-md hover:shadow-lg",
    outlined: "border border-gray-200 hover:border-gray-300 bg-white/50",
  };

  return (
    <div
      className={`rounded-lg p-6 transition-all duration-200 ${variantClasses[variant]} ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-2 rounded-md bg-gray-100">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
