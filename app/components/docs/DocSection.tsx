import type { ReactNode } from "react";

interface DocSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function DocSection({
  title,
  description,
  children,
  className = "",
  id,
}: DocSectionProps) {
  return (
    <section id={id} className={`mb-16 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 border-b pb-2">
        {title}
      </h2>
      {description && (
        <p className="text-gray-600 mb-6 text-lg max-w-5xl">{description}</p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}
