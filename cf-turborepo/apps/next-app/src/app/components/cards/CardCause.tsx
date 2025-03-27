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
    <div className="w-full h-full lg:w-[430px] lg:h-[551px] relative rounded-[10px] overflow-hidden ">
      <Image
        src={imageUrl}
        alt={title}
        width={100}
        height={100}
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 w-[290px] h-[162px] bg-white rounded-[10px] z-10 flex flex-col items-center justify-center shadow-lg">
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
