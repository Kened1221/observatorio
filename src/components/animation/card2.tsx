"use client";

import React from "react";
import styled from "styled-components";

interface CardProps {
  title: string;
  text: string;
}

const Card2: React.FC<CardProps> = ({ title, text }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="content">
          <span className="title">{title}</span>
          <p className="para">{text}</p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-radius: 24px;
    line-height: 1.6;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    padding: 36px;
    border-radius: 22px;
    color: #ffffff;
    overflow: hidden;
    background: #ef4444;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .content::before {
    position: absolute;
    content: "";
    top: -4%;
    left: 50%;
    width: 90%;
    height: 90%;
    transform: translate(-50%);
    background: #f9a8b4;
    z-index: -1;
    transform-origin: bottom;

    border-radius: inherit;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .content::after {
    position: absolute;
    content: "";
    top: -8%;
    left: 50%;
    width: 80%;
    height: 80%;
    transform: translate(-50%);
    background: #fcd6da;
    z-index: -2;
    transform-origin: bottom;
    border-radius: inherit;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .content .title {
    z-index: 1;
    opacity: 1;
    font-size: 30px;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
    text-align: center;
    display: block;
    width: 100%;
  }

  /* Estilos para celulares */
  @media screen and (max-width: 576px) {
    .content .title {
      font-size: 16px;
    }
  }

  .content .para {
    z-index: 1;
    opacity: 1;
    font-size: 16px;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
    text-align: justify;
  }

  /* Estilos para celulares */
  @media screen and (max-width: 576px) {
    .content .para {
      font-size: 12px;
    }
  }

  .card:hover {
    transform: translate(0px, -16px);
  }

  .card:hover .content::before {
    rotate: -6deg;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .card:hover .content::after {
    rotate: 6deg;
    top: 0;
    width: 100%;
    height: 100%;
  }
`;

export default Card2;
