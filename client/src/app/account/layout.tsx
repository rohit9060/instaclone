export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  cardFooter: any;
}>) {
  return (
    <>
      <main>
        <section className="flex flex-col justify-center items-center h-screen max-w-4xl mx-auto px-5 text-center gap-5 ">
          {children}
        </section>
      </main>
    </>
  );
}
