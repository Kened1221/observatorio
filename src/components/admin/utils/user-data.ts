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
  isReady: boolean; // Nuevo campo para indicar que los datos están listos
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
  const [isReady, setIsReady] = useState(false); // Nuevo estado

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener deviceInfo (síncrono)
        const info: DeviceInfo = {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
        };
        setDeviceInfo(JSON.stringify(info));

        // Obtener IP pública
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        setIpAddress(ipData.ip);

        // Obtener ubicación basada en la IP
        const locationResponse = await fetch(`http://ip-api.com/json/${ipData.ip}`);
        const locationData = await locationResponse.json();
        const locationInfo: LocationData = {
          city: locationData.city,
          country: locationData.country,
          lat: locationData.lat,
          lon: locationData.lon,
        };
        setLocation(JSON.stringify(locationInfo));
      } catch (error) {
        console.error("Error al obtener datos:", error);
        // Establecer valores por defecto en caso de error
        if (!deviceInfo) {
          const info: DeviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
          };
          setDeviceInfo(JSON.stringify(info));
        }
        if (!ipAddress) setIpAddress("unknown");
        if (!location) setLocation("unknown");
      } finally {
        setIsReady(true); // Marcar como listo, incluso si hay errores
      }
    };

    fetchData();
  }, []); // Solo se ejecuta una vez al montar

  return { deviceInfo, ipAddress, location, isReady };
};

// Función para parsear los datos de texto plano a su formato original
export const parseUserData = (data: UserData): ParsedUserData => {
  return {
    deviceInfo: data.deviceInfo ? JSON.parse(data.deviceInfo) : null,
    ipAddress: data.ipAddress,
    location: data.location ? JSON.parse(data.location) : null,
  };
};