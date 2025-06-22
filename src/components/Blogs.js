import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const Blogs = ({ posts }) => {
  return (
    <div id="blog" className="flex flex-col items-center w-full justify-between text-left gap-6 px-4 sm:px-6 md:px-10">
      <h1 className="tracking-tight underline items-start w-full text-lg sm:text-xl font-semibold">Blogs</h1>
      <ul className="flex flex-col gap-4 sm:gap-5 w-full">
        {posts?.map((post) => (
          <li
            key={post.slug}
            className="flex items-center text-left gap-2 w-full justify-between sm:flex-row flex-col items-start"
          >
            <Link
              className="flex items-center gap-1 font-medium justify-between text-[var(--blue-color)] w-full sm:w-auto"
              href={`/writing/${post.slug}`}
            >
              <span className="flex-1 sm:flex-none">{post.title}</span>
              <span>
                <FiArrowUpRight size={18} />
              </span>
            </Link>
            <p className="opacity-80 text-left text-sm sm:text-base whitespace-nowrap">{post.date}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blogs
