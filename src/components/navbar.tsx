"use client";

import { easeInOut, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const links = [
    { href: "/create-team", label: "Create team" },
    { href: "/modify-team", label: "Modify team" },
    { href: "/add-points", label: "Add points" },
  ];
  const links2 = [
    { href: "/modify-points", label: "Modify points" },
    { href: "/solution", label: "Solution" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isDesktop = !isMobile;

  return (
    <nav className="z-50 relative sm:top-0 sm:right-0 top-3 sm:mb-0 -mb-14">
      {isMobile && (
        <div className="flex justify-between items-center px-4 py-3 bg-transparent text-white">
          <button
            className="text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-8 h-1 bg-white mb-1"></div>
            <div className="w-8 h-1 bg-white mb-1"></div>
            <div className="w-8 h-1 bg-white"></div>
          </button>
        </div>
      )}
      {isDesktop && (
        <div className="flex items-center justify-around -mt-2 px-2 -mb-16">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`-mt-[3.25rem] relative text-xl after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:transform after:origin-center ${
                pathname === href
                  ? "transition-all duration-500 text-blue-500 underline"
                  : "after:w-0 after:left-1/2 hover:after:w-full hover:after:left-0"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link href="/">
            <Image src="/logo.png" alt="siam logo" width={180} height={180} />
          </Link>
          {links2.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`-mt-[3.25rem] relative text-xl after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:transform after:origin-center ${
                pathname === href
                  ? "transition-all duration-500 text-blue-500 underline"
                  : "after:w-0 after:left-1/2 hover:after:w-full hover:after:left-0"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
      {isMobile && menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeInOut }}
          className="rounded-lg fixed top-0 left-0 w-[100vw] h-fit py-14 bg-black text-white flex flex-col items-center justify-center z-50"
        >
          <button
            className="absolute top-5 left-5 text-white text-4xl"
            onClick={() => setMenuOpen(false)}
          >
            &times;
          </button>
          <ul className="text-right space-y-6 text-4xl">
            <li>
              <Link
                href="/"
                className={`${
                  pathname === "/"
                    ? "text-blue-500 underline"
                    : "hover:text-gray-400"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            {[...links, ...links2].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block ${
                    pathname === href
                      ? "text-blue-500 underline"
                      : "hover:text-gray-400"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
