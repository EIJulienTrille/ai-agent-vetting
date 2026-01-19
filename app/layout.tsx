import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          padding: 0,
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
          {/* Sidebar avec largeur fixe garantie */}
          <Sidebar />

          {/* Contenu principal flexible */}
          <main
            style={{
              flex: 1,
              position: "relative",
              backgroundColor: "white",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
