import { useState, useEffect } from "react";

// 1. Ye function har row ke liye animation "variants" create karta hai
export const getRowAnimation = (
  index,
  direction = "top",
  delayMultiplier = 0.08,
  duration = 0.5,
) => {
  const offset = 50; // Kitni door se row slide hokar aayegi
  let hiddenState = { opacity: 0 };
  // Direction select karna (top, bottom, left, right)
  if (direction === "top") hiddenState.y = -offset;
  else if (direction === "bottom") hiddenState.y = offset;

  return {
    hidden: hiddenState,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: duration,
        delay: index * delayMultiplier, // "index" ki wajah se staggered (one-by-one) effect aata hai
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };
};

// 2. Ye hook manage karta hai ke animation kab start honi chahiye (loading khatam hone par)
export const useTableAnimation = (loading, dataLength) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const direction = "top";

  useEffect(() => {
    if (!loading && dataLength > 0) {
      const timer = setTimeout(() => setIsDataLoaded(true), 100);
      return () => clearTimeout(timer);
    } else if (!loading) {
      setIsDataLoaded(true);
    } else {
      setIsDataLoaded(false);
    }
  }, [loading, dataLength]);

  return { isDataLoaded, direction };
};
