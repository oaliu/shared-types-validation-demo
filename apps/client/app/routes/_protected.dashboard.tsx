import SignOutButton from "@/components/auth/SIgnOutButton";

import { useAuthUserQuery } from "@/store/server/auth/queries";

export default function Dashboard() {
  const authuserQuery = useAuthUserQuery();
  const { data: authUser } = authuserQuery.data || {};
  const { name, email } = authUser || {};

  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-5">
      <div className="flex flex-col items-center">
        <div className="font-bold text-7xl">{name}</div>
        <div className="text-small text-muted-foreground">{email}</div>
      </div>
      <SignOutButton />
    </div>
  );
}
