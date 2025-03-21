"use client";

import { useState, useEffect } from "react";

// Definimos los tipos para los datos
interface DeviceInfo {
  userAgent: string;
  platform: string;
  language: string;
}

interface LocationData {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

interface UserData {
  deviceInfo: string | null; // Ahora es un string (JSON.stringify)
  ipAddress: string | null; // Ya es un string, no necesita cambio
  location: string | null; // Ahora es un string (JSON.stringify)
}

// Tipos originales para parsear los datos de vuelta
interface ParsedUserData {
  deviceInfo: DeviceInfo | null;
  ipAddress: string | null;
  location: LocationData | null;
}

// Hook personalizado para obtener los datos
export const useUserData = (): UserData => {
  const [deviceInfo, setDeviceInfo] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    // Obtener deviceInfo
    const info: DeviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    };
    setDeviceInfo(JSON.stringify(info)); // Convertimos a texto plano

    // Obtener IP pública
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip); // ipAddress ya es un string

        // Obtener ubicación basada en la IP
        const locationResponse = await fetch(`http://ip-api.com/json/${data.ip}`);
        const locationData = await locationResponse.json();
        const locationInfo: LocationData = {
          city: locationData.city,
          country: locationData.country,
          lat: locationData.lat,
          lon: locationData.lon,
        };
        setLocation(JSON.stringify(locationInfo)); // Convertimos a texto plano
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchIp();
  }, []);

  return { deviceInfo, ipAddress, location };
};

// Función para parsear los datos de texto plano a su formato original
export const parseUserData = (data: UserData): ParsedUserData => {
  return {
    deviceInfo: data.deviceInfo ? JSON.parse(data.deviceInfo) : null,
    ipAddress: data.ipAddress,
    location: data.location ? JSON.parse(data.location) : null,
  };
};