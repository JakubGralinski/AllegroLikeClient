import React, { useEffect } from "react";
import gsap from "gsap";
import { Box } from "@mui/material";

const wave1Shapes = [
  // Original
  "M0,1200 C1000,1400 2000,1000 3000,1200 L3000,1600 L0,1600 Z",
  // Morph 1
  "M0,1200 C800,1600 2200,800 3000,1200 L3000,1600 L0,1600 Z",
  // Morph 2
  "M0,1200 C1200,1000 1800,1400 3000,1200 L3000,1600 L0,1600 Z",
  // Morph 3
  "M0,1200 C900,1300 2100,1100 3000,1200 L3000,1600 L0,1600 Z",
];

const wave2Shapes = [
  // Original
  "M0,1400 C1200,1600 1800,1200 3000,1400 L3000,1600 L0,1600 Z",
  // Morph 1
  "M0,1400 C1000,1800 2000,1000 3000,1400 L3000,1600 L0,1600 Z",
  // Morph 2
  "M0,1400 C1400,1200 1600,1800 3000,1400 L3000,1600 L0,1600 Z",
  // Morph 3
  "M0,1400 C900,1700 1980,1100 3000,1400 L3000,1600 L0,1600 Z",
];

const AuthAnim: React.FC = () => {
  useEffect(() => {
    const wave1 = document.getElementById("wavePath1");
    const wave2 = document.getElementById("wavePath2");
    if (!wave1 || !wave2) return;

    // Animate wave1 through multiple shapes
    let wave1Index = 0;
    const animateWave1 = () => {
      gsap.to(wave1, {
        attr: { d: wave1Shapes[wave1Index % wave1Shapes.length] },
        duration: 4,
        ease: "sine.inOut",
        onComplete: () => {
          wave1Index++;
          animateWave1();
        },
      });
    };
    animateWave1();

    // Animate wave2 through multiple shapes
    let wave2Index = 0;
    const animateWave2 = () => {
      gsap.to(wave2, {
        attr: { d: wave2Shapes[wave2Index % wave2Shapes.length] },
        duration: 6,
        ease: "sine.inOut",
        onComplete: () => {
          wave2Index++;
          animateWave2();
        },
      });
    };
    animateWave2();
  }, []);

  return (
    <Box sx={{ position: 'fixed', inset: 0, /* zIndex: -1, */ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <svg
        id="auth-bg-wave"
        width="100vw"
        height="100vh"
        viewBox="0 0 3000 1600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
        <defs>
          <linearGradient
            id="waveGradient1"
            x1="0"
            y1="0"
            x2="3000"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2196f3" />
            <stop offset="1" stopColor="#9c27b0" />
          </linearGradient>
          <linearGradient
            id="waveGradient2"
            x1="0"
            y1="0"
            x2="3000"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#42a5f5" />
            <stop offset="1" stopColor="#ce93d8" />
          </linearGradient>
        </defs>
        <path
          id="wavePath1"
          d="M0,1200 C1000,1400 2000,1000 3000,1200 L3000,1600 L0,1600 Z"
          fill="url(#waveGradient1)"
          opacity="0.7"
        />
        <path
          id="wavePath2"
          d="M0,1400 C1200,1600 1800,1200 3000,1400 L3000,1600 L0,1600 Z"
          fill="url(#waveGradient2)"
          opacity="0.5"
        />
      </svg>
    </Box>
  );
};

export default AuthAnim;
