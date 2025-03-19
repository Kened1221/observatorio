import Card3 from "@/components/animation/card3";
import Card2 from "@/components/animation/card2";
import Image from "next/image";

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

const topics: Topic[] = [
  {
    id: 1,
    title: "Voces ciudadanas",
    imageUrl: "/modulos/participacion/voces.png",
    linkUrl: "/dashboard/participacion-ciudadana/voces-ciudadanas",
    description:
      "Comparte tus historias y opiniones para crear una comunidad inclusiva y participativa. Tu voz importa.",
    backend: "#FF4081",
    borderColor: "#FF4081", 
    frontend: "#fff", 
  },
  {
    id: 2,
    title: "Consultas ciudadanas",
    imageUrl: "/modulos/participacion/consulta.png",
    linkUrl: "/dashboard/participacion-ciudadana/consultas-ciudadanas",
    description:
      "Tus preguntas y comentarios son esenciales para una sociedad más informada y participativa.",
    backend: "#2196F3",
    borderColor: "#2196F3",
    frontend: "#fff",
  },
  {
    id: 3,
    title: "Expresión ciudadana",
    imageUrl: "/modulos/participacion/expresion.png",
    linkUrl: "/dashboard/participacion-ciudadana/expresion-ciudadanas",
    description:
      "Comparte tu creatividad a través del arte y la palabra para inspirar cambios y transformación social.",
    backend: "#FF9800",
    borderColor: "#FF9800", 
    frontend: "#fff", 
  },
];

export default function Page() {
  return (
    <div className="container mx-auto px-4 lg:py-8">
      {/* Sección superior: Imagen y Card2 */}
      <div className="flex flex-col lg:flex-row items-center gap-8 rounded-2xl p-8 overflow-hidden">
        <Image
          src="/modulos/participacion/logo.png"
          alt="Participacion"
          width={500}
          height={500}
          className="rounded-2xl w-full md:w-auto"
        />
        <Card2
          title="Participación ciudadana"
          text="Tu participación es fundamental para transformar nuestra sociedad.
      En nuestro observatorio de desarrollo social, queremos que seas
      parte activa del cambio. No solo vigilamos las acciones del
      gobierno, sino que te invitamos a colaborar en la creación de
      políticas públicas que respondan a tus necesidades. A través de
      Voces Ciudadanas, escuchamos tus opiniones y sugerencias desde
      cualquier medio o red social. Con Expresión Ciudadana, líderes y
      expertos comparten ideas para enfrentar los retos actuales, y en
      nuestras consultas ciudadanas tienes la oportunidad de expresar lo
      que piensas sobre los servicios que recibes. ¡Únete y haz que tu voz
      cuente!"
        />
      </div>

      {/* Sección de topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 justify-items-center">
        {topics.map((topic) => (
          <Card3 key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}
