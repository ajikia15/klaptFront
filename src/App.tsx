import "./App.css";
import Navbar from "./components/navbar/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "@tanstack/react-router";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";
import "./i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-neutral-900 text-neutral-100">
          <Navbar />
          <main className="">
            <Outlet />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
