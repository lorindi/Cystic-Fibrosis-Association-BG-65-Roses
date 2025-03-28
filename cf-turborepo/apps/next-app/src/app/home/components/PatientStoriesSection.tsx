import Button from "@/app/components/buttons/Button";
import CardHistory from "@/app/components/cards/CardHistory";
import React from "react";

function PatientStoriesSection() {
  const stories = [
    {
      id: 1,
      title: "Story 1",
      description: "Description 1",
      imageUrl: "/images/rectangle1.jpeg",
      link: "/story1",
    },
    {
      id: 2,
      title: "Story 2",
      description: "Description 1",
      imageUrl: "/images/rectangle2.jpeg",
      link: "/story2",
    },
    {
      id: 3,
      title: "Story 3",
      description: "Description 3",
      imageUrl: "/images/rectangle3.jpeg",
      link: "/story3",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-8 sm:px-8 xl:px-16 gap-8 lg:gap-18 xl:gap-0 max-w-[1536px]">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
        <div className="flex flex-col items-center justify-center sm:items-start">
          <span
            className="text-sky-800 text-xs font-medium font-['Montserrat'] uppercase
          sm:text-base sm:leading-normal
          "
          >
            SHARED STORIES
          </span>
          <h3
            className="text-center sm:text-left text-color-heading text-base font-medium font-['Montserrat'] leading-normal w-full 
          sm:max-w-96 sm:text-xl sm:leading-loose
          md:text-2xl md:leading-9 md:max-w-[536px] 
          lg:max-w-[716px]
          "
          >
            Real stories shared by patients and their loved ones to support you.
          </h3>
        </div>

        <div className="w-auto my-5">
          <Button text="Read more" type="outlined-text" onClick={() => {}} />
        </div>
      </div>
      <div className="flex lg:justify-start lg:items-center w-full xl:pt-11 gap-6 scroll-smooth overflow-x-auto custom-scrollbar">
        {stories.map((story) => (
          <div key={story.id} className="">
            <CardHistory
              key={story.id}
              imageUrl={story.imageUrl}
              title={story.title}
              description={story.description}
              link={story.link}
              onClick={() => {}}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientStoriesSection;
