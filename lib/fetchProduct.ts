import { connection } from "next/server";
import type { ProductDetail } from "@/typings/searchTypings";

// Sponsored results link through /sp/track?...&rd=<real product url>.
// Unwrap it, and drop tracking query strings so the target is a clean product URL.
function resolveProductUrl(raw: string): string {
  const absolute = raw.startsWith("http")
    ? raw
    : `https://www.walmart.com${raw.startsWith("/") ? "" : "/"}${raw}`;

  try {
    let parsed = new URL(absolute);

    if (parsed.pathname.startsWith("/sp/track")) {
      const redirect = parsed.searchParams.get("rd");
      if (redirect) parsed = new URL(redirect);
    }

    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return absolute;
  }
}

// Walmart image URLs encode their size in the query string. Ask for a larger one.
function upscaleImage(src: string): string {
  try {
    const u = new URL(src.startsWith("//") ? `https:${src}` : src);
    if (u.searchParams.has("odnWidth")) {
      u.searchParams.set("odnWidth", "1000");
      u.searchParams.set("odnHeight", "1000");
    }
    return u.toString();
  } catch {
    return src;
  }
}

async function fetchProduct(url: string): Promise<ProductDetail | undefined> {
  // Marks this as request-time work, so Next.js doesn't try to prerender it
  await connection();

  const apiKey = process.env.OXYLABS_API_KEY;
  if (!apiKey) throw new Error("OXYLABS_API_KEY is not set");

  const target = resolveProductUrl(url);

  console.log("Scraping >>> ", target);

  const response = await fetch("https://webapi.oxylabs.io/v1/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url: target,
      output: ["json"],
      location: "US",
      json: {
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: {
              type: "string",
              description: "Product description text",
            },
            price: { type: "number" },
            currency: { type: "string", description: "e.g. USD" },
images: {
  type: "array",
  description:
    "URLs of ALL images in the product gallery, one entry per thumbnail, in order. Include every image, not just the main one.",
  items: { type: "string" },
},
            breadcrumbs: {
              type: "array",
              description: "Category path, e.g. Home, Electronics, Laptops",
              items: { type: "string" },
            },
            rating: {
              type: "object",
              properties: {
                rating: { type: "number", description: "Average stars" },
                count: { type: "number", description: "Number of reviews" },
              },
            },
            specifications: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  key: { type: "string" },
                  value: { type: "string" },
                },
              },
            },
          },
        },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Oxylabs error body:", text.slice(0, 500));
    return undefined;
  }

  const data = await response.json();
  const parsed = data.results?.[0]?.json;
  if (!parsed?.title) return undefined;

  // Fill in defaults so the page never crashes on a missing field
  return {
    url: target,
    title: parsed.title,
    description: parsed.description ?? "",
    price: parsed.price,
    currency: parsed.currency ?? "USD",
    images: [...new Set<string>((parsed.images ?? []).map(upscaleImage))],
    breadcrumbs: parsed.breadcrumbs ?? [],
    rating: parsed.rating,
    specifications: parsed.specifications ?? [],
  };
}

export default fetchProduct;