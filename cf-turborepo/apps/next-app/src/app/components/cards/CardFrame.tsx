import Image from "next/image";
import React from "react";
import logoLung from "../../../../public/images/logoLung.png";
function CardFrame({ imageUrls }: { imageUrls: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full h-full max-w-[271px] max-h-[346px] sm:max-w-[430px] sm:max-h-[468px] md:max-w-[582px] md:max-h-[632px] relative">
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[12px]  w-25 h-25 sm:w-30 sm:h-30 md:w-35 md:h-35 lg:w-44 lg:h-44 bg-sky-100 rounded-full lg:border-[24px] border-white" />
      <Image
        src={logoLung}
        alt="Logo"
        width={100}
        height={100}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-18 h-18 p-2 sm:w-20 sm:h-20 sm:p-2 md:w-28 md:h-28 md:p-4 lg:w-30 lg:h-30 lg:p-4"
      />
      {imageUrls.map((imageUrl, index) => (
        <Image
          key={`card-frame-${index}`}
          src={imageUrl}
          alt="Card Frame"
          width={100}
          height={100}
          className="w-32 h-40 sm:w-52 sm:h-56 md:w-72 md:h-80 bg-cyan-50 bg-opacity-10 rounded-[10px] object-cover"
        />
      ))}
    </div>
  );
}

export default CardFrame;
