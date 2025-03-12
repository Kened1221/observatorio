"use client";

import React from "react";
import styled from "styled-components";

// Función auxiliar para convertir un color hex (#RRGGBB) a rgba con opacidad
const hexToRgba = (hex: string, alpha: number): string => {
  let sanitizedHex = hex.replace("#", "");
  if (sanitizedHex.length === 3) {
    sanitizedHex = sanitizedHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(sanitizedHex.substring(0, 2), 16);
  const g = parseInt(sanitizedHex.substring(2, 4), 16);
  const b = parseInt(sanitizedHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface CardProps {
  title: string;
  imageUrl: string;
  linkUrl: string;
  description: string;
  backend: string;
  borderColor: string;
  frontend: string;
}

const Card: React.FC<CardProps> = ({
  title,
  imageUrl,
  linkUrl,
  description,
  backend,
  borderColor,
  frontend
}) => {
  return (
    <CardLink href={linkUrl} rel="noopener noreferrer">
      <StyledWrapper
        $backend={backend}
        $borderColor={borderColor}
        $frontend={frontend}
      >
        <div className="card">
          <div className="content">
            <div className="back">
              <div className="back-content">
                <span className="title">{title}</span>
                <p className="description">{description}</p>
              </div>
            </div>
            <div className="front">
              <div
                className="img"
                style={{ backgroundImage: `url(${imageUrl})` }}
              >
                <div className="circle"></div>
                <div className="circle" id="right"></div>
              </div>
              <div className="front-content">
                <small className="badge">{title}</small>
                <div className="description">
                  <div className="title">
                    <p>
                      <strong>{title}</strong>
                    </p>
                    <svg
                      fillRule="nonzero"
                      height="15px"
                      width="15px"
                      viewBox="0,0,256,256"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        style={{ mixBlendMode: "normal" }}
                        textAnchor="none"
                        fontSize="none"
                        fontWeight="none"
                        fontFamily="none"
                        strokeDashoffset={0}
                        strokeMiterlimit={10}
                        strokeLinejoin="miter"
                        strokeLinecap="butt"
                        strokeWidth={1}
                        stroke="none"
                        fillRule="nonzero"
                        fill="#20c997"
                      >
                        <g transform="scale(8,8)">
                          <path d="M25,27l-9,-6.75l-9,6.75v-23h18z" />
                        </g>
                      </g>
                    </svg>
                  </div>
                  <p className="card-footer">{description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StyledWrapper>
    </CardLink>
  );
};

const CardLink = styled.a`
  text-decoration: none;
`;

interface StyledWrapperProps {
  $frontend: string;
  $backend: string;
  $borderColor: string;
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .card {
    overflow: visible;
    width: 100%;
    height: 380px;
  }

  .content {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 800ms;
  }

  .front,
  .back {
    background-color: ${({ $frontend }) => hexToRgba($frontend, 0.2)};
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 15px;
    overflow: hidden;
  }

  .back {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .back::before {
    position: absolute;
    content: " ";
    display: block;
    width: 160px;
    height: 160%;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ $borderColor }) => $borderColor},
      ${({ $borderColor }) => $borderColor},
      ${({ $borderColor }) => $borderColor},
      ${({ $borderColor }) => $borderColor},
      transparent
    );
    animation: rotation_481 5000ms infinite linear;
  }

  .back-content {
    position: absolute;
    width: 98%;
    height: 98%;
    background-color: ${({ $backend }) => $backend};
    border-radius: 15px;
    color: #333;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 15px;
    font-family: 'Arial', sans-serif;
    font-size: 20px;
    line-height: 1.4;
    text-align: justify;
    padding: 36px;
  }

  .card:hover .content {
    transform: rotateY(180deg);
  }

  @keyframes rotation_481 {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }

  .front {
    transform: rotateY(180deg);
    color: #fff;
  }

  .front .front-content {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .badge {
    background-color: #00000055;
    padding: 4px 12px;
    border-radius: 10px;
    backdrop-filter: blur(2px);
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    font-weight: bold;
  }

  .front-content .description {
    width: 100%;
    padding: 10px;
    backdrop-filter: blur(5px);
    border-radius: 5px;
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #fff;
  }

  .title {
    font-family: 'Arial', sans-serif;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
  }

  .card-footer {
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    color: #ffffffcc;
    margin-top: 5px;
  }

  .front .img {
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }

  .circle {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: #ffbb66;
    position: relative;
    filter: blur(15px);
    animation: floating 2600ms infinite linear;
  }

  #right {
    background-color: #ff2233;
    left: 160px;
    top: -80px;
    width: 30px;
    height: 30px;
    animation-delay: -1800ms;
  }

  @keyframes floating {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(10px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  /* Estilos responsivos para dispositivos móviles */
  @media (max-width: 768px) {
    .card {
      height: 320px;
    }
    .back-content {
      font-size: 18px;
      gap: 15px;
      padding: 12px;
    }
    .badge {
      font-size: 12px;
      padding: 3px 10px;
    }
    .front-content .description {
      font-size: 14px;
    }
    .title {
      font-size: 16px;
    }
    .card-footer {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .card {
      height: 280px;
    }
    .back-content {
      font-size: 16px;
      gap: 10px;
      padding: 10px;
    }
    .badge {
      font-size: 10px;
      padding: 2px 8px;
    }
    .front-content .description {
      font-size: 12px;
    }
    .title {
      font-size: 14px;
    }
    .card-footer {
      font-size: 10px;
    }
  }
`;

export default Card;
