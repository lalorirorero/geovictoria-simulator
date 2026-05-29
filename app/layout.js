export const metadata = { 
  title: "GeoVictoria · Simulador de Ventas",
  description: "Simulador de roleplay comercial con perfiles DISC, voz real y evaluación Sandler"
};
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, background: "#0B0F1A" }}>{children}</body>
    </html>
  );
}
