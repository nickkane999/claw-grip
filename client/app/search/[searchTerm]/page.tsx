import React from "react";

type PageProps = {
  params: {
    searchTerm: string;
  };
};

const search = async (searchTerm: string) => {
  //const response = await fetch(`/api/search/${searchTerm}`);
  //const data = await response.json();
  //return data;
  await setTimeout(function () {
    console.log("");
  }, 3000);
  //throw new Error("This is a test error");
  return "searchTerm";
};

async function SearchResults({ params: { searchTerm } }: PageProps) {
  const searchResults = await search(searchTerm);
  return (
    <div>
      <h1>Search Results</h1>
      <p>Search Term: {searchTerm}</p>
      <p>This would work, but need to set up account with api group or another step to complete (not needed for this learning step)</p>
      <p>Search Results: {searchResults}</p>
    </div>
  );
}

export default SearchResults;
