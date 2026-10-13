"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useLoginContext } from "../LoginContext";
import { useForm } from "react-hook-form";

import {
  AppForm,
  FieldType,
  FormLayout,
  type FormField,
} from "@/components/common/Form";
import type { AdminLoginRequest } from "@/types/auth.types";
import AppError from "@/components/common/AppError";

const LoginPage = () => {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const { loginMutation } = useLoginContext();
  const { control, handleSubmit } = useForm<AdminLoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = (data: AdminLoginRequest) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        login(response?.data?.admin, response?.data?.token);
        router.push("/dashboard");
      },
    });
  };

  const fields: FormField<AdminLoginRequest>[] = [
    {
      type: FieldType.TextField,
      name: "email",
      control,
      label: "Email",
      inputType: "email",
      placeholder: "Enter email",
      required: true,
    },
    {
      type: FieldType.TextField,
      name: "password",
      control,
      label: "Password",
      inputType: "password",
      placeholder: "Enter password",
      required: true,
    },
    {
      type: FieldType.Button,
      label: "Login",
      buttonType: "submit",
      variant: "contained",
      fullWidth: true,
      loading: loginMutation.isPending,
      loadingText: "Logging in...",
    },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-6">
        <h1 className="mb-6 text-2xl font-bold">Admin Login</h1>

        <AppForm onSubmit={handleSubmit(onSubmit)}>
          <FormLayout fields={fields} className="space-y-4" />

          {loginMutation.isError && (
            <AppError message={loginMutation.error.message || "Login failed"} />
          )}
        </AppForm>
      </div>
    </main>
  );
};

export default LoginPage;
