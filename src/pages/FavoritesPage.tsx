import { useListFavorites } from "@/hooks/useFavorites";

export default function FavoritesPage() {
  const { data: favorites, isLoading, error, refetch } = useListFavorites();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex w-full h-[80vh] items-center justify-center flex-col gap-5">
        <h1 className="font-bold text-3xl text-red-500">
          Error loading favorites
        </h1>
        <p className="text-white">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex w-full h-[80vh] items-center justify-center flex-col gap-5">
        <h1 className="font-bold text-5xl">Don't you like anything?</h1>
        <p className="text-xl">Favorite something!</p>
      </div>
    );
  }

  return <pre>{JSON.stringify(favorites, null, 2)}</pre>;
}
