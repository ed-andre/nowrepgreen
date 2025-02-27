import { Outlet, useLocation } from "react-router";
import { type LinksFunction } from "react-router";
import thumbnailsStyles from "yet-another-react-lightbox/plugins/thumbnails.css?url";
import lightboxStyles from "yet-another-react-lightbox/styles.css?url";

import { Footer } from "~/components/modeling";
import styles from "~/styles/modeling.css?url";

// Import the Lightbox CSS for the MediaGallery component

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: lightboxStyles as string },
  { rel: "stylesheet", href: thumbnailsStyles as string },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap",
  },
];

export default function ModelingLayout() {
  const location = useLocation();
  const isIndexPage =
    location.pathname === "/modeling" || location.pathname === "/modeling/";
  const isTalentsPage = location.pathname === "/modeling/talents";

  return (
    <div className="modeling-site min-h-screen flex flex-col">
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer transparent={true} />
    </div>
  );
}
