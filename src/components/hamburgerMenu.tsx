import { cn } from "../lib/utils";

type HamburgerProps = {
    isOpen: boolean;
    toggleMenu: () => void;
  };
  
function HamburgerMenu({ isOpen, toggleMenu }: HamburgerProps) {
    return (
        <button
        className="flex lg:hidden flex-col justify-center items-end w-11 h-11 p-2 space-y-1.5 rounded-sm hover:bg-brand-stroke-weak active:bg-brand-stroke-weak"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={toggleMenu}
        >
        <span
            className={cn(
            "w-7 h-1 bg-brand-fill rounded-full transition-all duration-300 ease-in-out",
            { "rotate-45 translate-y-2.5": isOpen }
            )}
        />
        <span
            className={cn(
            "w-4 h-1 bg-brand-fill rounded-full transition-all duration-300 ease-in-out",
            { "opacity-0": isOpen }
            )}
        />
        <span
            className={cn(
            "w-6 h-1 bg-brand-fill rounded-full transition-all duration-300 ease-in-out",
            { "w-7 -rotate-45 -translate-y-2.5": isOpen }
            )}
        />
        </button>
    );
}

export default HamburgerMenu