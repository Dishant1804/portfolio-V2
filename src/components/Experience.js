import Image from "next/image"
import Link from "next/link"
import { FiArrowUpRight } from "react-icons/fi";
import experience from "@/data/experience"


const Experience = () => {
  return <div id="project" className="flex flex-col items-center w-full justify-between text-left gap-6 px-10">
    <h1 className="tracking-tight underline items-start w-full text-xl font-semibold">Experience</h1>
    <ul className="flex flex-col gap-6 w-full">
      {experience.map((experience, index) => (
        <li
          key={index}
          className="flex items-center text-left gap-2 w-full justify-between  max-[590px]:flex-col max-[590px]:items-start"
        >
          <div className="flex flex-row items-center leading-relaxed gap-3">
            <Image src={experience.imgsrc} alt="" height={40} width={40} className="rounded-full" />
            <div className="flex flex-col items-start leading-relaxed">
              <Link
                className="flex items-center gap-1 font-medium justify-between text-[var(--blue-color)] max-[590px]:w-full"
                target="_blank"
                href={experience.link}
              >
                {experience.company}
                <FiArrowUpRight size={18} />
              </Link>
              <h4 className="text-sm">{experience.title}</h4>
            </div>
          </div>
          <p className="opacity-80">{experience.timeline}</p>
        </li>
      ))}
    </ul>
  </div>
}

export default Experience