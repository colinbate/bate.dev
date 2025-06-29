import type { APIRoute } from "astro";
import { gardenFileExists } from "../../../utils/garden-utils.ts";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

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
    const { slug } = body;

    if (!slug || typeof slug !== "string") {
      return new Response(JSON.stringify({ error: "Slug is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if file exists and determine extension
    const gardenDir = path.join(process.cwd(), "src/content/garden");
    let filePath: string;

    if (await gardenFileExists(slug)) {
      // Try .md first, then .mdx
      try {
        const fs = await import("fs/promises");
        await fs.access(path.join(gardenDir, `${slug}.md`));
        filePath = path.join(gardenDir, `${slug}.md`);
      } catch {
        filePath = path.join(gardenDir, `${slug}.mdx`);
      }
    } else {
      return new Response(JSON.stringify({ error: "File not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      // Use Zed's protocol handler
      const zedUrl = `zed://file${filePath}`;
      await execAsync(`open "${zedUrl}"`);

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Failed to open file in Zed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return new Response(
        JSON.stringify({
          error: "Failed to open file in editor",
          details: errorMessage,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } catch (error) {
    console.error("Garden open API error:", error);
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
