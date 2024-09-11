import { $router } from "@/lib/router";
import { Button } from "../ui/button";
import { openPage } from "@nanostores/router";
import useAuth from "@/hooks/use-auth";
import { $sessionValid } from "@/lib/store";
import { useStore } from "@nanostores/react";

const UserMenu = () => {
  const { user, logout, validate } = useAuth();
  const sessionValid = useStore($sessionValid);

  const navigateToLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openPage($router, "login");
  };

  if (user.name) {
    return (
      <div className="space-y-2 m-3">
        <div>{`Welcome ${user.name}!`}</div>
        <Button
          variant={"secondary"}
          onClick={async () => {
            await validate();
            if (sessionValid) {
              logout();
            }
          }}
        >
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 m-3">
      <div>{`Welcome to Posts!`}</div>
      <Button onClick={navigateToLogin}>Sign in</Button>
    </div>
  );
};

export default UserMenu;
