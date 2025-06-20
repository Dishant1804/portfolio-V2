import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";


const Blogs = ({ posts }) => {
  return (
    <div id="blog" className="flex flex-col items-center w-full justify-between text-left gap-6 px-10">
      <h1 className="tracking-tight underline items-start w-full text-xl font-semibold">Blogs</h1>
      <ul className="flex flex-col gap-5 w-full">
        {posts?.map((post) => (
          <li
            key={post.slug}
            className="flex items-center text-left gap-2 w-full justify-between max-[590px]:flex-col max-[590px]:items-start"
          >
            <Link
              className="flex items-center gap-1 font-medium justify-between text-[var(--blue-color)] max-[590px]:w-full"
              href={`/writing/${post.slug}`}
            >
              {post.title}
              <span>
                <FiArrowUpRight size={18} />
              </span>
            </Link>
            <p className="opacity-80 text-left">{post.date}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blogs