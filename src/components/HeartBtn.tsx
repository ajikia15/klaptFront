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
}

const HeartBtn: FC<HeartBtnProps> = ({ laptopId, className = "" }) => {
  const { unauthorizedToast } = useToasts();
  if (!laptopId) {
    return (
      <div className={className} onClick={unauthorizedToast}>
        <label className="heart">
          <input type="checkbox" disabled />
          <div className="checkmark">
            <HeartIcon />
          </div>
        </label>
      </div>
    );
  }
  const { data: isFavorite } = useFavoriteStatus(laptopId);
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const handleToggleFavorite = () => {
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
          checked={isFavorite !== null}
          onChange={handleToggleFavorite}
        />
        <div className="checkmark">
          <HeartIcon />
        </div>
      </label>
    </div>
  );
};

export default HeartBtn;
