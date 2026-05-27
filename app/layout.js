export const metadata = { title: "GeoVictoria · Simulador de Ventas" };
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, background: "#0A0A0F" }}>{children}</body>
    </html>
  );
}
