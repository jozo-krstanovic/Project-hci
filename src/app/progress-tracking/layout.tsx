import { GenericNavigation, Page } from "@/components/genericNavigationBase";

const subPages: Page[] = [
  { title: "Activity History", path: "/progress-tracking/activity-history" },
  { title: "Progress Metrics", path: "/progress-tracking/progress-metrics" },
  { title: "Goals & achievements", path: "/progress-tracking/achievements" },
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