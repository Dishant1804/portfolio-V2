import { autoUpdate } from "@floating-ui/dom";

let activeAnchor: HTMLAnchorElement | null = null;
let stopAutoUpdate: (() => void) | null = null;

const POPOVER_GAP = 10;
const VIEWPORT_PADDING = 16;

function isWritingPath(pathname: string) {
  return /^\/writing\/[^/]+/.test(pathname);
}

function isWritingLink(link: HTMLAnchorElement) {
  if (link.dataset.noPopover === "true") return false;

  const href = link.getAttribute("href");
  if (!href || href.startsWith("#")) return false;

  try {
    const url = new URL(link.href, window.location.origin);
    return (
      url.origin === window.location.origin && isWritingPath(url.pathname)
    );
  } catch {
    return false;
  }
}

function getPopoverMount() {
  return document.documentElement;
}

function getAnchorElement(link: HTMLAnchorElement) {
  return link.querySelector<HTMLElement>("[data-popover-anchor]") ?? link;
}

function normalizeRelativeURLs(doc: Document, baseUrl: URL) {
  for (const el of doc.querySelectorAll<HTMLElement>("[href], [src]")) {
    const attr = el.hasAttribute("href") ? "href" : "src";
    const value = el.getAttribute(attr);
    if (
      !value ||
      value.startsWith("#") ||
      value.startsWith("mailto:") ||
      value.startsWith("data:")
    ) {
      continue;
    }

    try {
      const resolved = new URL(value, baseUrl);
      el.setAttribute(
        attr,
        `${resolved.pathname}${resolved.search}${resolved.hash}`
      );
    } catch {
      continue;
    }
  }
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function clearActivePopover() {
  activeAnchor = null;
  stopAutoUpdate?.();
  stopAutoUpdate = null;

  document.querySelectorAll(".popover").forEach((el) => {
    el.classList.remove("active-popover", "popover--measuring");
  });
}

function positionPopover(link: HTMLAnchorElement, popover: HTMLElement) {
  const anchor = getAnchorElement(link);
  const anchorRect = anchor.getBoundingClientRect();
  const popoverWidth = popover.offsetWidth;
  const popoverHeight = popover.offsetHeight;

  let left = anchorRect.left;
  let top = anchorRect.top - popoverHeight - POPOVER_GAP;

  if (top < VIEWPORT_PADDING) {
    top = anchorRect.bottom + POPOVER_GAP;
  }

  left = Math.max(
    VIEWPORT_PADDING,
    Math.min(left, window.innerWidth - popoverWidth - VIEWPORT_PADDING)
  );
  top = Math.max(
    VIEWPORT_PADDING,
    Math.min(top, window.innerHeight - popoverHeight - VIEWPORT_PADDING)
  );

  popover.style.left = `${Math.round(left)}px`;
  popover.style.top = `${Math.round(top)}px`;
  popover.style.right = "auto";
  popover.style.bottom = "auto";
}

async function measureAndPosition(
  link: HTMLAnchorElement,
  popover: HTMLElement
) {
  popover.classList.add("popover--measuring");
  await nextFrame();
  await nextFrame();
  positionPopover(link, popover);
  popover.classList.remove("popover--measuring");
}

function startAutoUpdate(link: HTMLAnchorElement, popover: HTMLElement) {
  stopAutoUpdate?.();
  stopAutoUpdate = autoUpdate(link, popover, () => {
    positionPopover(link, popover);
  });
}

async function showPopover(
  link: HTMLAnchorElement,
  popoverElement: HTMLElement,
  hash: string
) {
  clearActivePopover();
  activeAnchor = link;

  await measureAndPosition(link, popoverElement);
  startAutoUpdate(link, popoverElement);
  popoverElement.classList.add("active-popover");

  if (hash === "") return;

  const targetAnchor = `#popover-internal-${hash.slice(1)}`;
  const heading = popoverElement.querySelector(
    targetAnchor
  ) as HTMLElement | null;

  if (heading) {
    popoverElement.scroll({ top: heading.offsetTop - 12, behavior: "instant" });
  }
}

async function mouseEnterHandler(this: HTMLAnchorElement) {
  const link = this;

  const targetUrl = new URL(link.href, window.location.origin);
  const hash = decodeURIComponent(targetUrl.hash);
  targetUrl.hash = "";
  targetUrl.search = "";

  const popoverId = `popover-${targetUrl.pathname}`;
  const existingPopover = document.getElementById(popoverId);

  if (existingPopover) {
    await showPopover(link, existingPopover, hash);
    return;
  }

  const response = await fetch(targetUrl.pathname).catch((err) => {
    console.error(err);
    return null;
  });

  if (!response?.ok) return;
  if (activeAnchor !== link) return;
  if (document.getElementById(popoverId)) return;

  const contentType = response.headers.get("Content-Type") ?? "text/html";
  const [contentTypeCategory, typeInfo] = contentType.split(";")[0].split("/");

  const popoverElement = document.createElement("div");
  popoverElement.id = popoverId;
  popoverElement.classList.add("popover");

  switch (contentTypeCategory) {
    case "image": {
      const img = document.createElement("img");
      img.src = targetUrl.toString();
      img.alt = targetUrl.pathname;
      popoverElement.appendChild(img);
      break;
    }
    case "application":
      if (typeInfo === "pdf") {
        const pdf = document.createElement("iframe");
        pdf.src = targetUrl.toString();
        popoverElement.appendChild(pdf);
      }
      break;
    default: {
      const contents = await response.text();
      const html = new DOMParser().parseFromString(contents, "text/html");
      normalizeRelativeURLs(html, targetUrl);

      html.querySelectorAll("[id]").forEach((el) => {
        el.id = `popover-internal-${el.id}`;
      });

      const hints = [...html.getElementsByClassName("popover-hint")];
      if (hints.length === 0) return;

      hints.forEach((hint) => popoverElement.appendChild(hint));
      break;
    }
  }

  if (document.getElementById(popoverId)) return;

  popoverElement.addEventListener("mouseenter", () => {
    activeAnchor = link;
    popoverElement.classList.add("active-popover");
  });
  popoverElement.addEventListener("mouseleave", clearActivePopover);

  getPopoverMount().appendChild(popoverElement);

  if (activeAnchor !== link) return;

  await showPopover(link, popoverElement, hash);
}

function bindLink(link: HTMLAnchorElement) {
  if (!link.classList.contains("internal")) {
    link.classList.add("internal");
  }

  const onEnter = () => {
    activeAnchor = link;
    mouseEnterHandler.call(link);
  };
  const onLeave = () => clearActivePopover();

  link.addEventListener("mouseenter", onEnter);
  link.addEventListener("mouseleave", onLeave);

  return () => {
    link.removeEventListener("mouseenter", onEnter);
    link.removeEventListener("mouseleave", onLeave);
  };
}

export function initWritingPopovers() {
  if (typeof window === "undefined") return () => undefined;
  if (window.matchMedia("(max-width: 768px)").matches) return () => undefined;

  const cleanups = [...document.querySelectorAll<HTMLAnchorElement>("a")]
    .filter(isWritingLink)
    .map(bindLink);

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    clearActivePopover();
    document.querySelectorAll(".popover").forEach((el) => el.remove());
  };
}
