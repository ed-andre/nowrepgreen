import { useEffect, useRef } from "react";

interface TalentBioProps {
  bio: string;
  firstName: string;
  lastName: string;
}

export function TalentBio({ bio, firstName, lastName }: TalentBioProps) {
  const bioRef = useRef<HTMLDivElement>(null);

  // Parse HTML content safely
  useEffect(() => {
    if (bioRef.current && bio) {
      bioRef.current.innerHTML = bio;

      // Apply styling to paragraphs within the bio
      const paragraphs = bioRef.current.querySelectorAll("p");
      paragraphs.forEach((p, index) => {
        p.style.marginBottom = "1rem";

        // Add subtle fade-in animation with staggered delay
        p.style.opacity = "0";
        p.style.transform = "translateY(10px)";
        p.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        p.style.transitionDelay = `${index * 0.15}s`;

        // Trigger animation after a small delay
        setTimeout(() => {
          p.style.opacity = "1";
          p.style.transform = "translateY(0)";
        }, 100);
      });
    }
  }, [bio]);

  return (
    <div className="flex flex-col justify-center h-full">
      <div className="mb-6 talent-bio-header">
        <h3
          className="text-2xl font-light tracking-wider uppercase mb-2"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          About {firstName}
        </h3>
        <div className="w-16 h-0.5 bg-black opacity-30"></div>
      </div>

      <div
        ref={bioRef}
        className="prose prose-sm max-w-none"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.125rem",
          lineHeight: "1.8",
          fontWeight: "300",
          color: "#333",
          letterSpacing: "0.02em",
        }}
      />

      {!bio && (
        <p
          className="text-gray-500 italic talent-bio-empty"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.125rem",
          }}
        >
          No biography available for {firstName} {lastName}.
        </p>
      )}

      {/* Global styles for animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .talent-bio-header {
          opacity: 0;
          transform: translateY(10px);
          animation: fadeIn 0.8s ease forwards;
          animation-delay: 0.2s;
        }

        .talent-bio-empty {
          opacity: 0;
          animation: fadeIn 0.8s ease forwards;
        }

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
      `,
        }}
      />
    </div>
  );
}
