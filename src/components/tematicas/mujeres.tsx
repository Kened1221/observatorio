import Card from "../animation/card/card";

const cardData = [
  {
    image: "/mujer/corte_superior.jpg",
    title: "Corte Superior de Justicia de Ayacucho",
    url: "https://observatorioayacucho.pe/datos-estadisticos/",
    color: "#cb4335",
  },
  {
    image: "/mujer/ministerio_publico.jpg",
    title: "Ministero Público - Fiscalía de la Nación",
    url: "https://observatorioayacucho.pe/datos-estadisticos/",
    color: "#2e86c1",
  },
  {
    image: "/mujer/policia_nacional.jpg",
    title: "Polícia Nacional del Perú",
    url: "https://observatorioayacucho.pe/datos-estadisticos/",
    color: "#28b463",
  },
];

export default function ContainerMujeres() {
  return (
    <div className="flex w-full flex-col sm:flex-row pt-8 sm:pt-16 gap-6 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-28 mx-auto items-center justify-center px-4 sm:px-8 flex-wrap">
      {cardData.map((card, index) => (
        <Card
          key={index}
          image={card.image}
          title={card.title}
          url={card.url}
          color={card.color}
        />
      ))}
    </div>
  );
}
