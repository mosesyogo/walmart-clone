import type { SearchResult } from "@/typings/searchTypings";

export async function fetchSearch(
  searchTerm: string,
  page = 1
): Promise<SearchResult> {
  const apiKey = process.env.OXYLABS_API_KEY;
  if (!apiKey) throw new Error("OXYLABS_API_KEY is not set");

  const url = new URL("https://www.walmart.com/search");
  url.searchParams.set("q", searchTerm);
  if (page > 1) url.searchParams.set("page", String(page));

  const response = await fetch("https://webapi.oxylabs.io/v1/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url: url.toString(),
      output: ["json"],
      location: "US",
      json: {
        schema: {
          type: "object",
          properties: {
            total_results: {
              type: "number",
              description: "Total number of results for the search",
            },
            products: {
              type: "array",
              description:
                "Every product card in the search results grid, from the first to the last on the page. Include sponsored and rollback items. Do not stop early or skip any.",
              items: {
                type: "object",
                properties: {
                  product_id: { type: "string" },
                  title: { type: "string" },
                  url: { type: "string" },
                  image: { type: "string" },
                  price: { type: "number" },
                  currency: { type: "string" },
                  rating: {
                    type: "number",
                    description: "Average star rating, e.g. 4.3",
                  },
                  reviews_count: {
                    type: "number",
                    description: "Number of customer reviews",
                  },
                  badge: {
                    type: "string",
                    description:
                      "Label on the product card such as Sponsored, Best seller or Rollback",
                  },
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
    console.error("Oxylabs error body:", text.slice(0, 1000));
    throw new Error(`Oxylabs request failed: ${response.status}`);
  }

  const json = await response.json();
  console.log(
    "products returned:",
    json.results?.[0]?.json?.products?.length ?? 0
  );
  return json;
}