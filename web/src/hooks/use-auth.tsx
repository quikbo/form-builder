import { toast } from "@/components/ui/use-toast";
import { signIn, signOut, signUp, validateSession } from "@/data/api";
import { $router } from "@/lib/router";
import { $user, clearUser, setSessionValid, setUser } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { redirectPage } from "@nanostores/router";

function useAuth() {
  const user = useStore($user);

  const login = async (username: string, password: string) => {
    try {
      const user = await signIn(username, password);
      setUser(user);
    } catch (err) {
      const errorMessage = (err as Error).message ?? "Please try again!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error signing in!",
        description: errorMessage,
      });
    }
  };

  const register = async (name: string, username: string, password: string) => {
    try {
      const user = await signUp(name, username, password);
      setUser(user);
    } catch (err) {
      const errorMessage = (err as Error).message ?? "Please try again!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error registering!",
        description: errorMessage,
      });
    }
  };

  const logout = async () => {
    try {
      const success = await signOut();
      success && clearUser();
    } catch (err) {
      const errorMessage = (err as Error).message ?? "Please try again!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error signing out!",
        description: errorMessage,
      });
    }
  };

  const validate = async () => {
    try {
      const success = await validateSession();
      setSessionValid(success);
      if (!success) {
        clearUser();
        redirectPage($router, "login");
      }
      return success;
    } catch (err) {
      const errorMessage = (err as Error).message ?? "Please try again!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error validating session!",
        description: errorMessage,
      });
    }
  };

  return { user, login, register, logout, validate };
}

export default useAuth;
