"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "./logo";
import { useClickOutside } from "../hooks/useClickOutside";
import HamburgerMenu from "./hamburgerMenu";
import { cn } from "../lib/utils";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

type Page = {
  title: string;
  path: `/${string}`;
};

const pages: Page[] = [
  { title: "Home", path: "/" },
  {
    title: "Progress",
    path: "/progress-tracking",
  },
  {
    title: "Programs",
    path: "/workout-programs",
  },
  {
    title: "Health & Wellness",
    path: "/health-wellness",
  },
  {
    title: "Community",
    path: "/community-motivation",
  },
];

function processPage(
  page: Page,
  index: number,
  pathname: string,
  onClick?: () => void
) {
  return (
    <li key={index} className="px-4 font-montserrat text-[20px]">
      <Link
        onClick={onClick}
        href={page.path}
        className={
          page.path === "/"
            ? pathname === page.path
              ? "underline"
              : ""
            : pathname.startsWith(page.path)
            ? "underline"
            : ""
        }
      >
        {page.title}
      </Link>
    </li>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState(
    "/assets/palestra-account.png"
  );
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setProfileImage(
          user.user_metadata?.avatar_url || "/assets/palestra-account.png"
        );
      }
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user;
        setUser(currentUser || null);
        setProfileImage(
          currentUser?.user_metadata?.avatar_url ||
            "/assets/palestra-account.png"
        );
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileImage("/assets/palestra-account.png");
    closeDropdown();
    router.push("/");
  };

  useClickOutside(hamburgerRef, closeMenu);
  useClickOutside(dropdownRef, closeDropdown);

  return (
    <div
      ref={hamburgerRef}
      className="flex relative justify-between text-white items-center p-[20px] bg-brand-dark-background h-[80px]"
    >
      <Logo />
      <ul className="hidden lg:flex justify-center items-center space-x-4">
        {pages.map((page, index) => processPage(page, index, pathname))}
        <div ref={dropdownRef} className="relative">
          <Image
            src={profileImage}
            width={28}
            height={28}
            alt="Account"
            onClick={toggleDropdown}
            className="rounded-full cursor-pointer"
          />
          <div
            className={cn(
              "absolute top-full right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-brand-fill shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
              { hidden: !isDropdownOpen }
            )}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              {user ? (
                <>
                  <Link
                    href="/account-settings"
                    className="block px-4 py-2 font-montserrat text-brand-text-strong hover:bg-brand-primary"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-0"
                    onClick={closeDropdown}
                  >
                    Account Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 font-montserrat text-brand-text-strong hover:bg-brand-primary"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-1"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 font-montserrat text-brand-text-strong hover:bg-brand-primary"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-0"
                    onClick={closeDropdown}
                  >
                    Login
                  </Link>
                  <Link
                    href="/sign-up"
                    className="block px-4 py-2 font-montserrat text-brand-text-strong hover:bg-brand-primary"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-1"
                    onClick={closeDropdown}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </ul>

      <HamburgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <ul
        className={cn(
          "flex lg:hidden flex-col absolute z-50 top-full left-0 items-center w-full bg-brand-fill py-6 space-y-6 text-sm uppercase text-brand-text-strong border-b",
          { hidden: !isMenuOpen }
        )}
      >
        {pages.map((page, index) =>
          processPage(page, index, pathname, closeMenu)
        )}
        {user ? (
          <>
            <Link
              className="px-4 font-montserrat text-[20px]"
              onClick={closeMenu}
              href={"/account-settings"}
            >
              Account
            </Link>
            <button
              onClick={() => {
                handleSignOut();
                closeMenu();
              }}
              className="px-4 font-montserrat text-[20px] uppercase"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              className="px-4 font-montserrat text-[20px]"
              onClick={closeMenu}
              href={"/login"}
            >
              Login
            </Link>
            <Link
              className="px-4 font-montserrat text-[20px]"
              onClick={closeMenu}
              href={"/sign-up"}
            >
              Sign up
            </Link>
          </>
        )}
      </ul>
    </div>
  );
}


