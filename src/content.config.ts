import type { ImageFunction } from "astro/content/config";
import { file } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

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

const headerMenuItem = (image: ImageFunction) => z.object({
  label: z.string(),
  icon: image().transform(transformImagePath(1)).optional(),
  "icon-only": z.boolean().default(false),
  id: z.string().optional(),
  url: z.string().optional()
});

const header = defineCollection({
  type: "data",
  schema: ({ image }) => z.object({
    title: z.string(),
    show: z.boolean().default(true),
    logo: z.object({
      image: image().transform(transformImagePath(1)),
      position: z.enum(["left", "center", "right"]).default("center")
    }),
    "left-menu": z.array(headerMenuItem(image)),
    "right-menu": z.array(headerMenuItem(image))
  })
});

const colorConfig = z.object({
  default: z.string().optional(),
  light: z.string().optional(),
  dark: z.string().optional()
})

const colors = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    primary: colorConfig,
    secondary: colorConfig,
    Highlight: colorConfig,
  })
});

export const collections = {
  header,
  colors
};
