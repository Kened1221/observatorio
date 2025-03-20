"use client"

import Footer from "../footer";
import AnimatedWaves from "../footer/animated-waves";
import Navbar from "../navbar";

import { usePathname } from 'next/navigation'

function Inicio({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname()

  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')){
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      {children}
      <AnimatedWaves />
      <Footer />
    </>
  );
}

export default Inicio;
