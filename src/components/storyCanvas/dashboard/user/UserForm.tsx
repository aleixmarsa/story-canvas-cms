"use client";

import { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  CreateUserInput,
} from "@/lib/validation/create-user-schema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import FormErrorMessage from "../../FormErrorMessage";
import { ROUTES } from "@/lib/constants/storyCanvas";
import { createUser } from "@/lib/actions/users/create-user";
import { Role } from "@prisma/client";
import { toast } from "sonner";

type UserFormProps = {
  setDirty?: (dirty: boolean) => void;
  setIsSubmitting?: (submitting: boolean) => void;
};

export const UserForm = forwardRef<HTMLFormElement, UserFormProps>(
  ({ setDirty, setIsSubmitting }, ref) => {
    const router = useRouter();

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting, isDirty },
      setError,
      reset,
    } = useForm<CreateUserInput>({
      resolver: zodResolver(createUserSchema),
      defaultValues: {
        email: "",
        password: "",
        confirmPassword: "",
        role: Role.EDITOR,
      },
    });

    useEffect(() => {
      if (setDirty) setDirty(isDirty);
    }, [isDirty, setDirty]);

    useEffect(() => {
      if (setIsSubmitting) setIsSubmitting(isSubmitting);
    }, [isSubmitting, setIsSubmitting]);

    const onSubmit = async (data: CreateUserInput) => {
      const formData = new FormData();
      formData.set("email", data.email);
      formData.set("password", data.password);
      formData.set("confirmPassword", data.confirmPassword);
      formData.set("role", data.role);

      const result = await createUser(formData);

      if (!result || ("error" in result && result.type === "email")) {
        setError("email", {
          type: "manual",
          message: result?.error || "Unknown error",
        });
        return;
      }

      if (result && "error" in result) {
        toast.error(result.error);
        return;
      }

      reset();
      toast.success("User created successfully");
      router.push(`${ROUTES.dashboard}/users`);
    };
    return (
      <form
        ref={ref}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg"
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register("email")} />
          {errors.email && <FormErrorMessage error={errors.email.message} />}
        </div>
        <div>
          <Label htmlFor="role">Role</Label>

          <Select {...register("role")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Role).map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && <FormErrorMessage error={errors.role.message} />}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <FormErrorMessage error={errors.password.message} />
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <FormErrorMessage error={errors.confirmPassword.message} />
          )}
        </div>
      </form>
    );
  }
);

UserForm.displayName = "UserForm";
