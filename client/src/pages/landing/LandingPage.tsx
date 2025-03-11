import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import LandingTextSection from "./_components/landing-text-section";
import LandingImageSection from "./_components/landing-image-section";

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) navigate("/home");
  }, [isSignedIn, navigate]);

  return (
    <div className="bg-bg-light dark:bg-bg-dark flex h-screen justify-between overflow-hidden">
      <LandingTextSection />
      <LandingImageSection />
    </div>
  );
}
