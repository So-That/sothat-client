import { createContext, useContext, useState } from "react";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [input, setInput] = useState("");
  return (
    <SearchContext.Provider value={{ input, setInput }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
