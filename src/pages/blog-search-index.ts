import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const index = [];

  
  for (const post of posts) {
    // Get rendered content as plain text
    const content = post.body
      .replace(/#+\s*/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/\n{2,}/g, ' ')
      .trim();

    const excerpt = content.slice(0, 300);

    index.push({
      slug: post.slug,
      title: post.data.title,
      date: post.data.date ? post.data.date.toISOString() : null,
      // Use the processed image src from Astro
      image: post.data.image?.src || null,
      content,
      excerpt,
    });
  }

  // Sort by date (newest first)
  index.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return new Response(JSON.stringify(index, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const prerender = true;
