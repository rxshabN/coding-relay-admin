"use client";

import { AnimatePresence, easeInOut, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  { href: "/create-team", label: "Create team" },
  { href: "/modify-team", label: "Modify team" },
  { href: "/add-points", label: "Add points" },
  { href: "/modify-points", label: "Modify points" },
  {
    href: "/solution",
    label: "View solution/test cases",
    textSize: "text-[1.2rem] sm:text-[1.65rem] group-hover:text-[1.8rem]",
  },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function Home() {
  const [showText, setShowText] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(false);
    }, 1350);
    return () => clearTimeout(timer);
  }, []);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (isAnimating) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [isAnimating]);
  return (
    <div className="relative min-w-screen flex flex-col items-center justify-start text-center">
      <AnimatePresence mode="wait">
        {showText ? (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeInOut }}
            className="mt-48"
          >
            <span className="text-3xl">Welcome to</span>
            <br />
            <br />
            <span className="uppercase text-7xl">Coding Relay</span>
            <br />
            <br />
            <br />
            <span className="text-xl">by SIAM-VIT</span>
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeInOut }}
            onAnimationComplete={() => setIsAnimating(false)}
            className="mt-12"
          >
            <div className="w-fit h-fit flex flex-col items-center justify-center gap-y-5 sm:mt-0 mt-28">
              {menuItems.map(
                ({
                  href,
                  label,
                  textSize = "text-3xl group-hover:text-[2.2rem]",
                }) => (
                  <Link key={href} href={href}>
                    <button className="ml-2 sm:ml-0 relative w-[20rem] h-16 sm:w-[30.5rem] sm:h-20 p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group">
                      <div
                        className={`flex items-center justify-center w-full h-full ${textSize} text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent`}
                      >
                        {label}
                      </div>
                    </button>
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
