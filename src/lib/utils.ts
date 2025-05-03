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
  return html.replace(/<a\s+[^>]*href="([^"]+)"[^>]*>/g, (match, href) => {
    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("/")
    ) {
      return match;
    }
    const normalized = `https://${href}`;
    return match.replace(href, normalized);
  });
};
