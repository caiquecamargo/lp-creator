#!/usr/bin/env zx

import { fs } from "zx";

const sanitizeTitle = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/,+/g, "-");
}

const resolveImage = async (content) => {
  const urls = content["_links"]?.["wp:attachment"];

  console.log(`Found ${urls ? urls.length : 0} images to download.`);

  if (!urls || urls.length === 0) {
    return "";
  }

  for (const urlObj of urls) {
    const imageObj = await fetch(urlObj.href);
    const [obj] = await imageObj.json();

    if (!obj?.source_url || obj.source_url.length === 0) {
      console.log(`No source URL found for image at ${urlObj.href}`, obj);
      continue;
    }

    const title = sanitizeTitle(obj.title.rendered) || "untitled";

    console.log(`Saving image from ${title}`);

    const image = await fetch(obj.source_url);
    
    const imageData = await image.arrayBuffer();
    const type = image.headers.get("content-type"); 
    const extension = type.split("/")[1];
    const imagePath = `./src/assets/images/${title}.${extension}`;

    await fs.writeFile(imagePath, Buffer.from(imageData));

    return imagePath.replace("./src", "");
  }

  return "";
}

const transformContent = (html) => {
  return html
    .replace(/<h1>(.*?)<\/h1>/g, "# $1")
    .replace(/<h2>(.*?)<\/h2>/g, "## $1")
    .replace(/<h3>(.*?)<\/h3>/g, "### $1")
    .replace(/<p>(.*?)<\/p>/g, "$1\n")
    .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
    .replace(/<em>(.*?)<\/em>/g, "*$1*")
    .replace(/<a href="(.*?)">(.*?)<\/a>/g, "[$2]($1)")
    .replace(/<ul>(.*?)<\/ul>/gs, (match, p1) => {
      return p1.replace(/<li>(.*?)<\/li>/g, "- $1");
    })
    .replace(/<img src="(.*?)" alt="(.*?)"(.*?)\/>/g, "![$2]($1)")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, ""); // Remove any other HTML tags
}

try {
  const response = await fetch(`https://triadeengenharia.com.br//wp-json/wp/v2/posts?per_page=100`);
  const posts = await response.json();

  console.log(`Fetched ${posts.length} posts from WordPress.`);

  await fs.writeFile("./wordpress-posts.json", JSON.stringify(posts, null, 2));

  for (const post of posts) {
    const slug = post.slug;
    const content = post.content.rendered;
    const title = post.title.rendered;
    const filePath = `./src/content/blog/${slug}.md`;
    const date = post.date.split("T")[0];

    console.log(`Processing post: ${title}`);
    
    const imagePath = await resolveImage(post);

    let markdownContent = `---
title: "${title}"
date: ${date}
image: ${imagePath}
---`

    markdownContent += `\n\n${transformContent(content)}`;

    await fs.writeFile(filePath, markdownContent);

    console.log(`Saved post to ${filePath}`);
  }
} catch (error) {
  console.error("Error fetching posts:", error);
}