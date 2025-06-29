
export default function Loading() {
  return (
    <div className="flex-1 grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        {/* <div className="w-12 h-12 border-4 border-solid border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div> */}
        <p className="font-bold fugaz-font">Loading...</p>
        <img className="w-20" src="/images/kuromi.png" />
      </div>
    </div>
  );
}
