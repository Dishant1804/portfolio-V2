import Link from "next/link";
import type { Heading } from "@/types/blog";

interface TableOfContentsProps {
  headings?: Heading[];
}

export function TableOfContents({ headings = [] }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="w-full p-0">
      <div className="border-b px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="p-0">
          <h2 className="font-medium text-sm sm:text-base">
            Table of Contents
          </h2>
        </div>
        <div>
          <nav className="flex flex-col space-y-1 sm:space-y-2 mt-3 sm:mt-4">
            {headings.map((heading) => (
              <Link
                key={heading.id}
                href={`#${heading.id}`}
                className={`text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base ${
                  heading.level === 2
                    ? "pl-2 sm:pl-4"
                    : heading.level === 3
                    ? "pl-4 sm:pl-8"
                    : heading.level === 4
                    ? "pl-6 sm:pl-12"
                    : ""
                }`}
              >
                {heading.level === 2
                  ? "• "
                  : heading.level === 3
                  ? "◦ "
                  : heading.level === 4
                  ? "◦ "
                  : ""}
                {"  "}
                {heading.text}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
