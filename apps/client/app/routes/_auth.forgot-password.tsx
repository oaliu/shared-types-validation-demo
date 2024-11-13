import { useLocation } from "@remix-run/react";

import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPassword() {
  const location = useLocation();
  const email = location.state?.email || "";

  return <ForgotPasswordForm email={email} />;
}
