import Image from "next/image";
import Button from "../buttons/Button";

function Card({
  imageUrl,
  title,
  description,
  tags,
  onClick,
}: {
  imageUrl: string;
  title: string;
  description: string;
  tags: string[];
  onClick: () => void;
}) {
  const ArrowRightIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
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
    maxLength: number = 28
  ): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "";
  };

  const truncateDescription = (
    text: string,
    maxLength: number = 220
  ): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "";
  };
  return (
    <div className="flex flex-col relative rounded-[10px] shadow-lg overflow-hidden
    p-2 lg:p-4
    w-[176px] h-[224px]
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
      <div className="flex-1 flex flex-col gap-0 md:gap-2">
        <ul className="flex gap-1 md:gap-2 w-full my-1 md:my-2 ">
          {tags.map((tag) => (
            <li
              className=" rounded-[100px] outline-1 outline-[#737373] flex justify-center items-center text-[#737373]  font-['Montserrat']
              text-[8px] px-1 py-0 font-bold
              sm:text-[10px] 
              md:text-xs md:px-[5px] md:py-[2px] md:font-medium
              "
              key={tag}
            >
              {tag}
            </li>
          ))}
        </ul>
        <div className="flex flex-col md:gap-2 w-full h-full">
          <h2 className="text-color-heading font-semibold font-['Montserrat'] 
          text-sm 
          sm:text-base
          md:text-2xl
        ">{truncateTitle(title)}</h2>
          <p className="text-color-paragraph font-normal font-['Montserrat'] text-xs leading-none
          md:leading-5 md:text-base
            lg:text-base lg:leading-normal
        ">{truncateDescription(description)}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
