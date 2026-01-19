import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        style={{ margin: 0, padding: 0, height: "100vh", overflow: "hidden" }}
      >
        <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
          {/* Sidebar fixe à gauche */}
          <Sidebar />

          {/* Zone de contenu principale qui prend tout le reste de l'espace */}
          <main
            style={{
              flex: 1,
              position: "relative",
              backgroundColor: "white",
              overflow: "hidden",
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
