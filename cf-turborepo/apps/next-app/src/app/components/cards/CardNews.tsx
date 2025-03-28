import Image from "next/image";
import Button from "../buttons/Button";
import Link from "next/link";

function CardNews({
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
      className="h-4 md:h-5 w-4 md:w-5 rotate-[-45deg]"
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
    <Link href={link} className="flex flex-col relative rounded-[10px] shadow-lg gap-2 sm:gap-4 m-2
    p-4
    w-[288px] h-[595px]
    sm:w-[288px] sm:h-[595px]
    md:w-[343px] md:h-[595px]
    lg:w-[343px] lg:h-[595px]
    xl:w-[430px] xl:h-[600px]
    ">
      <div className="absolute top-0 right-0 
      lg:pb-4 lg:pl-4
      ">
        <div className="absolute top-0 right-0 bg-white rounded-[10px] h-[48px] md:h-[52px] w-full min-w-[70px] md:min-w-[90px] max-w-[278px] z-0"></div>
        <Button
          type="filled-icon"
          icon={<ArrowRightIcon />}
          onClick={onClick}
          className="absolute top-0 right-0 hover:top-[-10px] hover:right-[-10px] z-[1px]"
        />
      </div>
      <div className="flex-1">
        <Image
          src={imageUrl}
          alt={title}
          width={300}
          height={300}
          className=" bg-cyan-50 bg-opacity-20 rounded-[10px] object-cover w-full h-[150px] sm:h-[179px] md:h-[208px] lg:h-[236px] xl:h-[265px]"
        />
      </div>
      <div className="flex-1 flex flex-col gap-2 sm:gap-4 ">
        <ul className="flex gap-2 w-full">
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
        <div className="flex flex-col justify-center gap-0 sm:gap-2 w-full h-full overflow-hidden">
          <h2 className="text-color-heading font-semibold font-['Montserrat'] 
          text-sm 
          sm:text-base
          md:text-2xl
        ">{truncateTitle(title)}</h2>
          <p className="text-color-paragraph font-normal font-['Montserrat']
            text-xs
            sm:text-sm
            md:text-base
        ">{truncateDescription(description)}</p>
        </div>
      </div>
    </Link>
  );
}

export default CardNews;
