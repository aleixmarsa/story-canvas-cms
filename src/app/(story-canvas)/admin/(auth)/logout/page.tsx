"use client";

import { useEffect } from "react";
import { logout } from "@/lib/actions/auth/login";

export default function LogoutPage() {
  useEffect(() => {
    logout();
  }, []);

  return null;
}
