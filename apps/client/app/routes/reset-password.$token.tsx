import { useParams } from "@remix-run/react";

import ResetPasswordFrom from "@/components/auth/ResetPasswordForm";
import { ModeToggle } from "@/components/common/ModeToggle";

export default function ResetPassword() {
  const { token } = useParams();

  return (
    <div className="flex flex-1 flex-col min-h-dvh items-center">
      <div className="flex w-full justify-end gap-2 p-2 mb-auto">
        <ModeToggle />
      </div>
      <div className="flex flex-1 w-full justify-center items-center pb-10">
        <ResetPasswordFrom token={token || ""} />
      </div>
    </div>
  );
}
