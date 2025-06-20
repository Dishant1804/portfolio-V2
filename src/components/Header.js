"use client";

import Link from "next/link";
import Image from "next/image";
import { Divider } from "./ui/divider";

const Header = () => {

  const scrollToProject = ({id}) => {
    const projectElement = document.getElementById(id);
    if (projectElement) {
      projectElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  return (
    <>
      <header className="flex flex-col gap-16 text-justify justify-evenly">
        <nav className="flex flex-row gap-4 px-10">
          <h3 className="underline text-[var(--blue-color)] underline-offset-4 cursor-pointer" onClick={()=> scrollToProject({id: 'blog'})}>Blogs</h3>//
          <h3 className="underline text-[var(--blue-color)] underline-offset-4 cursor-pointer" onClick={()=> scrollToProject({id: 'project'})} >Projects</h3> //
          <h3 className="underline text-[var(--blue-color)] underline-offset-4 cursor-pointer" onClick={() =>{scrollToProject({id : 'contributions'})}}>Contributions</h3>
        </nav>

        <Divider />

        <div className="flex flex-col gap-6  px-10  ">
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col gap-6">
              <h1 className="tracking-tight underline text-xl font-semibold">About</h1>
              <h1 className="tracking-tight text-lg">Dishant Miyani</h1>
            </div>
            <Image
              src="/profile.jpeg"
              alt="Dishant Miyani profile picture"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
          <p className="text-left">
            &gt; Engineer, with a passion to convert ideas into code <br></br>
            &gt; loves to work on something new everyday <br></br>
            &gt; currently building AI agents <br></br>
          </p>
          <div className="flex gap-4 flex-wrap py-6">
            <Link
              className="underline text-[var(--blue-color)] underline-offset-4"
              href="https://x.com/MiyaniDishant"
              target="_blank"
            >
              twitter/x
            </Link>
          //
            <Link
              className="underline text-[var(--blue-color)] underline-offset-4"
              href="https://github.com/Dishant1804"
              target="_blank"
            >
              github
            </Link>
          //
            <Link
              className="underline text-[var(--blue-color)] underline-offset-4"
              href="https://www.linkedin.com/in/dishantmiyani/"
              target="_blank"
            >
              linkedIn
            </Link>
          </div>
          <div className="flex flex-wrap">
            <Link
              href="https://cal.com/dishant-miyani/meet"
              target="_blank"
              className="px-4 py-2 border border-primary text-primary w-fit hover:bg-secondary"
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
