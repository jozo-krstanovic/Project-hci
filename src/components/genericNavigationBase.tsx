"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type Page = {
  title: string;
  path: `/${string}`;
};

function processPage(page: Page, index: number, pathname: string) {
  return (
    <li key={index}>
      <Link
        href={page.path}
        className={
          pathname === page.path ? "font-extrabold text-slate-600" : ""
        }
      >
        {page.title}
      </Link>
    </li>
  );
}


//Reuseable component that takes pages/subpages as props and renders navbar to display them
//TODO: beautify navbar
export function GenericNavigation( props: { pages: Page[] }) {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <ul className="flex justify-center space-x-4 mt-8">
      {props.pages.map((page, index) => processPage(page, index, pathname))}
    </ul>
  );
}