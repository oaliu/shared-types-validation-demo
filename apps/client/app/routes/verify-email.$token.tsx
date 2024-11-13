// routes/verify-email.$token.tsx
import Spinner from "@/components/common/Spinner";
import { handleMutationError } from "@/lib/utils";
import { useVerifyEmailMutation } from "@/store/server/auth/mutations";
import { useNavigate, useParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

export default function VerifyEmailToken() {
  const navigate = useNavigate();
  const { token } = useParams();
  const hasRun = useRef(false);

  const verifyEmailMutation = useVerifyEmailMutation({
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: (error) => {
      handleMutationError(error, undefined, () => {
        navigate("/verify-email");
      });
    },
  });

  useEffect(() => {
    if (token && !hasRun.current) {
      hasRun.current = true;
      verifyEmailMutation.mutate(token);
    }
  }, [token, verifyEmailMutation]);

  return (
    <div className="flex flex-1 flex-col h-dvh items-center justify-center">
      <h1 className="text-2xl font-bold mb-3">Verifying your email</h1>
      <div className="mb-3">
        This may take a few seconds. Please don&apos;t close this window.
      </div>
      <Spinner className="text-2xl" />
    </div>
  );
}
