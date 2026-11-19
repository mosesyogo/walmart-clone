import type { Product as ProductType } from "@/typings/searchTypings";
import Image from "next/image";
import Link from "next/link";

function formatPrice(price: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

function Product({ product }: { product: ProductType }) {
  return (
    <Link
      href={{
        pathname: "/product",
        query: { url: product.url },
      }}
      className="relative flex h-full flex-col rounded-md border p-5"
    >
      {product.badge && (
        <span className="absolute top-2 right-2 rounded-full bg-black px-2 py-0.5 text-xs font-semibold text-white">
          {product.badge}
        </span>
      )}

      {product.image && (
        <Image
          src={product.image}
          alt={product.title}
          width={200}
          height={200}
          className="mx-auto"
        />
      )}

      {product.price !== undefined && (
        <p className="mt-3 text-xl font-bold">
          {formatPrice(product.price, product.currency)}
        </p>
      )}

      <p className="mt-1 line-clamp-3 text-sm">{product.title}</p>

      {product.rating !== undefined && (
        <p className="mt-auto pt-2 text-sm text-yellow-500">
          {product.rating}★
          {product.reviews_count !== undefined && (
            <span className="ml-2 text-gray-400">
              ({product.reviews_count})
            </span>
          )}
        </p>
      )}
    </Link>
  );
}

export default Product;