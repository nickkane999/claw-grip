import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

const getScripts = async () => {
  const res = await fetch(`http://localhost:5000/scripts/get`, { next: { revalidate: 300 } });
  const script = await res.json();
  return script;
};

async function Page() {
  let scripts = await getScripts();

  if (!scripts || Object.keys(scripts).length < 1) {
    return notFound();
  }

  return (
    <div className="scripts container">
      <h1>Scripts</h1>
      {scripts.map((script: any) => {
        return (
          <div key={script._id}>
            <Link href={`/scripts/${script._id}`}>{script.name}</Link>
          </div>
        );
      })}
    </div>
  );
}

export default Page;
