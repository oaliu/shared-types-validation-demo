import { useEffect } from "react";
import { Outlet, useNavigate } from "@remix-run/react";

import { useAuthUserQuery } from "@/store/server/auth/queries";

import PageLoader from "@/components/common/PageLoader";
import { ModeToggle } from "@/components/common/ModeToggle";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const authuserQuery = useAuthUserQuery();
  const { data: authUser } = authuserQuery.data || {};

  useEffect(() => {
    if (authuserQuery.isLoading) {
      return;
    }

    if (!authUser) {
      navigate("/sign-in");
    }

    if (authUser && !authUser.isVerified) {
      navigate("/verify-email");
    }
  }, [authUser, navigate, authuserQuery.isLoading]);

  if (authuserQuery.isLoading) {
    return <PageLoader />;
  } else if (!authUser || !authUser.isVerified) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col min-h-dvh items-center">
      <div className="flex w-full justify-end gap-2 p-2 mb-auto">
        <ModeToggle />
      </div>
      <div className="flex flex-1 w-full justify-center items-center pb-10">
        <Outlet />
      </div>
    </div>
  );
}
