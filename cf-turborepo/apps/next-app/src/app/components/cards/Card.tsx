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
  const truncateDescription = (
    text: string,
    maxLength: number = 258
  ): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };
  return (
    <div className="flex flex-col relative p-4 rounded-[10px] shadow-lg
    lg:w-[430px] lg:h-[522px]
    ">
      <div className="flex justify-end items-center absolute top-0 right-0">
        <Button
          type="filled-icon"
          icon={<ArrowRightIcon />}
          onClick={onClick}
        />
      </div>
      <div className="flex-1 flex justify-center items-center w-full h-full">
        <Image
          src={imageUrl}
          alt={title}
          width={100}
          height={100}
          className="w-full h-full bg-cyan-50 bg-opacity-20 rounded-[10px]"
        />
      </div>
      <div className="flex-1 w-full h-full my-2 flex flex-col gap-2">
        <ul className="flex gap-2 ">
          {tags.map((tag) => (
            <li
              className="px-[5px] py-[2px] rounded-[100px] outline-1 outline-[#737373] flex justify-center items-center text-[#737373] text-xs font-medium font-['Montserrat']"
              key={tag}
            >
              {tag}
            </li>
          ))}
        </ul>
        <div className="flex flex-col">
          <h2 className="text-color-heading font-semibold font-['Montserrat']
        lg:text-2xl
        ">{title}</h2>
          <p className="text-color-paragraph  font-normal font-['Montserrat'] leading-normal
        lg:text-base
        ">{truncateDescription(description)}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
