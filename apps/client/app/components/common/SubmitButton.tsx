import { Button, ButtonProps } from "@/components/ui/button";
import Spinner from "@/components/common/Spinner";

export interface ButtonSaveProps extends ButtonProps {
  processing?: boolean;
  text?: string;
  loadingText?: string;
}

export default function SubmitButton({
  processing = false,
  text = "Submit",
  loadingText = "Saving...",
  ...props
}: ButtonSaveProps) {
  return (
    <Button type="button" disabled={processing} {...props}>
      {processing && <Spinner />}
      {processing ? loadingText : text}
    </Button>
  );
}
