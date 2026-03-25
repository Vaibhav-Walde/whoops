"use client";

import React from "react";
import { ToastProvider } from "./ToastContext";

const ServerToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <ToastProvider>{children}</ToastProvider>;
};

export default ServerToastProvider;
