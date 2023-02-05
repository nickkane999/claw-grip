import React from "react";
import { GraphQLClient, gql } from "graphql-request";

const getInfo = async (id: string) => {
  const endpoint = process.env.GRAPHQL_API_URL as string;
  const graphQLClient = new GraphQLClient(endpoint);
  //graphQLClient.setHeader("X-GQL-Token", process.env.GRAPHQL_API_TOKEN as string);

  const query = gql`
    query getChartsByUser($userId: ID!) {
      getChartsByUser(userId: $userId) {
        id
        name
        type
        json
        plugins
        updatedDate
        createdDate
      }
    }
  `;

  const data = await graphQLClient.request(query, { userId: id });

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

process.env.GRAPHQL_API_URL;

function Page() {
  let id = "1";
  let task = await getInfo(id);

  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
}

export default Page;
