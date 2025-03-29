import { Button } from "@/components/ui/button";

type DashboardHeaderProps =
  | { title: string }
  | {
      title: string;
      buttonLabel: string;
      buttonOnClick: () => void;
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
    </div>
  );
};

export default DashboardHeader;
