import { file } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const generateSlug = (title?: string) => {
  return title ? 
    title.toLowerCase().replace(/\s+/g, "-") : 
    Array.from({ length: 8 }, () => Math.random().toString(36)[2]).join("");
}

const verifySlug = (json: Record<any, any>) => {
  if (Object.keys(json).includes("slug")) {
    return json;
  }

  return {
    ...json,
    slug: generateSlug(json.title)
  }
}

const jsonParser = (prop?: string) => (text: string) => {
  const json = prop ? JSON.parse(text)[prop] : JSON.parse(text);

  if (!Array.isArray(json)) {
    return [verifySlug(json)]
  };

  return json.map(verifySlug);
}

const transformImagePath = (deep = 1) => (arg: unknown) => {
  const path = (arg as string).replace("__ASTRO_IMAGE_", "");
  const segments = Array(deep).fill("..").join("/");

  return `__ASTRO_IMAGE_${segments}/${path.replace(/^(\.\.\/)+/, "")}`.replace(/\/+/g, '/') as unknown as ImageMetadata;
};

export const collections = {};