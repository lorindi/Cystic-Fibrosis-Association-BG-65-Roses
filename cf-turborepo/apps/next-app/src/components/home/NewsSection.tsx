import CardNews from "@/components/cards/CardNews";
import React from "react";

function NewsSection() {
  const cards = [
    {
      imageUrl: "/images/events.jpg",
      title: "News 1",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
      tags: ["Tag 1", "Tag 2", "Tag 3"],
      link: "/news/1",
      onClick: () => {
        console.log("Card 1 clicked");
      },
    },
    {
      imageUrl: "/images/donations.jpg",
      title: "News 2",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
      tags: ["Tag 4", "Tag 5", "Tag 6"],
      link: "/news/2",
      onClick: () => {
        console.log("Card 2 clicked");
      },
    },
    {
      imageUrl: "/images/rectangle3.jpeg",
      title: "News 3",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
      tags: ["Tag 7", "Tag 8", "Tag 9"],
      link: "/news/3",
      onClick: () => {
        console.log("Card 3 clicked");
      },
    },
  ];
  return (
    <div className="flex flex-col justify-center items-center w-full h-auto px-4 py-8 sm:px-8 xl:px-16 xl:py-20 xl:gap-6 max-w-[1536px]">
      <div className="flex flex-col justify-center items-center w-full py-8 sm:py-17 md:py-10">
        <span className="text-sky-800 text-xs font-medium font-['Montserrat'] uppercase
        sm:leading-normal
        md:text-base
        ">
          Latest news and publications
        </span>
        <h3 className="w-full text-center justify-start text-color-heading text-base font-medium font-['Montserrat'] leading-normal max-w-[884px]
        sm:text-xl sm:leading-loose
        md:text-2xl md:leading-9
        ">
          Stay informed with the latest articles and news about the community
          and the fight against cystic fibrosis.
        </h3>
      </div>
      <div className="flex xl:justify-center w-full xl:px-0 xl:pt-0 gap-6 scroll-smooth touch-pan-x overflow-x-auto custom-scrollbar">
        {cards.map((card) => (
          <div key={card.title} className="flex-shrink-0">
            <CardNews {...card} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsSection;
