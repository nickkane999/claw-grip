import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

const getUsers = async () => {
  const res = await fetch(`http://localhost:5000/users/get`, { next: { revalidate: 300 } });

  //const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, { cache: "no-cache" });
  //const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, { cache: "force-cache" });
  const user = await res.json();
  return user;
};

async function Page() {
  let user = await getUsers();

  if (!user || Object.keys(user).length < 1) {
    return notFound();
  }

  return (
    <div className="profile">
      <h1>Users</h1>
      {user.map((user: any) => {
        return (
          <div key={user._id}>
            <Link href={`/profile/${user._id}`}>{user.username}</Link>
          </div>
        );
      })}
    </div>
  );
}

export default Page;
