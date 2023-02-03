import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.scss";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <div>
        <h1>Goal of Claw Grip</h1>
        <p>This app will let you go to websites and grab information quickly. It could be used for many ways, but the goal is to provide information quickly and with less effort</p>
        <p>Create or Copy scripts using this site, queue them up</p>
      </div>
    </main>
  );
}
