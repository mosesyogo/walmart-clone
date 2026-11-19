import Link from "next/link";
import { fetchSearch } from "@/lib/fetchSearch";
import Product from "@/components/Product";

type Props = {
  searchParams: Promise<{
    q: string;
    page?: string;
  }>;
};

async function SearchPage({ searchParams }: Props) {
  const { q, page } = await searchParams;
  const pageNumber = Math.max(1, Number(page) || 1);

  const data = await fetchSearch(q, pageNumber);
  const content = data.results?.[0]?.json;
  const products = content?.products ?? [];

  return (
    <div className="p-10">
      <h1 className="mb-2 text-3xl font-bold">Results for {q}</h1>
      <h2 className="mb-5 text-gray-400">
        ({content?.total_results ?? products.length} results, showing{" "}
        {products.length} on page {pageNumber})
      </h2>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, i) => (
          <li key={product.product_id ?? product.url ?? i}>
            <Product product={product} />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-4">
        {pageNumber > 1 && (
          <Link
            href={{ pathname: "/search", query: { q, page: pageNumber - 1 } }}
            className="rounded-md border px-4 py-2"
          >
            Previous
          </Link>
        )}
        {products.length > 0 && (
          <Link
            href={{ pathname: "/search", query: { q, page: pageNumber + 1 } }}
            className="rounded-md border px-4 py-2"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}

export default SearchPage;