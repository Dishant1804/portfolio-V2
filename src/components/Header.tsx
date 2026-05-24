"use client";

import Link from "next/link";
import Image from "next/image";
import { Divider } from "./ui/divider";

interface ScrollToProjectParams {
  id: string;
}

const Header = () => {
  const scrollToProject = ({ id }: ScrollToProjectParams) => {
    const projectElement = document.getElementById(id);
    if (projectElement) {
      projectElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="flex flex-col gap-6 text-justify justify-evenly">
        {/* <nav className="flex flex-col md:flex-row gap-4 px-4 md:px-10">
          <h3
            className="underline text-[var(--blue-color)] underline-offset-4 cursor-pointer text-sm md:text-base"
            onClick={() => scrollToProject({ id: "blog" })}
          >
            Blogs
          </h3>
          <span className="hidden md:flex">//</span>
          <h3
            className="underline text-[var(--blue-color)] underline-offset-4 cursor-pointer text-sm md:text-base"
            onClick={() => scrollToProject({ id: "project" })}
          >
            Projects
          </h3>{" "}
          <span className="hidden md:flex">//</span>
          <h3
            className="underline text-[var(--blue-color)] underline-offset-4 cursor-pointer text-sm md:text-base"
            onClick={() => {
              scrollToProject({ id: "contributions" });
            }}
          >
            Contributions
          </h3>
        </nav> */}

        <Divider />

        <div className="flex flex-col gap-4 md:gap-6 px-4 md:px-10">
          <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-4 md:gap-6">
              <h1 className="tracking-tight underline text-lg md:text-xl font-semibold">
                About
              </h1>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col">
                  <h1 className="tracking-tight text-base">
                   Hey! I'm Dishant ^_^ <br />
                   I build things that people use, break and accidentally depend upon :P<br />
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 md:gap-4 flex-wrap">
            <Link
              className="underline text-[var(--blue-color)] underline-offset-4 text-sm md:text-base"
              href="https://x.com/dishantwt_"
              target="_blank"
            >
              twitter/x
            </Link>
            <span className="hidden sm:inline">//</span>
            <Link
              className="underline text-[var(--blue-color)] underline-offset-4 text-sm md:text-base"
              href="https://github.com/Dishant1804"
              target="_blank"
            >
              github
            </Link>
            <span className="hidden sm:inline">//</span>
            <Link
              className="underline text-[var(--blue-color)] underline-offset-4 text-sm md:text-base"
              href="https://www.linkedin.com/in/dishantmiyani/"
              target="_blank"
            >
              linkedIn
            </Link>
            <span className="hidden sm:inline">//</span>
            <Link
              className="underline text-[var(--blue-color)] underline-offset-4 text-sm md:text-base"
              href="mailto:dishantmiyani1804@gmail.com"
              target="_blank"
            >
              email
            </Link>
          </div>
          <div className="flex flex-wrap">
            <Link
              href="https://cal.com/dishant-miyani/meet"
              target="_blank"
              className="px-3 py-2 md:px-4 border border-primary text-primary w-fit hover:bg-secondary text-sm md:text-base"
            >
              Book a Call
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
