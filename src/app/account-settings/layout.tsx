import { GenericNavigation, Page } from "@/src/components/genericNavigationBase";

const subPages: Page[] = [
    { title: "Help & support", path: "/account-settings/help-support" },
    { title: "Notifications & reminders", path: "/account-settings/notifications" },
    { title: "Profile management", path: "/account-settings/profile-management" },
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