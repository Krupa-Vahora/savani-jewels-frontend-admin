"use client";

import { useState } from "react";
import constate from "constate";
import { loginAdmin } from "@/queries/auth";
import { useMutation } from "@tanstack/react-query";

import { ApiResponse } from "@/types/api.types";
import { AdminLoginRequest, AdminLoginResponse } from "@/types/auth.types";
import { useSnackbar } from "@/context/SnackbarContext";

const useLogin = () => {
  const { showError } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation<
    ApiResponse<AdminLoginResponse>,
    Error,
    AdminLoginRequest
  >({
    mutationFn: loginAdmin,
    onError: () => showError("Something went wrong"),
  });

  return {
    showPassword,
    setShowPassword,
    loginMutation,
  };
};

export const [LoginContextProvider, useLoginContext] = constate(useLogin);
