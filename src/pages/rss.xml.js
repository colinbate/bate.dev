import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_URL, SITE_TITLE } from '$data/constants';

export async function get() {
  const posts = await getCollection('posts');
  return rss({
    title: `${SITE_TITLE} | Blog`,
    description: 'The portfolio and developer blog of Colin Bate.',
    site: SITE_URL,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}