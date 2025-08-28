import { GenericNavigation, Page } from "@/components/genericNavigationBase";

const subPages: Page[] = [
  { title: "Challenges & leaderboards", path: "/community-motivation/challenges-leaderboards" },
  { title: "Coach recommendations", path: "/community-motivation/coach-recommendations" },
  { title: "Forums & support groups", path: "/community-motivation/forums" },
];

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mt-4">
      <GenericNavigation pages={subPages} />
      {children}
    </section>
  );
}