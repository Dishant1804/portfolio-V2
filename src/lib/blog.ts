import fs from "fs";
import path from "path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import container from "markdown-it-container";
import markdownItAnchor from "markdown-it-anchor";
import Prism from "prismjs";
import type { Post, Heading, MarkdownResult } from "@/types/blog";

const postsDirectory = path.join(process.cwd(), "content/writings");

export function getReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function createPreviewHtml(html: string, excerpt?: string): string {
  if (excerpt?.trim()) {
    return `<p>${escapeHtml(excerpt.trim())}</p>`;
  }

  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "";

  const snippet = text.length > 320 ? `${text.slice(0, 320).trim()}…` : text;
  return `<p>${escapeHtml(snippet)}</p>`;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isInternalWritingHref(href: string) {
  return (
    href.startsWith("/writing/") ||
    href.startsWith("./writing/") ||
    href.startsWith("../writing/")
  );
}

export function getAllPosts(): Post[] {
  try {
    // If directory is empty or doesn't exist, return empty array
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);

    if (!fileNames.length) {
      return [];
    }

    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
          slug,
          content,
          ...data,
        } as Post;
      });

    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error("Error getting posts:", error);
    return [];
  }
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    content,
    ...data,
  } as Post;
}

export async function markdownToHtml(
  markdown: string
): Promise<MarkdownResult> {
  const headings: Heading[] = [];
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str: string, lang: string) {
      if (lang && Prism.languages[lang]) {
        try {
          return `<pre class="language-${lang}" tabindex="0"><code class="language-${lang}">${Prism.highlight(
            str,
            Prism.languages[lang],
            lang
          )}</code></pre>`;
        } catch {
          return "";
        }
      }
      return "";
    },
  })
    .use(markdownItAnchor, {
      permalink: true,
      permalinkClass: "anchor",
      permalinkSymbol: "#",
      callback: (token: any, info: any) => {
        headings.push({
          level: parseInt(token.tag.slice(1)),
          text: info.title,
          id: info.slug,
        });
      },
    })
    .use(require("markdown-it-footnote"))
    .use(require("markdown-it-sup"))
    .use(require("markdown-it-sub"))
    .use(require("markdown-it-ins"))
    .use(require("markdown-it-mark"))
    .use(require("markdown-it-deflist"))
    .use(require("markdown-it-abbr"))
    .use(container, "warning")
    .use(container, "alert")
    .use(container, "info")
    .use(container, "note")
    .use(container, "tip");

  const defaultLinkOpen =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet("href");
    if (href && isInternalWritingHref(href)) {
      const existingClass = tokens[idx].attrGet("class");
      tokens[idx].attrSet(
        "class",
        existingClass ? `${existingClass} internal` : "internal"
      );
    }
    return defaultLinkOpen(tokens, idx, options, env, self);
  };

  const html = md.render(markdown);
  return { html, headings };
}
