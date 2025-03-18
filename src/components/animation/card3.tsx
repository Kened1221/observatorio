"use client";
import React from "react";
import styled from "styled-components";

interface Topic {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  description: string;
  backend: string;
  borderColor: string;
  frontend: string;
}

interface CardProps {
  topic: Topic;
}

const Card: React.FC<CardProps> = ({ topic }) => {
  return (
    <StyledWrapper
      borderColor={topic.borderColor}
      backend={topic.backend}
      frontend={topic.frontend}
    >
      <div className="card">
        <div
          className="top-card"
          style={{ backgroundImage: `url(${topic.imageUrl})` }}
        />
        <div className="bottom-card">
          <div className="card-content">
            <span className="card-title">{topic.title}</span>
            <p className="card-txt">{topic.description}</p>
            <a href={topic.linkUrl} className="card-btn">
              Detalles
            </a>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

// Styled Component que recibe las props dinámicas para los colores
const StyledWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    prop !== "borderColor" && prop !== "backend" && prop !== "frontend",
})<{ borderColor: string; backend: string; frontend: string }>`
  .card {
    position: relative;
    width: 300px;
    height: 400px;
    background-color: #fff;
    border-radius: 40px;
    overflow: hidden;
    border: solid 2px ${(props) => props.borderColor};
    transition: box-shadow 0.3s ease, border 0.3s ease;
  }

  .top-card {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    height: 65%;
    transition: height 0.3s ease;
    background-size: cover;
    background-position: center;
  }

  .bottom-card {
    border-top-right-radius: 20px;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    height: 35%;
    background-color: ${(props) => props.backend};
    transition: height 0.3s ease;
  }

  .bottom-card::before {
    content: "";
    position: absolute;
    background-color: transparent;
    bottom: 89px;
    height: 50px;
    width: 175px;
    transition: bottom 0.3s ease;
    border-bottom-left-radius: 20px;
  }

  .card-content {
    padding-top: 13%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff; // Usamos el frontend dinámico
  }

  .card-title {
    font-weight: 700;
    font-size: 18px;
  }

  .card-txt {
    font-size: 14px;
    padding-left: 5%;
  }

  .card-btn {
    font-size: 13px;
    margin-top: 15%;
    text-decoration: none;
    color: #fff; // Usamos el frontend dinámico
    background-color: transparent;
    border: solid 2px #fff; // Usamos el frontend dinámico
    border-radius: 15px;
    padding: 5%;
  }

  .card:hover {
    box-shadow: 0px 2px 2px #fff; // Aplicamos el hover con el borderColor
    border: solid 1px ${(props) => props.borderColor}; // Aplicamos el borderColor dinámico al hover
  }

  .card:hover .top-card {
    height: 35%;
    transition: height 0.3s ease;
  }

  .card:hover .bottom-card {
    height: 65%;
    transition: height 0.3s ease;
  }

  .card:hover .bottom-card::before {
    bottom: 164px;
    transition: bottom 0.3s ease;
  }

  .card-btn:hover {
    color: black;
    background-color: #fff; // Color de fondo en hover dinámico
    transition: background-color 0.4s ease;
  }
`;

export default Card;
