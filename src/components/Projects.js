import Link from "next/link"
import { FiArrowUpRight } from "react-icons/fi"
import projects from "@/data/projects";
import { useState } from "react";

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filterProjects = (category) => {
    if (category === "all") return projects;
    return projects.filter(project => 
      project.category && project.category.includes(category)
    );
  };

  const filteredProjects = filterProjects(selectedCategory);

  return <div id="project" className="flex flex-col items-center w-full justify-between text-left gap-6 px-10">
    <h1 className="tracking-tight underline items-start w-full text-xl font-semibold">Projects</h1>
    <div className="flex flex-wrap items-start w-full gap-6">
      <div 
        className={`px-2 py-1 text-sm border border-primary text-primary w-fit hover:bg-secondary cursor-pointer ${selectedCategory === "all" ? "bg-secondary" : ""}`}
        onClick={() => setSelectedCategory("all")}
      >
        All projects
      </div>
      <div 
        className={`px-2 py-1 text-sm border border-primary text-primary w-fit hover:bg-secondary cursor-pointer ${selectedCategory === "web" ? "bg-secondary" : ""}`}
        onClick={() => setSelectedCategory("web")}
      >
        Web projects
      </div>
      <div 
        className={`px-2 py-1 text-sm border border-primary text-primary w-fit hover:bg-secondary cursor-pointer ${selectedCategory === "AI" ? "bg-secondary" : ""}`}
        onClick={() => setSelectedCategory("AI")}
      >
        AI projects
      </div>
      <div 
        className={`px-2 py-1 text-sm border border-primary text-primary w-fit hover:bg-secondary cursor-pointer ${selectedCategory === "fun" ? "bg-secondary" : ""}`}
        onClick={() => setSelectedCategory("fun")}
      >
        Fun projects
      </div>
    </div>
    <ul className="flex flex-col gap-5 w-full">
      {filteredProjects.map((project, index) => (
        <li
          key={index}
          className="flex items-center text-left gap-2 w-full justify-between  max-[590px]:flex-col max-[590px]:items-start"
        >
          <Link
            className="flex items-center gap-1 font-medium justify-between text-[var(--blue-color)]  max-[590px]:w-full"
            target="_blank"
            href={project.link}
          >
            {project.title}
            <FiArrowUpRight size={18} />
          </Link>
          <p className="opacity-80">{project.description}</p>
        </li>
      ))}
    </ul>
  </div>
}

export default Projects