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
import { Button } from "../ui/button";
import { Plus, User, Globe } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

// Language options
const LANGUAGES = [
  { code: "ka", label: "Georgian", emoji: "🇬🇪" },
  { code: "en", label: "English", emoji: "🇬🇧" },
  { code: "ru", label: "Russian", emoji: "🇷🇺" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { unauthorizedToast } = useToasts();

  // Placeholder for language state (to be replaced with i18n logic)
  const [lang, setLang] = useState("en");

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const { data: favorites, isLoading } = useListFavorites();
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-50 w-full bg-neutral-900 px-2 shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex flex-row items-center gap-2 text-2xl font-bold text-neutral-100"
        >
          <img src="/logo-white.svg" className="h-10 w-10 fill-black" alt="" />
          <p className="logo-text hidden font-medium md:block">Dgpeaks</p>
          {/* <Book className="inline-block h-8 w-8 animate-spin text-primary-600" /> */}
        </Link>

        {/* Mobile Search */}
        <div className="mx-2 w-full md:hidden">
          <Searchbar />
        </div>

        {/* Desktop Search */}
        <div className="hidden md:mx-auto md:block md:max-w-md md:flex-1 md:px-8">
          <Searchbar />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-3 md:flex">
          {/* Language Switcher Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center px-2 py-2">
                <Globe size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-36 border-neutral-700 bg-neutral-800 text-white">
              {LANGUAGES.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    i18n.changeLanguage(l.code);
                  }}
                  className={`cursor-pointer focus:bg-neutral-700 focus:text-white ${
                    lang === l.code ? "font-bold" : ""
                  }`}
                >
                  <span className="mr-2">{l.emoji}</span>
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to={isAuthenticated ? "/add-listing" : "/"}
            onClick={isAuthenticated ? undefined : () => unauthorizedToast()}
            className=""
            aria-label={isAuthenticated ? t("createPost") : t("signIn")}
            title={isAuthenticated ? t("createPost") : t("signIn")}
          >
            <Button className="" variant={"outline"}>
              {t("createPost")}
              <Plus />
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/favorites" title={t("navbar.favorites")}>
                <Button className="relative aspect-square" variant={"outline"}>
                  {t("navbar.favorites")}
                  <Heart size={20} />
                  {favorites && favorites.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-400 text-xs text-neutral-100">
                      {isLoading ? <SpinnerSVG /> : favorites?.length ?? 0}
                    </span>
                  )}
                </Button>
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
                <DropdownMenuContent className="min-w-52 border-neutral-700 bg-neutral-800 text-white">
                  <div className="px-2 py-1.5 text-sm text-neutral-400">
                    Hello, {user?.username}!
                  </div>
                  <DropdownMenuSeparator className="bg-neutral-700" />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer focus:bg-neutral-700 focus:text-white"
                  >
                    <Link to="/profile" className="w-full">
                      {t("navbar.profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer focus:bg-neutral-700 focus:text-white"
                  >
                    {t("navbar.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant={"outline"} className="">
                  {t("navbar.signIn")}
                </Button>
              </Link>
              <Link to="/register">
                <Button className="font-bold">
                  {t("navbar.createAccount")}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Language Switcher (Drawer) + Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Language Drawer Trigger */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="flex h-10 w-10 items-center justify-center rounded-full p-0"
                aria-label={t("navbar.chooseLanguage")}
              >
                <Globe size={20} className="text-neutral-100" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="border-t border-neutral-800 bg-neutral-900">
              <DrawerHeader>
                <DrawerTitle>{t("navbar.chooseLanguage")}</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col gap-2 px-6 pb-4">
                {LANGUAGES.map((l) => (
                  <Button
                    key={l.code}
                    variant={lang === l.code ? "secondary" : "outline"}
                    className="flex items-center justify-start"
                    onClick={() => {
                      setLang(l.code);
                      i18n.changeLanguage(l.code);
                    }}
                  >
                    <span className="mr-2">{l.emoji}</span>
                    {l.label}
                  </Button>
                ))}
              </div>
              <DrawerFooter className="border-t border-neutral-800 px-6 py-4">
                <DrawerClose className="w-full rounded-lg bg-neutral-800 px-4 py-3 text-center text-sm text-neutral-300">
                  {t("navbar.close")}
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          {/* Hamburger Menu */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="h-10 w-10 rounded-full p-0">
                <Menu size={20} className="text-neutral-100" />
              </Button>
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
                          <Plus size={18} className="mr-3" />
                          {t("createPost")}
                        </Link>
                      </DrawerClose>

                      <DrawerClose asChild>
                        <Link
                          to="/profile"
                          className="flex items-center rounded-lg bg-neutral-800 px-4 py-3.5 text-white"
                        >
                          <User size={18} className="mr-3" />
                          {t("navbar.profile")}
                        </Link>
                      </DrawerClose>

                      <DrawerClose asChild>
                        <Link
                          to="/favorites"
                          className="flex items-center rounded-lg bg-neutral-800 px-4 py-3.5 text-white"
                        >
                          <Heart size={18} className="mr-3" />
                          {t("navbar.favorites")}
                          {favorites && favorites.length > 0 && (
                            <span className="ml-auto rounded-full bg-secondary-400 px-2 py-0.5 text-xs text-neutral-100">
                              {isLoading ? <SpinnerSVG /> : favorites?.length}
                            </span>
                          )}
                        </Link>
                      </DrawerClose>

                      <Button
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
                        {t("navbar.logout")}
                      </Button>
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
                          {t("navbar.signIn")}
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
                          {t("navbar.createAccount")}
                        </Link>
                      </DrawerClose>
                    </>
                  )}
                </div>
              </div>
              <DrawerFooter className="border-t border-neutral-800 px-6 py-4">
                <DrawerClose className="w-full rounded-lg bg-neutral-800 px-4 py-3 text-center text-sm text-neutral-300">
                  {t("navbar.closeMenu")}
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  );
}
