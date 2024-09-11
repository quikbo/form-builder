import Feed from "./components/layout/feed";
import Sidebar from "./components/layout/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { $router } from "./lib/router";
import { useStore } from "@nanostores/react";
import NotFoundPage from "./pages/not-found-page";
import Login from "./pages/login";
import Register from "./pages/register";
import UserMenu from "./components/layout/user-menu";
import useAuth from "./hooks/use-auth";
//import { $sessionValid, clearUser } from "./lib/store";

function App() {
  const page = useStore($router);
  const { user } = useAuth();
  //const sessionValid = useStore($sessionValid);

  if (!page) {
    return <NotFoundPage />;
  }

  if (page.route === "notfound") {
    return <NotFoundPage />;
  }

  if (user && !user.username) {
    if (page.route === "home") {
      return (
        <div className="flex min-h-dvh">
          <div className="w-full max-w-md mx-auto md:max-w-lg">
            <Login />
          </div>
          <Toaster />
        </div>
      );
    }
    return (
      <div className="flex min-h-dvh">
        <div className="w-full max-w-md mx-auto md:max-w-lg">
          {page.route === "login" && <Login />}
          {page.route === "register" && <Register />}
        </div>
        <Toaster />
      </div>
    );
  }

  if (user && user.username) {
    return (
      <div className="flex min-h-dvh">
        <div className="flex-1">
          <Sidebar />
        </div>
        <div className="w-full max-w-md mx-auto md:max-w-lg">
          <Feed />
        </div>
        <div className="flex-1">
          <UserMenu />
          {/* Placeholder for another sidebar */}
        </div>
        <div className="flex-none">
          <Toaster />
        </div>
      </div>
    );
  }
}

export default App;
