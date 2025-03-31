import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type FormButtonsProps = {
  submitButtonLabel: string;
  isSubmitting: boolean;
  onCancelNavigateTo: string;
};

const FormButtons = ({
  isSubmitting,
  onCancelNavigateTo,
  submitButtonLabel,
}: FormButtonsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        {submitButtonLabel}
      </Button>
      <Button type="button" asChild variant="secondary">
        <Link href={onCancelNavigateTo}>Cancel</Link>
      </Button>
    </div>
  );
};

export default FormButtons;
