import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import AdminLoginForm from "@/components/screens/admin/admin_login_form/admin_login_form";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const redirectPath =
    typeof router.query.redirect === "string" &&
    router.query.redirect.startsWith("/admin") &&
    router.query.redirect !== "/admin/login"
      ? router.query.redirect
      : "/admin/tours";

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectPath);
    }
  }, [user, loading, router, redirectPath]);

  return <AdminLoginForm onSuccess={() => router.replace(redirectPath)} />;
}
