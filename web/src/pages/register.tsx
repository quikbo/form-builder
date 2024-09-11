import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/use-auth";
import { $router } from "@/lib/router";
import { getPagePath, redirectPage } from "@nanostores/router";

const Register = () => {
  const { user, register } = useAuth();

  if (user && user.username) {
    redirectPage($router, "home");
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    await register(name, username, password);
    redirectPage($router, "home");
  };

  return (
    <div className="space-y-8">
      <div className="text-3xl font-bold text-center">
        Register a new account
      </div>
      <p className="text-center">
        Or{" "}
        <a href={getPagePath($router, "login")} className="hover:underline">
          sign into an existing account
        </a>{" "}
      </p>
      <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter name..."
          required
          type="text"
          autoComplete="name"
        />
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
        <Button type="submit">Sign up</Button>
      </form>
    </div>
  );
};

export default Register;
