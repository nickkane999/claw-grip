import "./globals.scss";
import "../components/nav.scss";
import Nav from "../components/nav";

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
