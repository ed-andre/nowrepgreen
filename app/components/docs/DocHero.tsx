import type { ReactNode } from "react";

interface DocHeroProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  gradient?: "blackteal" | "blue" | "yellow";
}

export function DocHero({
  title,
  subtitle,
  icon,
  gradient = "blackteal",
}: DocHeroProps) {
  const gradientClasses = {
    blackteal: "from-zinc-600 to-teal-700",
    blue: "from-blue-600 to-indigo-700",
    yellow: "from-amber-500 to-yellow-300",
  };

  return (
    <div className={`relative overflow-hidden rounded-lg mb-12`}>
      <div
        className={`bg-gradient-to-r ${gradientClasses[gradient]} p-8 md:p-12 text-white`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {icon && (
            <div className="flex-shrink-0 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-5xl">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:16px_16px]" />
    </div>
  );
}
