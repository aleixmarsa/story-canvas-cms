import { Button } from "@/components/ui/button";
import Link from "next/link";
type DashboardHeaderProps =
  | { title: string }
  | {
      title: string;
      buttonLabel: string;
      buttonOnClick: () => void;
    }
  | {
      title: string;
      href: string;
      linkText: string;
    };

const DashboardHeader = (props: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">{props.title}</h1>
      {"buttonLabel" in props && "buttonOnClick" in props && (
        <Button onClick={props.buttonOnClick} role="button">
          {props.buttonLabel}
        </Button>
      )}
      {"href" in props && "linkText" in props && (
        <Button asChild>
          <Link href={props.href}>{props.linkText}</Link>
        </Button>
      )}
    </div>
  );
};

export default DashboardHeader;
