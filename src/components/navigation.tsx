"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useClickOutside } from "../hooks/useClickOutside";
import { cn } from "../lib/utils";
import Logo from "./logo";
import HamburgerMenu from "./hamburgerMenu";

type Page = {
  title: string;
  path: `/${string}`;
};

const pages: Page[] = [
  { title: "Home", path: "/" },
  { title: "Programs", path: "/workout-programs" },
  { title: "Community", path: "/community-motivation" },
];

function processPage(
  page: Page,
  index: number,
  pathname: string,
  isHamburgerMenu: boolean = false,
  onClick?: () => void,
) {
  return (
    <li
      key={index}
      className="px-4 py-2 font-montserrat text-[20px] relative group"
    >
      <Link
        onClick={onClick}
        href={page.path}
        className="transition-all duration-200"
      >
        {page.title}
      </Link>
      {/* subtle underline animation */}
      <span
        className={cn(
          "absolute left-0 -bottom-1 h-[2px] w-0 bg-brand-primary transition-all group-hover:w-full",
          page.path === "/"
            ? pathname === page.path ? "w-full" : ""
            : pathname.startsWith(page.path) ? "w-full" : "",
          isHamburgerMenu ? "bg-black" : ""
        )}
      />
    </li>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState("/assets/palestra-account.png");
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);
      setProfileImage(user.user_metadata?.avatar_url || "/assets/palestra-account.png");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole(profile?.role || null);
      if (error) console.error(error);
    };

    getUserAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user;
      setUser(currentUser || null);
      setProfileImage(currentUser?.user_metadata?.avatar_url || "/assets/palestra-account.png");

      if (currentUser) {
        (async () => {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", currentUser.id)
            .maybeSingle();
          setRole(profile?.role || null);
          if (error) console.error(error);
        })();
      } else {
        setRole(null);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setProfileImage("/assets/palestra-account.png");
    closeDropdown();
    router.push("/");
  };

  useClickOutside(hamburgerRef, closeMenu);
  useClickOutside(dropdownRef, closeDropdown);

  return (
    <nav
      ref={hamburgerRef}
      className="relative w-full bg-brand-dark-background px-6 md:px-24 py-4 flex justify-between items-center"
    >
      <Logo />

      {/* Desktop Menu */}
      <ul className="hidden text-white lg:flex items-center space-x-6">
        {pages.map((page, index) => processPage(page, index, pathname))}
        {role === "admin" && (
          <li className="px-4 py-2 font-montserrat text-[20px] relative group">
            <Link
              href="/admin/workout-programs"
              className="transition-all duration-200"
            >
              Admin Panel
            </Link>
            <span
              className={cn(
                "absolute left-0 -bottom-1 h-[2px] w-0 bg-brand-primary transition-all group-hover:w-full",
                pathname.startsWith("/admin/workout-programs") ? "w-full" : ""
              )}
            />
          </li>
        )}

        {/* Account Dropdown */}
        <div ref={dropdownRef} className="relative">
          <Image
            src={profileImage}
            width={36}
            height={36}
            alt="Account"
            onClick={toggleDropdown}
            style={{ objectFit: "cover" }}
            className="min-w-[42px] min-h-[42px] rounded-full cursor-pointer border-2 border-white hover:border-brand-primary transition-all"
          />
          <div
            className={cn(
              "absolute top-full right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-brand-fill shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-opacity duration-200",
              { hidden: !isDropdownOpen }
            )}
            role="menu"
            aria-orientation="vertical"
            tabIndex={-1}
          >
            <div className="py-1">
              {user ? (
                <>
                  <Link
                    href="/account-settings"
                    className="block px-4 py-2 font-montserrat text-brand-text-strong hover:bg-brand-primary"
                    onClick={closeDropdown}
                  >
                    Account Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 font-montserrat text-brand-text-strong hover:bg-brand-primary"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 font-montserrat text-brand-text-strong hover:bg-brand-primary"
                    onClick={closeDropdown}
                  >
                    Login
                  </Link>
                  <Link
                    href="/sign-up"
                    className="block px-4 py-2 font-montserrat text-brand-text-strong hover:bg-brand-primary"
                    onClick={closeDropdown}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </ul>

      {/* Mobile Menu */}
      <HamburgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <ul
        className={cn(
          "flex lg:hidden flex-col items-center absolute z-50 top-full left-0 w-full bg-brand-fill py-6 space-y-6 text-sm uppercase text-brand-text-strong border-b transition-all",
          { hidden: !isMenuOpen }
        )}
      >
        {pages.map((page, index) => processPage(page, index, pathname, true, closeMenu))}
        {role === "admin" && (
          <li className="px-4 py-2 font-montserrat text-[20px] relative group">
            <Link
              href="/admin/workout-programs"
              className="px-4 py-2 font-montserrat text-[20px]"
              onClick={closeMenu}
            >
              Admin Panel
            </Link>
            <span
              className={cn(
                "absolute left-0 -bottom-1 h-[2px] w-0 bg-black transition-all group-hover:w-full",
                pathname.startsWith("/admin/workout-programs") ? "w-full" : ""
              )}
            />
          </li>
        )}
        {user ? (
          <>
            <li className="px-4 py-2 font-montserrat text-[20px] relative group">
              <Link
                href="/account-settings"
                className="px-4 py-2 font-montserrat text-[20px]"
                onClick={closeMenu}
              >
                Account
              </Link>
              <span
                className={cn(
                  "absolute left-0 -bottom-1 h-[2px] w-0 bg-black transition-all group-hover:w-full",
                  pathname.startsWith("/account-settings") ? "w-full" : ""
                )}
              />
            </li>
            <li className="px-4 py-2 font-montserrat text-[20px] relative group">
              <button
                onClick={() => {
                  handleSignOut();
                  closeMenu();
                }}
                className="px-4 py-2 font-montserrat text-[20px] uppercase"
              >
                Sign Out
              </button>
              <span
                className="absolute left-0 -bottom-1 h-[2px] w-0 bg-black transition-all group-hover:w-full"
              />
            </li>
          </>
        ) : (
          <>
            <li className="px-4 py-2 font-montserrat text-[20px] relative group">
              <Link
                href="/login"
                className="px-4 py-2 font-montserrat text-[20px]"
                onClick={closeMenu}
              >
                Login
              </Link>
              <span
                className={cn(
                  "absolute left-0 -bottom-1 h-[2px] w-0 bg-black transition-all group-hover:w-full",
                  pathname.startsWith("/login") ? "w-full" : ""
                )}
              />
            </li>
            <li className="px-4 py-2 font-montserrat text-[20px] relative group">
              <Link
                href="/sign-up"
                className="px-4 py-2 font-montserrat text-[20px]"
                onClick={closeMenu}
              >
                Sign Up
              </Link>
              <span
                className={cn(
                  "absolute left-0 -bottom-1 h-[2px] w-0 bg-black transition-all group-hover:w-full",
                  pathname.startsWith("/sign-up") ? "w-full" : ""
                )}
              />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
