import { FaCode } from "react-icons/fa";

export function Logo({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <FaCode {...props} className={props.className + " " + "inline-block"} />
  );
}
