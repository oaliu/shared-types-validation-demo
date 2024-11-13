import { Logo } from "./Logo";

export default function PageLoader() {
  return (
    <div className="flex flex-1 h-dvh items-center justify-center">
      <Logo className="text-6xl animate-bounce" />
    </div>
  );
}
