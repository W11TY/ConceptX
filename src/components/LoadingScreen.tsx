import React, { useEffect, useState } from "react";

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 600); // Wait for fade out animation
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      <img 
        src="/logo.png" 
        alt="ConceptX Logo" 
        className="h-10 sm:h-12 w-auto object-contain animate-pulse opacity-80"
      />
    </div>
  );
};

export default LoadingScreen;
