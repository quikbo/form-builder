import { $router } from "@/lib/router";
import { redirectPage } from "@nanostores/router";
import { Button } from "../components/ui/button";
import { HomeIcon } from "@radix-ui/react-icons";

const NotFoundPage = () => {
  const navigateHome = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    redirectPage($router, "home");
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-dvh">
        404 Not Found: The page you are looking for doesn't exist
        <Button
          aria-label={"Home"}
          variant="ghost"
          size="icon"
          onClick={navigateHome}
        >
          <HomeIcon className="w-5 h-5" />
        </Button>
      </div>
    </>
  );
};

export default NotFoundPage;
