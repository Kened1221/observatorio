import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Containerconsultas() {
  return (
    <main className="flex flex-col h-full bg-white items-center justify-center py-12 px-4">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center gap-10 relative">
        {/* Imagen circular */}
        <div className="relative w-full md:w-1/2 max-w-md">
          <div
            className="aspect-square w-full overflow-hidden border-4 border-white shadow-2xl"
            style={{
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            }}
          >
            <Image
              src="/modulos/participacion/consulta.png"
              alt="Business team collaborating"
              width={600}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="w-full md:w-2/3">
          {/* Accordion para Consulta ciudadana */}
          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="space-y-4"
          >
            <AccordionItem value="item-1" className="overflow-hidden">
              <AccordionTrigger className="px-6 py-3 hover:no-underline bg-[#EF4444] text-white">
                <span className="text-lg font-semibold">
                  Consulta ciudadana
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 text-[#11024D] text-justify">
                Es una plataforma digital diseñada para empoderar a la
                ciudadanía, permitiéndole expresar sus opiniones y percepciones
                sobre los servicios públicos a través de encuestas en línea.
                Este mecanismo se dirige tanto a la población en general como a
                grupos vulnerables, proporcionando un canal accesible y
                participativo donde los ciudadanos pueden compartir sus
                experiencias y evaluar la calidad de los servicios ofrecidos. Al
                recopilar estas percepciones de manera directa, las autoridades
                obtienen una perspectiva crítica y constructiva que refleja las
                verdaderas necesidades y expectativas de la sociedad, lo que es
                fundamental para el desarrollo de políticas públicas más
                efectivas y centradas en el bienestar de la comunidad. La
                encuesta se aplica para conocer la percepción de los usuarios
                sobre los distintos servicios, tales como:
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Otros elementos sin Accordion */}
          <div className="mt-8 space-y-4">
            {[
              "La salud en tus manos: Servicios de Salud",
              "Sabemos alimentarnos: Programas y Servicios de alimentación",
              "Escuelas educadoras: Servicios educativos",
              "Conectados: Servicios telefonía, internet, agua, electricidad y saneamiento",
              "Protegidos: Servicios de protección a la familia",
            ].map((question, index) => (
              <div
                key={index}
                className="border rounded-tl-xl rounded-br-xl overflow-hidden px-6 py-2 hover:bg-gray-50 transition"
              >
                <span className="text-lg font-semibold text-[#11024D]">{`${index + 2
                  }. ${question}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-4 items-center">
        <span className="text-3xl">Tablero de datos</span>
        <div>Graficos</div>
      </div>
    </main>
  );
}
