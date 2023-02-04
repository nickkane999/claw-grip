import React from "react";
import { notFound } from "next/navigation";

type TaskProps = {
  params: {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  };
};
type Task = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const getInfo = async (id: number) => {
  // ISR Approach: Forces cache to be refreshed every 60 seconds. Will have all the pages at the time of building the site,
  // if generateStaticParams() method is set with right return data
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, { next: { revalidate: 300 } });

  // SSR Approach: Forces pages to be server-side rendered on every request
  //const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, { cache: "no-cache" }); //

  // SSG Approach: Forces pages to be statically generated; only happens once at build time
  //const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, { cache: "force-cache" });
  const task = await res.json();
  return task;
};

async function Page({ params: { id } }: TaskProps) {
  let task = await getInfo(id);

  if (!task.id) {
    return notFound();
  }

  if (!task) {
    return <div>Blog not found</div>;
  }
  return (
    <div>
      <h1>
        Task #{task.id} from user {task.userId}
      </h1>
      <p>{task.title}</p>
      <p>{task.completed ? "You completed this task" : "This task stll needs to be completed"}</p>
    </div>
  );
}

export default Page;

// This is the ISR approach of pulling data from the API
export async function generateStaticParams() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/");
  const tasks: Task[] = await res.json();

  const trimmedTasks = tasks.splice(0, 30);

  return trimmedTasks.map((task) => ({
    id: task.id.toString(),
  }));
}
