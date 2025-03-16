import { Route, Routes } from "react-router";
import NavBar from "@/components/navbar";
import SearchPage from "@/pages/search/SearchPage";
import { Toaster } from "@/components/ui/sonner";
import WatchlistPage from "@/pages/watchlist/WatchlistPage";
import { useEffect } from "react";
import { useLocation } from "react-router";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <NavBar />
      <div className="px-4 pt-13 md:px-8 md:pt-18">
        <Routes>
          <Route path="search" element={<SearchPage />} />
          <Route path="watchlist" element={<WatchlistPage />} />
        </Routes>
      </div>
      <Toaster />
    </>
  );
}

export default App;
