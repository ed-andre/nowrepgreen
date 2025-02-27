import { Link } from "react-router";

export interface MenuItem {
  label: string;
  path: string;
}

export const menuItems: MenuItem[] = [
  { label: "Home", path: "/modeling" },
  { label: "About Us", path: "#" },
  { label: "Get Scouted", path: "#" },
  { label: "Social Media", path: "#" },
  { label: "Contact Us", path: "#" },
];

interface MenuListProps {
  textColor?: string;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  currentPath?: string;
}

export function MenuList({
  textColor = "rgba(0,0,0,0.5)",
  className = "",
  itemClassName = "",
  activeItemClassName = "text-black font-medium",
  currentPath = "",
}: MenuListProps) {
  return (
    <ul className={className}>
      {menuItems.map((item) => (
        <li key={item.label} className={itemClassName}>
          <Link
            to={item.path}
            className={`uppercase tracking-wider text-sm transition-colors duration-300 hover:text-black ${
              currentPath === item.path ? activeItemClassName : ""
            }`}
            style={{ color: currentPath === item.path ? undefined : textColor }}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
