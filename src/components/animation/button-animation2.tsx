"use client";

import React, { useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { AiFillCaretUp } from "react-icons/ai";

interface ButtonProps {
  setPAselect: (value: string) => void; // Prop para actualizar el estado del padre
}

const Button = ({ setPAselect }: ButtonProps) => {
  const [isClicked, setIsClicked] = useState(false); // Estado local para la animación

  const handleClick = () => {
    setIsClicked((prev) => !prev); // Alterna el estado local para la animación
    setPAselect(isClicked ? "poblacion" : "ambito"); // Actualiza el estado del padre
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex flex-col w-full max-w-[140px] h-[50px] rounded-lg 
                 shadow-lg overflow-hidden outline-none border-none 
                 transition-all duration-500
                 active:scale-95"
    >
      {/* Capa "Población" */}
      <div
        className={`absolute w-full h-full flex items-center justify-center 
                   px-4 py-3 bg-blue-500 transition-transform duration-500 
                 ${isClicked ? "-translate-y-[50px]" : "translate-y-0"}`}
      >
        <span className="flex flex-row text-white text-center text-[17px] font-bold items-center gap-4">
          Población
          <AiFillCaretDown />
        </span>
      </div>

      {/* Capa "Ámbito" */}
      <div
        className={`absolute w-full h-full flex items-center justify-center 
                   px-4 py-3 bg-emerald-500 transition-transform duration-500 
                 ${isClicked ? "translate-y-0" : "translate-y-[50px]"}`}
      >
        <span className="flex flex-row text-white text-center text-[17px] font-bold items-center gap-4">
          Ámbito
          <AiFillCaretUp />
        </span>
      </div>
    </button>
  );
};

export default Button;
