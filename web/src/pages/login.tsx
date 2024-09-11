import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/use-auth";
import { $router } from "@/lib/router";
import { getPagePath, redirectPage } from "@nanostores/router";

const Login = () => {
  const { user, login } = useAuth();

  if (user && user.username) {
    redirectPage($router, "home");
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    await login(username, password);
    redirectPage($router, "home");
  };

  return (
    <div className="space-y-8">
      <div className="text-3xl font-bold text-center">
        Sign into your account
      </div>
      <p className="text-center">
        Or{" "}
        <a href={getPagePath($router, "register")} className="hover:underline">
          create a new account
        </a>{" "}
      </p>
      <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          placeholder="Enter username..."
          required
          type="text"
          autoComplete="username"
        />
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          placeholder="Enter password..."
          required
          type="password"
          autoComplete="password"
        />
        <Button type="submit">Sign in</Button>
      </form>
    </div>
  );
};

export default Login;
