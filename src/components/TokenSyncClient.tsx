"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/contexts/AuthContext";

// This component syncs the auth token between localStorage and cookies
// so that server components can access it
export default function TokenSyncClient() {
  const { token } = useAuth();

  useEffect(() => {
    // When token changes, update cookie
    if (token) {
      Cookies.set("auth_token", token, { expires: 7, path: "/" });
    } else {
      Cookies.remove("auth_token");
    }
  }, [token]);

  // This component doesn't render anything
  return null;
}
