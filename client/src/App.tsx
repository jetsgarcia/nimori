import { Route, Routes } from "react-router";
import "@/App.css";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "@/components/navbar";
import SearchPage from "@/pages/SearchPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <>
        <NavBar />
        <Routes>
          <Route path="search" element={<SearchPage />} />
        </Routes>
      </>
    </ThemeProvider>
  );
}

export default App;
