import { Route, Routes } from "react-router";
import NavBar from "@/components/navbar";
import SearchPage from "@/pages/search/SearchPage";
import { Toaster } from "@/components/ui/sonner";
import WatchlistPage from "@/pages/watchlist/WatchlistPage";

function App() {
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
