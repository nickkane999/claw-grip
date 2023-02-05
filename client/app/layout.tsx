import "./globals.scss";
import "../src/components/nav.scss";
import Nav from "../src/components/nav";
//import { graphql } from "../lib/gql";
//import { graphqlClient } from "../lib/graphql-client";

/*
const getAllPostsDocument = graphql( `
  query GetAllPosts($first: Int) {
    postCollection(first: $first) {
      edges {
        node {
          id
          title
          slug
      }
    }
  }
`);
*/
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
