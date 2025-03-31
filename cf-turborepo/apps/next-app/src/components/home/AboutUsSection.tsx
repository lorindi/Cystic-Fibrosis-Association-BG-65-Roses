import CardFrame from "@/components/cards/CardFrame";
import React from "react";

function AboutUsSection() {
  return (
    <div className="flex flex-col xl:flex-row items-center justify-center h-auto my-12 lg:my-16 xl:my-[116px] py-8 sm:py-16 xl:py-[76px] px-4 xl:px-16 gap-18 xl:gap-16 w-full max-w-[1536px] rounded-[10px] bg-white">
      <CardFrame
        imageUrls={[
          "/images/rectangle1.jpeg",
          "/images/rectangle2.jpeg",
          "/images/rectangle3.jpeg",
          "/images/rectangle4.jpeg",
        ]}
      />
      <div
        className="flex flex-col justify-center items-center gap-4 w-[90%] xl:w-full xl:px-0
        
           xl:max-w-[800px]"
      >
        <span
          className="self-stretch text-center justify-start text-sky-800 text-xs font-medium font-['Montserrat']
            sm:text-base sm:leading-normal
            xl:text-left
            "
        >
          WHO ARE WE?
        </span>
        <h4
          className="self-stretch text-center justify-start text-color-heading text-base font-medium font-['Montserrat'] leading-normal
        sm:text-xl sm:leading-loose
        md:text-2xl md:leading-9
        xl:text-left

        "
        >
          Information about upcoming conferences and events
        </h4>
        <p
          className="self-stretch text-center justify-start text-color-heading text-sm font-normal  leading-tight
        sm:text-base sm:leading-normal
        xl:text-left
        "
        >
          The website is designed to inform, inspire, and support people
          affected by cystic fibrosis – both patients and their loved ones.
          Here, you will find the latest news and events, valuable information
          about the disease, inspiring stories, and an online store with
          handmade products. The proceeds from sales and donations support the
          cause of improving patients' lives. The project is carried out by a
          team of IT specialists united by the desire to make a positive impact
          and support the community in the fight against cystic fibrosis.
        </p>
      </div>
    </div>
  );
}

export default AboutUsSection;
