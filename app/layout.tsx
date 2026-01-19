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
          backgroundColor: "#F9F9FB",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
          }}
        >
          {/* Sidebar avec largeur fixe pour éviter de couper le texte */}
          <Sidebar />

          {/* Contenu principal qui s'ajuste dynamiquement */}
          <main
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
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
