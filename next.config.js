/** @type {import('next').NextConfig} */

// Dominios desde los que Zoho CRM embebe el widget en un iframe.
const ZOHO_FRAME_ANCESTORS = [
  "https://*.zoho.com",
  "https://*.zoho.eu",
  "https://*.zoho.in",
  "https://*.zoho.com.au",
  "https://*.zoho.com.cn",
  "https://*.zoho.jp",
  "https://*.zohostatic.com",
  "https://*.zwidgets.com",
].join(" ");

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Permite que crm.zoho.com (y demas DCs) embeban la app como widget.
          // Usamos frame-ancestors (CSP) en vez de X-Frame-Options porque este
          // ultimo no soporta multiples origenes.
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${ZOHO_FRAME_ANCESTORS};`,
          },
          // Habilita el microfono dentro del iframe del widget. El contenedor
          // padre (Zoho) tambien debe permitirlo via allow="microphone".
          {
            key: "Permissions-Policy",
            value: "microphone=(self), autoplay=(self)",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
