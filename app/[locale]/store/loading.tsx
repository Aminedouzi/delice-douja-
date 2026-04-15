export default function StoreLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-chocolate/10" />
      <div className="mt-4 h-6 w-96 max-w-full animate-pulse rounded bg-chocolate/10" />
      <div className="mt-10 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-9 w-24 animate-pulse rounded-full bg-chocolate/10"
          />
        ))}
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-2xl bg-chocolate/10"
          />
        ))}
      </div>
    </div>
  );
}
