// app/account/page.tsx
"use server";

import React from "react";
import { auth } from "@/auth";
import { ContentData } from "./content-data";

const Page = async () => {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>No has iniciado sesión</p>
      </div>
    );
  }

  return <ContentData session={session} />;
};

export default Page;
