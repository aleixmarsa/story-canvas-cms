import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const getInitialsFromEmail = (email: string): string => {
  const namePart = email.split("@")[0];

  const parts = namePart
    .replace(/[^a-zA-Z]/g, " ") // substitueix . _ - per espai
    .split(" ")
    .filter(Boolean);

  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || email[0]?.toUpperCase() || "?";
};

export const normalizeLinks = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const links = doc.querySelectorAll("a[href]");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href &&
      !href.startsWith("http://") &&
      !href.startsWith("https://") &&
      !href.startsWith("/")
    ) {
      link.setAttribute("href", `https://${href}`);
    }
  });

  return doc.body.innerHTML;
};
