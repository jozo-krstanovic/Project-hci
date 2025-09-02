import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JoinNowButtonProps {
  className?: string;
  isLoggedIn?: boolean;
}

export function JoinNowButton({ className, isLoggedIn }: JoinNowButtonProps) {
  return (
    <Button asChild className={cn(
      "text-xl bg-white text-black border-[3px] border-black font-bold",
      "hover:bg-black hover:text-white hover:border-white",
      "transition-colors duration-200",
      "h-[56px] px-[30px] py-[15px]", // Explicitly set height and padding
      className
    )}>
      <Link href={isLoggedIn ? "/workout-programs" : "/sign-up"}>
        Join Now
      </Link>
    </Button>
  );
}