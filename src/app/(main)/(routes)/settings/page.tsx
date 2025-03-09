"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings/user-info");
  }, [router]);

  return null;
};

export default SettingsPage;