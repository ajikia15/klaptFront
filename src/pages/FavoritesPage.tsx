import { Button } from "@/components/ui/button";
import { useListFavorites } from "@/hooks/useFavorites";

export default function FavoritesPage() {
  const { data: favorites, isLoading, error, refetch } = useListFavorites();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-5">
        <h1 className="text-3xl font-bold text-red-500">
          Error loading favorites
        </h1>
        <p className="text-white">{error.message}</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-5">
        <h1 className="text-5xl font-bold">Don't you like anything?</h1>
        <p className="text-xl">Favorite something!</p>
      </div>
    );
  }

  return <pre>{JSON.stringify(favorites, null, 2)}</pre>;
}
