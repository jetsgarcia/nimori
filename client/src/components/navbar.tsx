import { User } from "lucide-react";
import { Link, useLocation } from "react-router";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const navLinks = [
  { url: "/", label: "Home" },
  { url: "/watchlist", label: "Watchlist" },
  { url: "/waifu", label: "Waifu" },
  { url: "/search", label: "Search" },
];

export default function NavBar() {
  const location = useLocation();

  return (
    <div className="px-8">
      <div className="border-primary-light flex items-center justify-between border-b py-2">
        <div className="flex items-center gap-4">
          <Link to="/">
            <span className="font-quicksand text-primary-light dark:text-primary-dark text-4xl font-semibold">
              nimori
            </span>
          </Link>
          <nav>
            <ul className="flex">
              {navLinks.map(({ url, label }) => (
                <li key={url}>
                  <Link
                    to={url}
                    className={`px-4 transition-colors duration-300 ${
                      location.pathname === url
                        ? ""
                        : "text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" className="cursor-pointer">
            <User />
          </Button>
        </div>
      </div>
    </div>
  );
}
