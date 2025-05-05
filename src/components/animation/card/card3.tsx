"use client";
import React from "react";

interface Topic {
  id?: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  description: string;
  backend?: string;
  borderColor?: string;
  frontend?: string;
}

interface CardProps {
  topic: Topic;
}

const Card: React.FC<CardProps> = ({ topic }) => {
  const frontend = topic.frontend || "#FF6B6B";
  const backend = topic.backend || "#4ECDC4";
  const borderColor = topic.borderColor || "#45B7D1";

  return (
    <div
      className="relative w-[300px] h-[400px] overflow-hidden rounded-[40px] border-2 transition-all duration-300 ease-in-out hover:shadow-[0px_2px_2px_#fff] group"
      style={{
        backgroundColor: frontend,
        borderColor: borderColor,
      }}
    >
      <div
        className="h-[65%] transition-all duration-300 ease-in-out group-hover:h-[36%] bg-cover bg-center rounded-t-[20px]"
        style={{ backgroundImage: `url(${topic.imageUrl})` }}
      />
      <div
        className="relative h-[37%] transition-all duration-300 ease-in-out group-hover:h-[65%] rounded-tr-[20px] rounded-bl-[18px] rounded-br-[18px]"
        style={{ backgroundColor: backend }}
      >
        <div className="absolute bottom-[89px] group-hover:bottom-[164px] transition-all duration-300 ease-in-out w-[175px] h-[52px]" />
        <div className="pt-[13%] flex flex-col justify-center items-center text-white">
          <span className="font-bold text-[18px]">{topic.title}</span>
          <p className="text-[14px] pl-[5%]">{topic.description}</p>
          <a
            href={topic.linkUrl}
            className="text-[13px] mt-[15%] no-underline text-white border-2 border-white rounded-[15px] p-[5%] hover:bg-white hover:text-black transition-colors duration-400 ease-in-out"
          >
            Detalles
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;
