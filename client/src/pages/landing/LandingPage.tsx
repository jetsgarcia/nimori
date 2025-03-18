import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import LandingTextSection from "./_components/landing-text-section";
import LandingImageSection from "./_components/landing-image-section";
import Loading from "@/components/loading";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  if (isLoaded) {
    if (isSignedIn) navigate("/watchlist");
    return (
      <div className="bg-bg-light dark:bg-bg-dark flex h-screen justify-between overflow-hidden">
        <LandingTextSection />
        <LandingImageSection />
      </div>
    );
  }

  return (
    <div className="grid h-screen w-full place-items-center">
      <Loading />
    </div>
  );
}
