import { GenericNavigation, Page } from "@/components/genericNavigationBase";

const subPages: Page[] = [
  { title: "Nutrition", path: "/health-wellness/nutrition" },
  { title: "Lifestyle recovery", path: "/health-wellness/lifestyle-recovery" },
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