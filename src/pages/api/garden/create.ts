import type { APIRoute } from "astro";
import { createGardenFile, slugify } from "../../../utils/garden-utils.ts";
// Only allow in development
const isDev = import.meta.env.DEV;
export const prerender = !isDev;

export const POST: APIRoute = async ({ request }) => {
  // Block in production
  if (!isDev) {
    return new Response(
      JSON.stringify({ error: "Not available in production" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== "string") {
      return new Response(JSON.stringify({ error: "Title is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const slug = slugify(title);
    const result = await createGardenFile(title, slug);

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          slug,
          filePath: result.filePath,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    } else {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Garden create API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

// Block all other methods
export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};
