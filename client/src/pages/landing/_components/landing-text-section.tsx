import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SignInButton } from "@clerk/clerk-react";

const fadeInLeft = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5, ease: "easeIn" },
};

const fadeInDown = {
  initial: { y: -50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5, ease: "easeOut" },
};

export default function HeroTextSection() {
  return (
    <div className="overflow-hidden p-4 md:pt-10 md:pl-36">
      <h1 className="font-quicksand text-primary-light dark:text-primary-dark text-3xl font-semibold">
        nimori
      </h1>
      <div className="grid h-[43rem] place-items-center md:h-full">
        <motion.div className="max-w-lg text-center md:text-left">
          <motion.h2
            {...fadeInLeft}
            className="mb-2 text-4xl font-semibold text-gray-900 md:mb-4 md:text-5xl dark:text-white"
          >
            Stay Ahead in Your Anime Journey!
          </motion.h2>
          <motion.p
            {...fadeInDown}
            transition={{ ...fadeInDown.transition, delay: 0.7 }}
            className="m-auto mb-4 max-w-[35ch] text-gray-700 md:mb-6 md:max-w-none dark:text-gray-300"
          >
            Track what you watch effortlessly!
          </motion.p>
          <motion.div
            {...fadeInDown}
            transition={{ ...fadeInDown.transition, delay: 1.2 }}
            className="mb-6 text-gray-700 dark:text-gray-300"
          >
            <Button asChild className="cursor-pointer px-4 py-2" size="lg">
              <SignInButton>Get Started</SignInButton>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
