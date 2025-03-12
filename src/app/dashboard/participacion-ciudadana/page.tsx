import Card from "@/components/animation/card";
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
      "Expresa tu opinión y comparte tus historias para construir una comunidad inclusiva y dinámica. ¡Tu voz es el motor del cambio!",
    backend: "#F926D4",
    borderColor: "#8405AE",
    frontend: "#E6E6E6",
  },
  {
    id: 2,
    title: "Consultas ciudadanas",
    imageUrl: "/modulos/participacion/consulta.png",
    linkUrl: "/dashboard/participacion-ciudadana/consultas-ciudadanas",
    description:
      "Participa en foros y encuestas que definen políticas públicas. Tus preguntas y comentarios son la base para una sociedad informada y participativa.",
    backend: "#00FE0A", // Azul vibrante
    borderColor: "#097632", // Azul oscuro
    frontend: "#85c1e9", // Azul claro
  },
  {
    id: 3,
    title: "Expresión ciudadana",
    imageUrl: "/modulos/participacion/expresion.png",
    linkUrl: "/dashboard/participacion-ciudadana/expresion-ciudadanas",
    description:
      "Comparte tu creatividad y visión a través del arte y la palabra. Deja que tu expresión inspire la transformación social y fortalezca a la comunidad.",
    backend: "#00FFFF", // Púrpura vibrante
    borderColor: "#8e44ad", // Púrpura oscuro
    frontend: "#B39FBB", // Púrpura claro
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
        {topics.map((topic) => (
          <div key={topic.id} className="w-full p-4">
            <Card
              title={topic.title}
              imageUrl={topic.imageUrl}
              linkUrl={topic.linkUrl}
              description={topic.description}
              backend={topic.backend}
              borderColor={topic.borderColor}
              frontend={topic.frontend}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
