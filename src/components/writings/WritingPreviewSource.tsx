import type { Post } from "@/types/blog";

interface WritingPreviewSourceProps {
  post: Post;
  formattedDate: string;
  previewHtml: string;
}

export function WritingPreviewSource({
  post,
  formattedDate,
  previewHtml,
}: WritingPreviewSourceProps) {
  return (
    <article className="popover-hint writing-preview" aria-hidden="true">
      <h2 className="writing-preview__title font-bold text-[var(--blue-color)]">{post.title}</h2>
      <p className="writing-preview__meta ">
        {formattedDate} · {post.readingTime} min read
      </p>
      {post.tags && post.tags.length > 0 && (
        <div className="writing-preview__tags">
          {post.tags.map((tag) => (
            <span key={tag} className="writing-preview__tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div
        className="writing-preview__body"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    </article>
  );
}
