import Image from 'next/image';
import React from 'react'
import Button from '../buttons/Button';
import Link from 'next/link';

function CardHistory({imageUrl,
    title,
    description,
    onClick,
    link,
  }: {
    imageUrl: string;
    title: string;
    description: string;
    onClick: () => void;
    link: string;
  }) {

    const truncateTitle = (
      text: string,
      maxLength: number = 18
    ): string => {
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + "";
    };
  
    const truncateDescription = (
      text: string,
      maxLength: number = 100
    ): string => {
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + "...";
    };
    return (
      <Link href={link} className="flex flex-col relative rounded-[10px] shadow-lg overflow-hidden gap-2 m-2 bg-[#ecfeff]
     
      w-[258px] h-[313px]
      sm:w-[279px] sm:h-[365px]
      md:w-[345px] md:h-[417px]
      lg:w-[473px] lg:h-[469px]
      xl:w-[675px] xl:h-[522px]
      ">
        <div className="absolute bottom-2 right-2 bg-white rounded-[10px]
        ">
          <Button
            type="filled-text"
            text="Read more"
            onClick={onClick}
          />
        </div>
        <div className="h-[50%] md:h-[60%]">
          <Image
            src={imageUrl}
            alt={title}
            width={300}
            height={300}
            className="w-full h-full bg-cyan-50 bg-opacity-20 rounded-t-[10px] object-cover"
          />
        </div>
        <div className="h-[50%] md:h-[40%] flex flex-col gap-2">
    
          <div className="flex flex-col gap-0 sm:gap-2 w-full h-full overflow-hidden p-4 sm:p-6 md:p-8 lg:p-10">
            <h2 className="text-color-heading font-semibold font-['Montserrat'] 
            text-sm 
            sm:text-base
            md:text-2xl
          ">{truncateTitle(title)}</h2>
            <p className="text-color-paragraph font-normal font-['Montserrat']
              text-[11px]
              sm:text-sm
              md:text-base
              lg:text-base 
          ">{truncateDescription(description)}</p>
          </div>
        </div>
      </Link>
    );
  }
export default CardHistory