import { Link } from "react-router";

interface AgencyHeaderProps {
  handleNavigation?: (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => void;
  isTransparent?: boolean;
  textColor?: string;
}

export function AgencyHeader({
  handleNavigation,
  isTransparent = true,
  textColor = "black",
}: AgencyHeaderProps) {
  return (
    <header className="sticky top-0 pt-4 text-center z-50 bg-transparent">
      <Link
        to="/modeling"
        onClick={(e) =>
          handleNavigation ? handleNavigation(e, "/modeling") : undefined
        }
        className="inline-block"
      >
        <h1
          className="text-3xl font-bold tracking-widest uppercase transition-colors duration-500"
          style={{
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          NOWREP AGENCY
        </h1>
      </Link>
    </header>
  );
}
