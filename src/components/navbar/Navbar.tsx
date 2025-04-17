import { Heart, Menu } from "@deemlol/next-icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";
import { useListFavorites } from "@/hooks/useFavorites";
import Searchbar from "./Searchbar";
import { SpinnerSVG } from "@/assets/SpinnerSVG";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToasts } from "@/assets/Toasts";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { unauthorizedToast } = useToasts();

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const { data: favorites, isLoading } = useListFavorites();

  return (
    <nav className="sticky top-0 z-50 w-full bg-neutral-900 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo and Search Section */}
        <div className="flex flex-1 items-center md:flex-none">
          <Link
            to="/"
            className="mr-2 flex-shrink-0 text-2xl font-bold text-white md:mr-6"
          >
            Kaido
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block md:w-[320px] lg:w-[400px]">
            <Searchbar />
          </div>
        </div>

        {/* Mobile Search - Full width when visible */}
        <div className="mx-2 w-full md:hidden">
          <Searchbar />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-3 md:flex">
          <Link
            to={isAuthenticated ? "/add-listing" : "/"}
            onClick={isAuthenticated ? undefined : () => unauthorizedToast()}
            className="flex h-9 items-center justify-center rounded-full bg-neutral-800 px-4 text-neutral-100 transition-all hover:bg-neutral-700"
            aria-label={
              isAuthenticated ? "Create Post" : "Login to create a post"
            }
            title={isAuthenticated ? "Create Post" : "Login to create a post"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span className="pl-2">Create post</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/favorites"
                className="relative grid cursor-pointer place-items-center rounded-full bg-neutral-800 p-2 text-neutral-100 transition-colors hover:bg-neutral-700 hover:text-secondary-400"
                title="Favorites"
              >
                <Heart size={20} />
                {favorites && favorites.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-400 text-xs text-neutral-100">
                    {isLoading ? <SpinnerSVG /> : favorites?.length ?? 0}
                  </span>
                )}
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <div
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-primary-600 font-medium text-white transition-transform hover:scale-105"
                    title={user?.username}
                  >
                    {user?.username ? user.username[0].toUpperCase() : "?"}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[200px] border-neutral-700 bg-neutral-800 text-white">
                  <div className="px-2 py-1.5 text-sm text-neutral-400">
                    Hello, {user?.username}!
                  </div>
                  <DropdownMenuSeparator className="bg-neutral-700" />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer focus:bg-neutral-700 focus:text-white"
                  >
                    <Link to="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer focus:bg-neutral-700 focus:text-white"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white transition-colors hover:text-secondary-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="transform rounded-lg bg-gradient-to-r from-purple-600 to-primary-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:scale-[1.02] hover:from-purple-700 hover:to-primary-700 hover:shadow-lg"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Drawer>
            <DrawerTrigger className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700">
              <Menu size={20} className="text-neutral-100" />
            </DrawerTrigger>
            <DrawerHeader className="hidden">
              <DrawerTitle></DrawerTitle>
              <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <DrawerContent className="border-t border-neutral-800 bg-neutral-900">
              <div className="px-6 pb-2 pt-6">
                {isAuthenticated && (
                  <div className="mb-6 flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-primary-600 font-medium text-white">
                      {user?.username ? user.username[0].toUpperCase() : "?"}
                    </div>
                    <div>
                      <div className="text-lg font-medium text-white">
                        {user?.username}
                      </div>
                      <div className="text-sm text-neutral-400">Logged in</div>
                    </div>
                  </div>
                )}

                <div className="grid gap-3">
                  {isAuthenticated ? (
                    <>
                      <DrawerClose asChild>
                        <Link
                          to="/add-listing"
                          className="flex items-center rounded-lg bg-neutral-800 px-4 py-3.5 text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-3"
                          >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                          Create Post
                        </Link>
                      </DrawerClose>

                      <DrawerClose asChild>
                        <Link
                          to="/profile"
                          className="flex items-center rounded-lg bg-neutral-800 px-4 py-3.5 text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-3"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          Profile
                        </Link>
                      </DrawerClose>

                      <DrawerClose asChild>
                        <Link
                          to="/favorites"
                          className="flex items-center rounded-lg bg-neutral-800 px-4 py-3.5 text-white"
                        >
                          <Heart size={18} className="mr-3" />
                          Favorites
                          {favorites && favorites.length > 0 && (
                            <span className="ml-auto rounded-full bg-secondary-400 px-2 py-0.5 text-xs text-neutral-100">
                              {isLoading ? <SpinnerSVG /> : favorites?.length}
                            </span>
                          )}
                        </Link>
                      </DrawerClose>

                      <button
                        onClick={handleLogout}
                        className="mt-3 flex items-center rounded-lg bg-red-900/30 px-4 py-3.5 text-red-400"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-3"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <DrawerClose asChild>
                        <Link
                          to="/login"
                          className="flex items-center rounded-lg bg-neutral-800 px-4 py-3.5 text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-3"
                          >
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                            <polyline points="10 17 15 12 10 7"></polyline>
                            <line x1="15" y1="12" x2="3" y2="12"></line>
                          </svg>
                          Sign In
                        </Link>
                      </DrawerClose>

                      <DrawerClose asChild>
                        <Link
                          to="/register"
                          className="flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-primary-600 px-4 py-3.5 text-center text-white shadow-md"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-3"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                          </svg>
                          Create Account
                        </Link>
                      </DrawerClose>
                    </>
                  )}
                </div>
              </div>
              <DrawerFooter className="border-t border-neutral-800 px-6 py-4">
                <DrawerClose className="w-full rounded-lg bg-neutral-800 px-4 py-3 text-center text-sm text-neutral-300">
                  Close Menu
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  );
}
