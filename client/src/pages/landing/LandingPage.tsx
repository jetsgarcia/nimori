import { Button } from "@/components/ui/button";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import Tanjiro from "@/assets/images/tanjiro.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) navigate("/home");
  }, [isSignedIn, navigate]);

  return (
    <div className="bg-bg-light dark:bg-bg-dark flex h-screen justify-between overflow-hidden">
      <div className="overflow-hidden pt-10 pl-36">
        <h1 className="font-quicksand text-primary-light dark:text-primary-dark text-3xl font-semibold">
          nimori
        </h1>
        <div className="grid h-full place-items-center">
          <motion.div className="max-w-lg">
            <motion.h2
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeIn" }}
              className="mb-4 text-5xl font-semibold text-gray-900 dark:text-white"
            >
              Stay Ahead in Your Anime Journey!
            </motion.h2>
            <motion.p
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
              className="mb-6 text-gray-700 dark:text-gray-300"
            >
              Track what you watch, keep tabs on your waifus, discover trending
              anime, and organize your favorites effortlessly!
            </motion.p>
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 1.2 }}
              className="mb-6 text-gray-700 dark:text-gray-300"
            >
              <Button asChild className="cursor-pointer px-4 py-2" size="lg">
                <SignInButton>Get Started</SignInButton>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <div className="relative h-full w-3/4 overflow-hidden">
        <motion.svg
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 700 700"
          preserveAspectRatio="none"
          fill="none"
          className="fill-primary-light dark:fill-primary-dark absolute right-0 z-0 h-full"
        >
          <path d="M111 68.9984C430.541 -338.002 1000.46 68.9984 1000.46 68.9984V786.998C1000.46 786.998 -433.999 1195 133.5 982.5C700.999 770 -208.541 475.998 111 68.9984Z" />
        </motion.svg>
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          src={Tanjiro}
          alt="Tanjiro"
          className="absolute right-0 z-10 mt-auto h-[40rem] object-contain p-24 pt-0 pr-0"
        />
      </div>
    </div>
  );
}
