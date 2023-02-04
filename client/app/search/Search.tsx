"use client";

import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

function Search() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch("");
    router.push(`/search/${search}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <input type="text" value={search} placeholder="Search here" onChange={(e) => setSearch(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  );
}

export default Search;
