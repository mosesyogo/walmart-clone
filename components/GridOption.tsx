import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  className?: string;
  image?: string;
};

function GridOption({ title, className, image }: Props) {
  return (
    <Link
      href={{
        pathname: "/search",
        query: { q: title },
      }}
      className={cn("grid-option relative", className)}
    >
      <h2 className="relative z-10 text-xl font-bold">{title}</h2>
      {image && (
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="opacity-20 rounded-md object-cover"
        />
      )}
    </Link>
  );
}

export default GridOption;