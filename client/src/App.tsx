import { Route, Routes } from "react-router";
import NavBar from "@/components/navbar";
import SearchPage from "@/pages/search/SearchPage";

function App() {
  return (
    <>
      <NavBar />
      <div className="px-4 pt-13 md:px-8 md:pt-18">
        <Routes>
          <Route path="search" element={<SearchPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
