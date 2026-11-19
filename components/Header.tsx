"use client";
import Link from "next/link"
import Image from "next/image"
import { Grid2X2, Search, ShoppingCart, User } from "lucide-react"
import { LayoutGrid, Heart } from "lucide-react"
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store";
import { getCartTotal } from "@/lib/getCartTotal";

function Header() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const total = getCartTotal(cart);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = e.currentTarget.input.value;
        router.push(`/search?q=${input}`);
        // Handle form submission logic here
    };

    return (
        <header className="flex flex-col md:flex-row items-center bg-walmart px-10 py-7 space-x-5">
            <Link href="/" className="mb-5 md:mb-0">
                <Image
                    src="https://i.imgur.com/5V4wehM.png"
          alt="Logo"
          width={150}
          height={150}
          className="h-auto w-auto"
        />
      </Link>

      <form onSubmit={handleSubmit} className="flex flex-1 items-center rounded-full bg-white">
        <input
          type="text"
          name="input"
          placeholder="Search Everything..."
          className="flex-1 rounded-l-full px-4 outline-none placeholder:text-sm"
        />
        <button
          type="submit"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 cursor-pointer"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>
      <div className="flex mt-5 md:mt-0 space-x-5">
  <Link
    href="/"
    className="hidden xl:flex items-center space-x-2 text-white font-bold text-sm"
  >
    <Grid2X2 size={20} />
    <p>Departments</p>
  </Link>
  <Link
  href="/"
  className="hidden xl:flex items-center space-x-2 text-white font-bold text-sm"
>
  <LayoutGrid size={20} />
  <p>Services</p>
</Link>

<Link
  href="/"
  className="flex items-center space-x-2 text-white font-bold text-sm"
>
  <Heart size={20} />
  <div>
    <p className="text-xs font-extralight">Reorder</p>
    <p>My Items</p>
  </div>
</Link>
<Link
  href="/"
  className="flex items-center space-x-2 text-white font-bold text-sm"
>
  <User size={20} />
  <div>
    <p className="text-xs font-extralight">Sign In</p>
    <p>Account</p>
  </div>
</Link>

<Link
  href="/basket"
  className="flex items-center space-x-2 text-white font-bold text-sm"
>
  <ShoppingCart size={20} />
  <div>
    <p className="text-xs font-extralight">
  {cart.length > 0 ? `${cart.length} items` : "No items"}
</p>
   <p>{cart.length > 0 ? `${total}` : "0"}</p>
  </div>
</Link>

</div>
    </header>
  )
}

export default Header