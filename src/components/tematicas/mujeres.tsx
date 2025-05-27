import Card from "../animation/card/card";

const cardData = [
    {
        image: "/imgs/objetivo1/obj1.jpg",
        title: "Gobierno regional de ayacucho",
        url: "https://chatgpt.com/",
        color: "#2C7DA0",
    },
    {
        image: "/imgs/objetivo1/obj2.jpg",
        title: "Gobierno regional de ayacucho",
        url: "https://chatgpt.com/",
        color: "#380F72",
    },
    {
        image: "/imgs/objetivo1/obj3.jpg",
        title: "Gobierno regional de ayacucho",
        url: "https://chatgpt.com/",
        color: "#FF0000",
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