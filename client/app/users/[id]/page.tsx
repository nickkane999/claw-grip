import React from "react";
import { notFound } from "next/navigation";

const getInfo = async (id: string) => {
  const res = await fetch(`http://localhost:5000/users/get/${id}`, { next: { revalidate: 300 } });
  const user = await res.json();
  return user;
};

const getScripts = async (id: string) => {
  const res = await fetch(`http://localhost:5000/scripts/get/user/${id}`, { next: { revalidate: 300 } });
  const scripts = await res.json();
  return scripts;
};

async function Page({ params: { id } }: any) {
  let user = await getInfo(id);
  let scripts = null;

  if (!user.username) {
    return notFound();
  } else {
    scripts = await getScripts(id);
  }

  return (
    <div className="container">
      <h1>{user.username}</h1>
      <h2>Scripts</h2>
      {scripts.length >= 1 ? (
        scripts.map((script: any) => {
          return (
            <div key={script._id}>
              <h3>{script.name}</h3>
              <p>{script.script}</p>
            </div>
          );
        })
      ) : (
        <p>There are no scripts for this user.</p>
      )}
    </div>
  );
}

export default Page;

export async function generateStaticParams() {
  const res = await fetch("http://localhost:5000/users/get");
  const users = await res.json();

  return users.map((user: any) => ({
    id: user._id,
  }));
}
