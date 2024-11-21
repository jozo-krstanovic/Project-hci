import { GenericNavigation, Page } from "@/src/components/genericNavigationBase";

const subPages: Page[] = [
    { title: "Quick workouts", path: "/workout-programs/quick-workouts" },
    { title: "Beginner workouts", path: "/workout-programs/beginner" },
    { title: "Intermediate & advanced", path: "/workout-programs/intermediate-advanced" },
    { title: "Flexibility workouts", path: "/workout-programs/low-impact-flexibility" },
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