"use client";

import "./globals.css";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Star = {
  top: string;
  left: string;
  size: string;
  animationDuration: string;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [stars, setStars] = useState<Star[]>([]);
  useEffect(() => {
    const generateStars = () => {
      return [...Array(30)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 4 + 1}px`,
        animationDuration: `${Math.random() * 15 + 30}s`,
      }));
    };
    setStars(generateStars());
  }, []);
  return (
    <html lang="en">
      <head>
        <title>Coding Relay Admin</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bruno+Ace&family=JetBrains+Mono:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-title" content="Coding Relay Admin" />
      </head>
      <body className="antialiased">
        <div className="-z-50 fixed -top-24 left-5 sm:-top-32 sm:left-5 sm:w-[325px] sm:h-[325px] w-[200px] h-[200px] bg-gradient-to-r from-[#FCACFF] to-black rounded-full"></div>
        <div className="z-0">
          <Navbar />
        </div>
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="-z-50 fixed bg-white rounded-full"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
            }}
            animate={{
              x: [0, 50, -50, 50, -50, 0],
              y: [0, -50, 50, -50, 50, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        <div className="z-50">{children}</div>
        <Image
          src="/Ellipse 28.svg"
          alt="ellipse"
          width={550}
          height={550}
          className="hidden -z-50 absolute sm:-bottom-12 sm:right-0 -bottom-5 right-0"
        />
        <div className="hidden -z-50 absolute sm:-bottom-24 sm:-right-20 -bottom-40 -right-32 w-[400px] h-[400px] bg-black rounded-full"></div>
      </body>
    </html>
  );
}
