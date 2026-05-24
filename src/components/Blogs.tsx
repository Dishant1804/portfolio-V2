import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import type { Post } from "@/types/blog";

interface BlogsProps {
  posts: Post[];
}

const Blogs = ({ posts }: BlogsProps) => {
  return (
    <div
      id="blog"
      className="flex flex-col items-center w-full justify-between text-left gap-6 px-4 sm:px-6 md:px-10"
    >
      <h1 className="tracking-tight underline items-start w-full text-lg sm:text-xl font-semibold">
        Writing
      </h1>
      <ul className="flex flex-col gap-4 sm:gap-5 w-full">
        {posts?.map((post) => (
          <li
            key={post.slug}
            className="flex text-left gap-2 w-full justify-between sm:flex-row flex-col items-start"
          >
            <Link
              className="internal group flex w-fit max-w-full items-center gap-1 font-medium text-[var(--blue-color)] underline decoration-transparent underline-offset-4 transition-[text-decoration-color,opacity] duration-200 ease-out hover:decoration-[var(--blue-color)] hover:opacity-90"
              href={`/writing/${post.slug}`}
            >
              <span data-popover-anchor>{post.title}</span>
              <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <FiArrowUpRight size={18} />
              </span>
            </Link>
            <p className="opacity-80 text-left text-sm sm:text-base whitespace-nowrap">
              {post.date}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;
