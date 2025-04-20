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
import { toast } from "sonner";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginInput) => {
    setSuccessMessage(null);

    const formData = new FormData();
    formData.set("email", data.email);
    formData.set("password", data.password);

    const result = await login(formData);

    if (!result) {
      toast.error("An unknown error occurred");
      return;
    }

    if ("error" in result) {
      toast.error(result.error || "An unknown error occurred");
    } else {
      reset();
    }
  };

  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl" data-testid="login-form-title">
            Login
          </CardTitle>
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
                data-testid="login-form-email-input"
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
              <Input
                id="password"
                type="password"
                {...register("password")}
                data-testid="login-form-password-input"
              />
              {errors.password && (
                <FormErrorMessage error={errors.password.message} />
              )}
            </div>
            {successMessage && (
              <p className="text-sm text-green-600">{successMessage}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              data-testid="login-form-submit-button"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
