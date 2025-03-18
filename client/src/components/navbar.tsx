import { Link, useLocation } from "react-router";
import { ModeToggle } from "@/components/mode-toggle";
import { SignedIn, UserButton } from "@clerk/clerk-react";

const navLinks = [
  { url: "/watchlist", label: "Watchlist" },
  { url: "/search", label: "Search" },
];

export default function NavBar() {
  const location = useLocation();

  return (
    <>
      {/* Mobile navbar */}
      <div className="border-primary-light dark:border-primary-dark bg-bg-light dark:bg-bg-dark fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b px-4 py-2 md:hidden">
        <Link to="/home">
          <span className="font-quicksand text-primary-light dark:text-primary-dark text-3xl font-semibold">
            nimori
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      <div className="border-primary-light bg-bg-light dark:bg-bg-dark dark:border-primary-dark fixed right-0 bottom-0 left-0 rounded-tl-2xl rounded-tr-2xl border-t p-2 md:hidden">
        <nav>
          <ul className="flex items-center justify-between">
            {navLinks.map(({ url, label }) => (
              <li key={url}>
                <Link
                  to={url}
                  className={`px-4 transition-colors duration-300 ${
                    url === "/"
                      ? location.pathname === "/"
                        ? "text-black dark:text-white"
                        : "text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      : location.pathname.startsWith(url)
                        ? "text-black dark:text-white"
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

      {/* Desktop navbar */}
      <div className="bg-bg-light dark:bg-bg-dark fixed top-0 right-0 left-0 z-50 hidden px-8 md:block">
        <div className="border-primary-light flex items-center justify-between border-b py-4">
          <div className="flex items-center gap-4">
            <Link to="/home">
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
                        url === "/"
                          ? location.pathname === "/"
                            ? "text-black dark:text-white"
                            : "text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          : location.pathname.startsWith(url)
                            ? "text-black dark:text-white"
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
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </>
  );
}
