export default function ShowcaseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="my-12">
            {children}
        </section>
    );
}