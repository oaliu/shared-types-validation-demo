import { cn } from "@/lib/utils";
import { ImSpinner2 } from "react-icons/im";

export default function Spinner({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <ImSpinner2 {...props} className={cn("animate-spin", props.className)} />
  );
}
