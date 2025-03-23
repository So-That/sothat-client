function SearchBox() {
    return (
      <div className="flex items-center border-2 border-red-500 rounded-full p-2">
        <input 
          type="text" 
          placeholder="검색어 입력..." 
          className="flex-1 outline-none px-2"
        />
        <button className="text-red-500">
          🔍
        </button>
      </div>
    );
  }
  
  export default SearchBox;
  