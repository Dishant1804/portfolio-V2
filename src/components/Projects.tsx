import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import projects from "@/data/projects";
import { useState } from "react";

type CategoryType = "all" | "web" | "AI" | "fun";

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");

  const filterProjects = (category: CategoryType) => {
    if (category === "all") return projects;
    return projects.filter(
      (project) => project.category && project.category.includes(category)
    );
  };

  const filteredProjects = filterProjects(selectedCategory);

  return (
    <div
      id="project"
      className="flex flex-col items-center w-full justify-between text-left gap-4 sm:gap-6 px-4 sm:px-6 lg:px-10"
    >
      <h1 className="tracking-tight underline items-start w-full text-lg sm:text-xl font-semibold">
        Projects
      </h1>
      <div className="flex flex-wrap items-start w-full gap-2 sm:gap-4 lg:gap-6">
        <div
          className={`px-2 py-1 text-xs sm:text-sm border border-primary text-primary w-fit hover:bg-secondary cursor-pointer ${
            selectedCategory === "all" ? "bg-secondary" : ""
          }`}
          onClick={() => setSelectedCategory("all")}
        >
          All projects
        </div>
        <div
          className={`px-2 py-1 text-xs sm:text-sm border border-primary text-primary w-fit hover:bg-secondary cursor-pointer ${
            selectedCategory === "web" ? "bg-secondary" : ""
          }`}
          onClick={() => setSelectedCategory("web")}
        >
          Web projects
        </div>
        <div
          className={`px-2 py-1 text-xs sm:text-sm border border-primary text-primary w-fit hover:bg-secondary cursor-pointer ${
            selectedCategory === "AI" ? "bg-secondary" : ""
          }`}
          onClick={() => setSelectedCategory("AI")}
        >
          AI projects
        </div>
        <div
          className={`px-2 py-1 text-xs sm:text-sm border border-primary text-primary w-fit hover:bg-secondary cursor-pointer ${
            selectedCategory === "fun" ? "bg-secondary" : ""
          }`}
          onClick={() => setSelectedCategory("fun")}
        >
          Fun projects
        </div>
      </div>
      <ul className="flex flex-col gap-3 sm:gap-4 lg:gap-5 w-full">
        {filteredProjects.map((project, index) => (
          <li
            key={index}
            className="flex flex-col sm:flex-row sm:items-start text-left gap-2 sm:gap-4 w-full sm:justify-between min-w-0"
          >
            <Link
              className="flex items-center gap-1 font-medium text-[var(--blue-color)] w-fit sm:w-auto"
              target="_blank"
              href={project.link}
            >
              {project.title}
              <FiArrowUpRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </Link>
            <p className="opacity-80 text-sm sm:text-base break-words overflow-wrap-anywhere max-w-full">
              {project.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
