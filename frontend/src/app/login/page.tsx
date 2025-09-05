import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div
      className="min-h-[calc(100vh-5rem)] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/background_pattern.png')" }}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-10 w-full max-w-md mx-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">TB</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-6 text-center">Log in</h1>

        <form className="flex flex-col gap-4" autoComplete="off">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              autoComplete="off"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="********" 
              autoComplete="new-password"
            />
          </div>

          <Button className="mt-4 w-full">Log in</Button>
        </form>

        <p className="text-center text-sm text-gray-700 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}