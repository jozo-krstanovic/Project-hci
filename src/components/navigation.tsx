"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Page = {
  title: string;
  path: `/${string}`;
};

const pages: Page[] = [
  { title: "Home", path: "/" },
  {
    title: "Health wellness",
    path: "/health-wellness",
  },
  {
    title: "Account settings",
    path: "/account-settings",
  },
  {
    title: "Progress tracking",
    path: "/progress-tracking",
  },
  {
    title: "Workout programs",
    path: "/workout-programs",
  },
  {
    title: "Community motivation",
    path: "/community-motivation"
  },
];

function processPage(page: Page, index: number, pathname: string) {
  return (
    <li key={index} className="px-4">
      <Link
        href={page.path}
        className={
          page.path === "/"
            ? pathname === page.path
              ? "font-extrabold"
              : ""
            : pathname.startsWith(page.path)
            ? "font-extrabold"
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
  return (
    <ul className="flex justify-center space-x-4 mt-8">
      {pages.map((page, index) => processPage(page, index, pathname))}
    </ul>
  );
}