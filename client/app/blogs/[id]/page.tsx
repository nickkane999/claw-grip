import React from "react";
import data from "../../../src/data/sample.json";
import fs from "fs";

type PageProps = {
  params: {
    id: string;
    title: string;
    description: string;
  };
};

const getInfo = (id: string) => {
  const blog = data.find((record) => record.id === id.toString());
  return blog;
};

function Page({ params: { id } }: PageProps) {
  let blog = getInfo(id);

  if (!blog) {
    return <div>Blog not found</div>;
  }
  return (
    <div>
      <h1>Blog Page</h1>
      <h2>{blog.title}</h2>
      <p>You are reading blog post #{blog.id}</p>
      <p>{blog.description}</p>
    </div>
  );
}

export default Page;

export async function generateStaticParams() {
  return data.map((record) => ({
    id: record.id.toString(),
  }));
}
