import CardCategory from "@/app/components/cards/CardCategory";
import React from "react";
import News from "../svgs/News";
import Conferences from "../svgs/Conferences";
import Stories from "../svgs/Stories";

function NavigationCards() {
  const cards = [
    {
      icon: <News className="xl:w-15 xl:h-15 w-6 h-6" />,
      title: "News",
      description: "Latest news and publications about cystic fibrosis.",
      link: "/news",
    },
    {
      icon: <Conferences className="xl:w-15 xl:h-15 w-8 h-8" />,
      title: "Conferences",
      description: "Information about upcoming conferences and events.",
      link: "/conferences",
    },
    {
      icon: <Stories className="xl:w-15 xl:h-15 w-6 h-6" />,
      title: "Stories",
      description: "Your shared stories about cystic fibrosis.",
      link: "/stories",
    },
  ];
  return (
    <div className="flex flex-col lg:justify-center xl:justify-evenly items-center px-4
    mt-[-25px] gap-6
    md:gap-8
    lg:flex-row lg:mt-[-45px] lg:gap-8
    xl:mt-[-50px] xl:gap-8
    ">
      {cards.map((card) => (
        <CardCategory
          key={card.title}
          icon={card.icon}
          title={card.title}
          description={card.description}
          link={card.link}
        />
      ))}
    </div>
  );
}

export default NavigationCards;
