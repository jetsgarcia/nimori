import Tanjiro from "@/assets/images/tanjiro.png";
import { motion } from "framer-motion";

export default function LandingImageSection() {
  return (
    <div className="relative hidden h-full w-3/4 overflow-hidden md:block">
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 700 700"
        preserveAspectRatio="none"
        fill="none"
        className="fill-primary-light dark:fill-primary-dark absolute right-0 z-0 h-full"
      >
        <path d="M111 68.9984C430.541 -338.002 1000.46 68.9984 1000.46 68.9984V786.998C1000.46 786.998 -433.999 1195 133.5 982.5C700.999 770 -208.541 475.998 111 68.9984Z" />
      </motion.svg>
      <motion.img
        initial={{ x: 500, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1,
          delay: 0.5,
          type: "spring",
        }}
        src={Tanjiro}
        alt="Tanjiro"
        className="absolute right-0 z-10 p-24 pt-0 pr-0 md:h-[40rem]"
      />
    </div>
  );
}
