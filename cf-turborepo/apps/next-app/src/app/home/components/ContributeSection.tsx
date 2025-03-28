import CardCause from "@/app/components/cards/CardCause";
import React from "react";

function ContributeSection() {
  const cards = [
    {
      imageUrl: "/images/events.jpg",
      title: "Events",
      description: "We share important information about upcoming conferences.",
      link: "/",
    },
    {
      imageUrl: "/images/donations.jpg",
      title: "Donations",
      description: "We organize various charity campaigns and events.",
      link: "/",
    },
    {
      imageUrl: "/images/rectangle3.jpeg",
      title: "Stories",
      description: "We share real and personal stories of people affected by the disease.",
      link: "/",
    },
  ];

  return (
    <div className="hidden xl:flex flex-col px-16 bg-sky-100 pt-[76px] pb-[76px] mx-16 rounded-[10px] h-auto w-full max-w-[1536px]">
      <div className="flex flex-col gap-3 pl-24 pb-24">
        <span className="justify-start text-sky-800 text-base font-medium font-['Montserrat'] leading-normal uppercase">
          Our Mission
        </span>
        <h2 className="w-[884px] justify-start text-color-heading text-3xl font-semibold font-['Montserrat'] leading-10 mb-6">
          Everyone is welcome, and everyone has the opportunity to contribute to
          a better tomorrow.
        </h2>
        <p className="w-[880px] justify-start text-color-heading text-xl font-medium font-['Montserrat'] leading-loose">
          You can become part of the cause, regardless of whether you are
          directly affected by cystic fibrosis. A simple act of solidarity is
          enough - by participating in an event, making a donation, or
          purchasing a product. Together, we can make tomorrow better.
        </p>
      </div>

      <div className="flex justify-center items-center w-full gap-25">
        {cards.map((card) => (
          <CardCause
            key={card.title}
            imageUrl={card.imageUrl}
            title={card.title}
            description={card.description}
            link={card.link}
          />
        ))}
      </div>
    </div>
  );
}

export default ContributeSection;
