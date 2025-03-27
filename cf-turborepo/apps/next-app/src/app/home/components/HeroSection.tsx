import Button from "@/app/components/buttons/Button";
import React from "react";

function HeroSection() {
  return (
    <section className="w-full h-auto sm:h-[364px] md:h-[478px] lg:h-[520px] xl:h-[714px] flex flex-col gap-4 sm:gap-none sm:flex-row overflow-hidden">
      <div className="w-full sm:w-[50%] h-full sm:bg-[#f4f4f5] sm:shadow-[30px_0_50px_50px_#f4f4f5] flex flex-col sm:flex-row mt-[32px] sm:mt-0">
        <div
          className="flex flex-col justify-center sm:justify-start items-center sm:items-start gap-[12px] sm:gap-[16px] w-full h-full 
        sm:pl-8 sm:pt-8
        md:pl-16 md:pt-24
        lg:pl-16 lg:pt-24
        xl:pl-52 xl:pt-32
        "
        >
            
          <h1
            className="text-color-heading font-['Montserrat'] w-full
          text-xl leading-7 font-medium text-center max-w-72
          sm:text-2xl sm:leading-9 sm:text-start sm:max-w-[455px]
          md:text-3xl md:font-semibold md:leading-10 md:max-w-[491px]
          lg:max-w-[641px]
          xl:text-4xl xl:leading-[58.50px] xl:max-w-[884px]
          "
          >
            Support, information and hope for people with cystic fibrosis
          </h1>

          <p
            className="text-[#262626] font-['Montserrat'] w-full
          max-w-72 text-center text-sm font-normal leading-tight
          sm:text-base sm:max-w-[303px] sm:font-medium sm:leading-normal sm:text-start
          md:lg:text-base md:max-w-[367px]
          xl:text-xl xl:leading-loose xl:max-w-[600px]
          "
          >
            See the latest news, stories and products to help those living with
            cystic fibrosis.
          </p>

          <Button
            text="See current news"
            type="primary"
            className="mt-[16px]"
          />

        </div>
      </div>
      <div className="m-auto w-72 h-44 rounded-[10px] sm:m-none sm:rounded-none sm:w-[50%] sm:h-full bg-[url('/images/homeImg.jpeg')] object-cover bg-cover bg-center bg-no-repeat z-[-1] opacity-80" />
    </section>
  );
}

export default HeroSection;
