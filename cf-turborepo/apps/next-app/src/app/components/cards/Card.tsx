import Image from "next/image";
import Button from "../buttons/Button";
import Link from "next/link";

function Card({
  imageUrl,
  title,
  description,
  tags,
  onClick,
  link,
}: {
  imageUrl: string;
  title: string;
  description: string;
  tags: string[];
  onClick: () => void;
  link: string;
}) {
  const ArrowRightIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 md:h-5 w-4 md:w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
  const truncateTitle = (
    text: string,
    maxLength: number = 18
  ): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "";
  };

  const truncateDescription = (
    text: string,
    maxLength: number = 85
  ): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "";
  };
  return (
    <Link href={link} className="flex flex-col relative rounded-[10px] shadow-lg overflow-hidden gap-2 sm:gap-4 m-2
    p-2 lg:p-4
    w-[176px] h-[224px]
    sm:w-[255px] sm:h-[328px]
    md:w-[383px] md:h-[492px]
    lg:w-[430px] lg:h-[522px]
    ">
      <div className="absolute top-0 right-0 pb-2 pl-2 bg-white rounded-[10px]
      lg:pb-4 lg:pl-4
      ">
        <Button
          type="filled-icon"
          icon={<ArrowRightIcon />}
          onClick={onClick}
        />
      </div>
      <div className="flex-1">
        <Image
          src={imageUrl}
          alt={title}
          width={100}
          height={100}
          className="w-full h-full bg-cyan-50 bg-opacity-20 rounded-[10px]"
        />
      </div>
      <div className="flex-1 flex flex-col gap-2 sm:gap-4">
        <ul className="hidden md:flex gap-1 md:gap-2 w-full">
          {tags.map((tag) => (
            <li
              className=" rounded-[100px] outline-1 outline-[#737373] flex justify-center items-center text-[#737373] font-['Montserrat']
              text-sm px-[5px] py-[2px] font-medium
              "
              key={tag}
            >
              {tag}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-0 sm:gap-2 w-full h-full overflow-hidden">
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

export default Card;
