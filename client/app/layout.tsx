import "./globals.scss";
import "../src/components/nav.scss";
import Nav from "../src/components/nav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
