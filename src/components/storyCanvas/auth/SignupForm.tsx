"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createInitialUserSchema,
  CreateInitialUserInput,
} from "@/lib/validation/create-initial-user-schema";
import { createInitialUser } from "@/lib/actions/auth/create-initial-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormErrorMessage from "../FormErrorMessage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { toast } from "sonner";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateInitialUserInput>({
    resolver: zodResolver(createInitialUserSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: CreateInitialUserInput) => {
    const formData = new FormData();
    formData.set("email", data.email);
    formData.set("password", data.password);
    formData.set("confirmPassword", data.confirmPassword);

    const result = await createInitialUser(formData);

    if (!result) {
      toast.error("An unknown error occurred");
      return;
    }

    if ("error" in result) {
      toast.error(result.error || "An unknown error occurred");
    } else {
      router.push(ROUTES.dashboard);
    }
  };

  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl" data-testid="signup-form-title">
            Welcome!
          </CardTitle>
          <CardDescription className="text-sm">
            Create the first user to get started with the StoryCanvas CMS.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor="email" required>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="cms@example.com"
                {...register("email")}
                data-testid="signup-form-email-input"
              />
              {errors.email && (
                <FormErrorMessage
                  error={errors.email.message}
                  data-testid="signup-form-email-error"
                />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="password" required>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                data-testid="signup-form-password-input"
              />
              {errors.password && (
                <FormErrorMessage
                  error={errors.password.message}
                  data-testid="signup-form-password-error"
                />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="confirmPassword" required>
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                data-testid="signup-form-confirm-password-input"
              />
              {errors.confirmPassword && (
                <FormErrorMessage
                  error={errors.confirmPassword.message}
                  data-testid="signup-form-confirm-password-error"
                />
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              data-testid="signup-form-submit-button"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;
