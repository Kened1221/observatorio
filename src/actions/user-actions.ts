"use server"

import { prisma } from "@/config/prisma";

export async function googleLinkedAccountVerify({id} : {id: string}) {
  try {
    const result = await prisma.account.findFirst({
      where: {
        userId: id,
        provider: "google",
      },
    })

    return !!result;
  } catch (error) {
    console.log("Error al verificar si la cuenta está vinculada a Google:", error);
    return false;
  }
}

interface DeviceInfo {
  platform?: string;
  userAgent?: string;
}

interface LocationInfo {
  city?: string;
  country?: string;
}

export async function activeSessionsVerify({ id }: { id: string }) {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        userId: id,
        status: "active",
      },
    });

    const mappedSessions = sessions.map((session) => {
      let deviceData: DeviceInfo = {};
      let locationData: LocationInfo = {};

      try {
        deviceData = session.deviceInfo ? JSON.parse(session.deviceInfo) as DeviceInfo : {};
      } catch (error) {
        console.log("Error al parsear deviceInfo:", error);
        deviceData = {};
      }
      try {
        locationData = session.location ? JSON.parse(session.location) as LocationInfo : {};
      } catch (error) {
        console.log("Error al parsear location:", error);
        locationData = {};
      }

      return {
        id: String(session.userId),
        device: deviceData.platform || "Desconocido",
        browser: deviceData.userAgent || "Desconocido",
        location: locationData.city + " - " + locationData.country || "Desconocido",
        lastActive: session.updatedAt.toISOString(),
        current: session.status === "active",
      };
    });

    return mappedSessions;
  } catch (error) {
    console.error("Error al verificar sesiones activas:", error);
    return [];
  }
}

export async function historySessions({ id }: { id: string }) {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        userId: id,
      },
    });

    const mappedSessions = sessions.map((session) => {
      let deviceData: DeviceInfo = {};
      let locationData: LocationInfo = {};

      try {
        deviceData = session.deviceInfo ? JSON.parse(session.deviceInfo) as DeviceInfo : {};
      } catch (error) {
        console.log("Error al parsear deviceInfo:", error);
        deviceData = {};
      }
      try {
        locationData = session.location ? JSON.parse(session.location) as LocationInfo : {};
      } catch (error) {
        console.log("Error al parsear location:", error);
        locationData = {};
      }

      return {
        id: String(session.userId),
        device: deviceData.platform || "Desconocido",
        browser: deviceData.userAgent || "Desconocido",
        location: locationData.city + " - " + locationData.country || "Desconocido",
        timestamp: session.updatedAt.toISOString(),
        status: session.status,
      };
    });

    return mappedSessions;
  } catch (error) {
    console.error("Error al verificar sesiones activas:", error);
    return [];
  }
}