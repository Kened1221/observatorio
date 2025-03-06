import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

const topics = [
  {
    id: 1,
    title: "Salud y nutrición",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pBJqyBrAa4WG6h3Mzq27tfROEIlI9h.png",
    iconPosition: "0 0",
    color: "bg-red-50 hover:bg-red-100",
    textColor: "text-primary",
    link: "/salud",
  },
  {
    id: 2,
    title: "Educación",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pBJqyBrAa4WG6h3Mzq27tfROEIlI9h.png",
    iconPosition: "-100px 0",
    color: "bg-orange-50 hover:bg-orange-100",
    textColor: "text-secondary",
    link: "/educacion",
  },
  {
    id: 3,
    title: "Protección social",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pBJqyBrAa4WG6h3Mzq27tfROEIlI9h.png",
    iconPosition: "-200px 0",
    color: "bg-blue-50 hover:bg-blue-100",
    textColor: "text-accent",
    link: "/proteccion",
  },
  {
    id: 4,
    title: "Accesos servicios básicos",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pBJqyBrAa4WG6h3Mzq27tfROEIlI9h.png",
    iconPosition: "-300px 0",
    color: "bg-red-50 hover:bg-red-100",
    textColor: "text-primary",
    link: "/servicios",
  },
  {
    id: 5,
    title: "Desarrollo Económico",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pBJqyBrAa4WG6h3Mzq27tfROEIlI9h.png",
    iconPosition: "0 -200px",
    color: "bg-orange-50 hover:bg-orange-100",
    textColor: "text-secondary",
    link: "/desarrollo",
  },
  {
    id: 6,
    title: "Política Incluir para crecer",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pBJqyBrAa4WG6h3Mzq27tfROEIlI9h.png",
    iconPosition: "-100px -200px",
    color: "bg-blue-50 hover:bg-blue-100",
    textColor: "text-accent",
    link: "/politica",
  },
  {
    id: 7,
    title: "Normas e informes",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pBJqyBrAa4WG6h3Mzq27tfROEIlI9h.png",
    iconPosition: "-200px -200px",
    color: "bg-red-50 hover:bg-red-100",
    textColor: "text-primary",
    link: "/normas",
  },
  {
    id: 8,
    title: "Notas de actualidad",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pBJqyBrAa4WG6h3Mzq27tfROEIlI9h.png",
    iconPosition: "-300px -200px",
    color: "bg-orange-50 hover:bg-orange-100",
    textColor: "text-secondary",
    link: "/notas",
  },
  {
    id: 9,
    title: "Participación ciudadana",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pBJqyBrAa4WG6h3Mzq27tfROEIlI9h.png",
    iconPosition: "0 -400px",
    color: "bg-blue-50 hover:bg-blue-100",
    textColor: "text-accent",
    link: "/participacion",
  },
];

export default function TopicsGrid() {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="mb-8 text-center text-3xl font-bold">
          <span className="relative inline-block">
            Temáticas
            <span className="absolute -bottom-2 left-0 h-1 w-full bg-primary"></span>
          </span>
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {topics.map((topic) => (
            <Link key={topic.id} href={topic.link}>
              <Card
                className={`h-full transition-all duration-300 ${topic.color} border-none shadow-sm hover:shadow-md`}
              >
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white p-4 shadow-sm">
                    <div
                      className="h-16 w-16 bg-contain bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${topic.icon})`,
                        backgroundPosition: topic.iconPosition,
                      }}
                    />
                  </div>
                  <h3 className={`font-medium ${topic.textColor}`}>
                    {topic.title}
                  </h3>
                </CardContent>
                <CardFooter className="flex justify-center pb-4">
                  <div
                    className={`flex items-center text-sm ${topic.textColor}`}
                  >
                    <span className="mr-1">Ver más</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
