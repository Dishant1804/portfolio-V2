import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import experience from "@/data/experience";

const Experience = () => {
  return (
    <div
      id="project"
      className="flex flex-col items-center w-full justify-between text-left gap-6 px-4 sm:px-6 md:px-10"
    >
      <h1 className="tracking-tight underline items-start w-full text-lg sm:text-xl font-semibold">
        Experience
      </h1>
      <ul className="flex flex-col gap-4 sm:gap-6 w-full">
        {experience.map((exp, index) => (
          <li
            key={index}
            className="flex items-start sm:items-center text-left gap-2 w-full justify-between flex-col sm:flex-row"
          >
            <div className="flex flex-row items-center leading-relaxed gap-3 w-full sm:w-auto">
              <Image
                src={exp.imgsrc}
                alt=""
                height={40}
                width={40}
                className="rounded-full hidden sm:flex"
              />
              <div className="flex flex-col items-start leading-relaxed flex-1">
                <Link
                  className="flex items-center gap-1 font-medium text-[var(--blue-color)] w-full"
                  target="_blank"
                  href={exp.link}
                >
                  {exp.company}
                  <FiArrowUpRight className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                </Link>
                <h4 className="text-xs sm:text-sm">{exp.title}</h4>
              </div>
            </div>
            <p className="opacity-80 text-xs sm:text-sm md:text-base mt-2 sm:mt-0 self-start sm:self-center">
              {exp.timeline}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Experience;
