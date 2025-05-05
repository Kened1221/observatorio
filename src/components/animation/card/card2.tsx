"use client";

import React from "react";

interface CardProps {
  title: string;
  text: string;
}

const Card2: React.FC<CardProps> = ({ title, text }) => {
  // Clases comunes para transiciones
  const transitionClasses =
    "transition-all duration-[480ms] ease-[cubic-bezier(0.23,1,0.32,1)]";

  return (
    <div className="group w-full">
      {/* Contenedor principal con hover effect */}
      <div
        className={`relative flex items-center justify-center w-full 
          rounded-[24px] leading-[1.6] 
          ${transitionClasses} 
          group-hover:-translate-y-4`}
      >
        {/* Capa de fondo 1: pseudo-element before */}
        <div
          className={`absolute -top-[4%] left-1/2 w-[90%] h-[90%] -translate-x-1/2 
            bg-[#f9a8b4] -z-10 origin-bottom-right rounded-[inherit] 
            ${transitionClasses}
            group-hover:rotate-[-6deg] group-hover:top-0 
            group-hover:w-full group-hover得不`}
        />

        {/* Capa de fondo 2: pseudo-element after */}
        <div
          className={`absolute -top-[8%] left-1/2 w-[80%] h-[80%] -translate-x-1/2 
            bg-[#fcd6da] -z-20 origin-bottom-right rounded-[inherit] 
            ${transitionClasses}
            group-hover:rotate-[6deg] group-hover:top-0 
            group-hover:w-full group-hover:h-full`}
        />

        {/* Contenido principal */}
        <div
          className={`relative flex flex-col items-start gap-6 p-9 w-full 
            rounded-[22px] text-white bg-[#ef4444] 
            ${transitionClasses} z-10`}
        >
          {/* Título */}
          <span
            className={`text-[30px] text-center block w-full 
              ${transitionClasses}
              max-sm:text-[16px] z-10 opacity-100`}
          >
            {title}
          </span>

          {/* Párrafo */}
          <p
            className={`text-[16px] text-justify 
              ${transitionClasses}
              max-sm:text-[12px] z-10 opacity-100`}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card2;
