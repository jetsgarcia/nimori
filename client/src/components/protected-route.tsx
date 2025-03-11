import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router";
import Loading from "@/components/loading";

export const ProtectedRoute = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="grid h-screen w-full place-items-center">
        <Loading />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
