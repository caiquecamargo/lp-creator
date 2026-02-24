import type { AnyEntryMap, CollectionEntry } from "astro:content";

const transformImagePath = (deep = 2) => (arg: unknown): string => {
  const path = (arg as string);
  const segments = Array(deep).fill("..").join("/");

  return `${segments}/${path.replace(/^(\.\.\/)+/, "")}`;
}

export function transformImage <C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(entry: E): E {
  const data = entry.data;
  const keys = Object.keys(data);
  const transform = transformImagePath();
  
  if (keys.includes("image")) {
    const imageKey = "image" as keyof typeof data;
    const image = data[imageKey] as ImageMetadata;

    image.src = transform(image.src);
  }

  if (keys.includes("images")) {
    const imagesKey = "images" as keyof typeof data;
    const images = data[imagesKey] as ImageMetadata[];

    images.forEach(image => {
      image.src = transform(image.src);
    });
  }

  return entry;
}