import { FC } from "react";
import "./heartBtn.css";
import {
  useAddToFavorites,
  useRemoveFromFavorites,
  useFavoriteStatus,
} from "@/hooks/useFavorites";
import { HeartIcon } from "@/assets/Icons";
import { useToasts } from "@/assets/Toasts";

interface HeartBtnProps {
  laptopId?: number;
  className?: string;
  isAuthenticated: boolean;
}

const HeartBtn: FC<HeartBtnProps> = ({
  laptopId,
  className = "",
  isAuthenticated,
}) => {
  const { unauthorizedToast } = useToasts();
  const { data: isFavorite, isLoading: isCheckingFavorite } = useFavoriteStatus(
    laptopId || 0
  );
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const isLoading =
    isCheckingFavorite ||
    addToFavorites.isPending ||
    removeFromFavorites.isPending;
  const isDisabled = !laptopId || isLoading;

  const handleToggleFavorite = () => {
    if (!laptopId || !isAuthenticated) {
      unauthorizedToast();
      return;
    }

    if (isFavorite) {
      removeFromFavorites.mutate(laptopId);
    } else {
      addToFavorites.mutate(laptopId);
    }
  };

  return (
    <div className={className}>
      <label className="heart">
        <input
          type="checkbox"
          checked={!!isFavorite}
          onChange={handleToggleFavorite}
          disabled={isDisabled}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        />
        <div
          className={`checkmark ${isLoading ? "loading" : ""} ${
            isDisabled ? "disabled" : ""
          }`}
        >
          <HeartIcon />
        </div>
      </label>
    </div>
  );
};

export default HeartBtn;
