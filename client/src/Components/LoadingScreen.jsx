import React, { useState, useRef, useEffect } from 'react';
import './LoadingAni.css';

const LoadingScreen = () => {

  const [logoPhase, setLogoPhase] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setLogoPhase(true)
    }, 1000)
  }, [])

  return (
    <div className="flex items-center justify-center h-screen bg-primaryBudgetoo">
      <div className="relative flex flex-col items-center justify-center w-1/2 h-1/2">
      <span
          className={`text-5xl font-bold text-gray-800 transition-transform duration-500 ${
            logoPhase ? "translate-y-10 " : ""
          }`}
        >
          Budgetoo
        </span>
        {/* {!logoPhase && ( */}
          <div className={`loader ${logoPhase ? 'opacity-0 ': 'bg-red-00'}`}>
            <div className="loader__bar"></div>
            <div className="loader__bar"></div>
            <div className="loader__bar"></div>
            <div className="loader__ball"></div>
          </div>
        {/* )} */}

      </div>
    </div>
  );
};

export default LoadingScreen

