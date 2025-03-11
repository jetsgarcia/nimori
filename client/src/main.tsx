import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { ClerkProvider } from "@clerk/clerk-react";
import LandingPage from "@/pages/landing/LandingPage.tsx";
import { ProtectedRoute } from "@/components/protected-route.tsx";
import { ThemeProvider } from "@/components/theme-provider";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const client = new ApolloClient({
  uri: "https://graphql.anilist.co",
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <ApolloProvider client={client}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/*" element={<App />} />
              </Route>
            </Routes>
          </ApolloProvider>
        </ClerkProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
