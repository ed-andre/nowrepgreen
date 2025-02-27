import { Link } from "react-router";

import { MenuList } from "./MenuList";

interface HeaderMenuProps {
  textColor?: string;
  position?: "footer" | "header";
  currentPath?: string;
}

export function HeaderMenu({
  textColor = "rgba(0,0,0,0.5)",
  position = "footer",
  currentPath = "",
}: HeaderMenuProps) {
  return (
    <div
      className={`py-2 text-center relative ${position === "header" ? "mt-2 mb-8" : ""}`}
      style={{ zIndex: 10 }}
    >
      <div className="flex justify-center">
        <MenuList
          textColor={textColor}
          className="flex space-x-10"
          currentPath={currentPath}
        />
      </div>
    </div>
  );
}
