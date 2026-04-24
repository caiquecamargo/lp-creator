#!/usr/bin/env zx

import colorConfig from "../src/data/colors.json" with { type: "json" };
import { fs } from "zx";

async function read(file) {
  const content = await fs.readFile(file, "utf-8");

  return content;
}

async function write(file, content) {
  await fs.writeFile(file, content, "utf-8");
}

// Function that swap the content marked with
// /*COLORS INIT*/ and /*COLORS END*/
// in a css like file with the content of the colors.json file
async function swapColors(file) {
  const content = await read(file);

  const colors = Object.entries(colorConfig)
    .filter(([key, _]) => key !== "title")
    .flatMap(([key, value]) =>
      Object.entries(value)
        .map(([shade, color]) => shade === "default"
          ? `  --color-${key}: ${color};`
          : `  --color-${key}-${shade}: ${color};`
        ))
    .join("\n");

  const newContent = content.replace(
    /\/\*COLORS INIT\*\/[\s\S]*?\/\*COLORS END\*\//,
    `/*COLORS INIT*/\n${colors}\n  /*COLORS END*/`
  );

  await write(file, newContent);
}

await swapColors("./src/styles/global.css");
