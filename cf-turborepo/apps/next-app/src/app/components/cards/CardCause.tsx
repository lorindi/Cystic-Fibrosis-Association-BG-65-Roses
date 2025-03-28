import Image from "next/image";
import React from "react";

function CardCause({
  imageUrl,
  title,
  description,
  link,
}: {
  imageUrl: string;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <div className=" w-[258px] h-[313px]
      sm:w-[301px] sm:h-[365px]
      md:w-[344px] md:h-[417px]
      lg:w-[387px] lg:h-[469px]
      xl:w-[430px] xl:h-[522px] relative rounded-[10px] overflow-hidden ">
      <Image
        src={imageUrl}
        alt={title}
        width={430}
        height={551}
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 w-full h-full max-w-[290px] max-h-[162px] bg-white rounded-[10px] z-10 flex flex-col items-center justify-center shadow-lg m-2">
        <h4 className="text-color-heading text-xl font-bold font-['Montserrat'] leading-loose">
          {title}
        </h4>
        <p className="w-60 text-center text-color-paragraph text-base font-normal font-['Montserrat'] leading-normal">
          {description} 
        </p>
        
      </div>
    </div>
  );
}

export default CardCause;
