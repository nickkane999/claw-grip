import React from "react";
import { notFound } from "next/navigation";

const getScript = async (id: string) => {
  const res = await fetch(`http://localhost:5000/scripts/get/script/${id}`, { next: { revalidate: 300 } });
  const script = await res.json();
  return script;
};

async function Page({ params: { id } }: any) {
  let script = await getScript(id);

  if (!script.name) {
    return notFound();
  }

  return (
    <div className="container">
      <h1>{script.name}</h1>
      <p>{script.script}</p>
    </div>
  );
}

export default Page;

export async function generateStaticParams() {
  const res = await fetch("http://localhost:5000/scripts/get");
  const scripts = await res.json();

  return scripts.map((user: any) => ({
    id: user._id,
  }));
}
