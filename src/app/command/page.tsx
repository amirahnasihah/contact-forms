import React from "react";
import SearchBar from "./SearchBar";

export default function CommandPage() {
  return (
    <div>
      <h1>CommandPage</h1>
      <SearchBar />
      <div>
        <iframe
          className="w-full aspect-video self-stretch md:min-h-96"
          src="https://www.youtube.com/embed/EeRj10rX8zk"
          title="Product Overview Video"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
