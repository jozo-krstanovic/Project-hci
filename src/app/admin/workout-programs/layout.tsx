export default function ShowcaseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="my-28">
            {children}
        </section>
    );
}