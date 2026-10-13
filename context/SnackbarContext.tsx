"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AlertColor } from "@mui/material";

import AppSnackbar from "@/components/common/AppSnackbar";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface SnackbarContextValue {
  showSnackbar: (message: string, severity?: AlertColor) => void;

  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;

  closeSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(
  undefined,
);

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = useCallback(
    (message: string, severity: AlertColor = "success") => {
      setSnackbar({
        open: true,
        message,
        severity,
      });
    },
    [],
  );

  const showSuccess = useCallback(
    (message: string) => {
      showSnackbar(message, "success");
    },
    [showSnackbar],
  );

  const showError = useCallback(
    (message: string) => {
      showSnackbar(message, "error");
    },
    [showSnackbar],
  );

  const showWarning = useCallback(
    (message: string) => {
      showSnackbar(message, "warning");
    },
    [showSnackbar],
  );

  const showInfo = useCallback(
    (message: string) => {
      showSnackbar(message, "info");
    },
    [showSnackbar],
  );

  const closeSnackbar = useCallback(() => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  }, []);

  const contextValue = useMemo(
    () => ({
      showSnackbar,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      closeSnackbar,
    }),
    [
      showSnackbar,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      closeSnackbar,
    ],
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbar must be used inside SnackbarProvider");
  }

  return context;
};
