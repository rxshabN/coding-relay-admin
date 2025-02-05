"use client";

import { AnimatePresence, easeInOut, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [showText, setShowText] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(false);
    }, 1350);
    return () => clearTimeout(timer);
  }, []);
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
            className="mt-12"
          >
            <div className="w-fit h-fit flex flex-col items-center justify-center gap-y-5 sm:mt-0 mt-28">
              <Link href="/create-team">
                <button className="ml-2 sm:ml-0 relative w-[20rem] h-16 sm:w-[30.5rem] sm:h-20 p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group">
                  <div className="flex items-center justify-center w-full h-full text-3xl text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent group-hover:text-[2.2rem]">
                    Create team
                  </div>
                </button>
              </Link>
              <Link href="/modify-team">
                <button className="ml-2 sm:ml-0 relative w-[20rem] h-16 sm:w-[30.5rem] sm:h-20 p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group">
                  <div className="flex items-center justify-center w-full h-full text-3xl text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent group-hover:text-[2.2rem]">
                    Modify team
                  </div>
                </button>
              </Link>
              <Link href="/add-points">
                <button className="ml-2 sm:ml-0 relative w-[20rem] h-16 sm:w-[30.5rem] sm:h-20 p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group">
                  <div className="flex items-center justify-center w-full h-full text-3xl text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent group-hover:text-[2.2rem]">
                    Add points
                  </div>
                </button>
              </Link>
              <Link href="/modify-points">
                <button className="ml-2 sm:ml-0 relative w-[20rem] h-16 sm:w-[30.5rem] sm:h-20 p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group">
                  <div className="flex items-center justify-center w-full h-full text-3xl text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent group-hover:text-[2.2rem]">
                    Modify points
                  </div>
                </button>
              </Link>
              <Link href="/solution">
                <button className="ml-2 sm:ml-0 relative w-[20rem] h-16 sm:w-[30.5rem] sm:h-20 p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group">
                  <div className="flex items-center justify-center w-full h-full text-[1.2rem] sm:text-[1.65rem] text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent group-hover:text-[1.8rem]">
                    View solution/test cases{" "}
                  </div>
                </button>
              </Link>
              <Link href="/leaderboard">
                <button className="ml-2 sm:ml-0 relative w-[20rem] h-16 sm:w-[30.5rem] sm:h-20 p-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group">
                  <div className="flex items-center justify-center w-full h-full text-3xl text-white bg-black rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-[#4b52f2] group-hover:bg-transparent group-hover:text-[2.2rem]">
                    Leaderboard
                  </div>
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
