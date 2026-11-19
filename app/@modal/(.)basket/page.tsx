"use client";
import { useRouter } from "next/navigation";
import Basket from "@/components/Basket";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


function BasketInterception() {
  const router = useRouter();

  function onDismiss() {
    router.back();
  }

  return <Dialog open
  onOpenChange={(isOpen) => {
  if (!isOpen) {
    onDismiss();
  }
}}>
 <DialogContent className="h-4/5 w-full overflow-scroll max-w-3xl bg-white">
    <DialogHeader>
      <DialogTitle>Basket</DialogTitle>
      <DialogDescription>
        Contents of your basket
      </DialogDescription>
    </DialogHeader>
    <Basket/>
  </DialogContent>
</Dialog>
};

export default BasketInterception;
