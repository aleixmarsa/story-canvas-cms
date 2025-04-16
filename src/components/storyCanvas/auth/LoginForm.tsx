"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginSchema } from "@/lib/validation/login-schema";
import { login } from "@/lib/actions/auth/login";
import FormErrorMessage from "../FormErrorMessage";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.set("email", data.email);
    formData.set("password", data.password);

    const result = await login(formData);

    if (!result) {
      setServerError("Unknown error");
      return;
    }

    if ("error" in result) {
      setServerError(result.error || "An unknown error occurred");
    } else {
      setSuccessMessage("User created successfully!");
      reset();
    }
  };

  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Log in to access the StoryCanvas dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <FormErrorMessage error={errors.email.message} />
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
              </div>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <FormErrorMessage error={errors.password.message} />
              )}
            </div>
            {serverError && <FormErrorMessage error={serverError} />}
            {successMessage && (
              <p className="text-sm text-green-600">{successMessage}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
