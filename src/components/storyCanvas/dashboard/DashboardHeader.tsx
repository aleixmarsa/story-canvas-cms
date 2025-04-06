"use client";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Rocket, Save } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

type DashboardHeaderProps =
  | {
      title: string;
      breadcrumbs: { label: string; href?: string }[];
      addButtonLabel?: undefined;
      addHref?: undefined;
      onAddClick?: undefined;
      onSaveDraft?: () => void;
      onPublish?: () => void;
      disableSaveButton?: boolean;
      loadingSaveButton?: boolean;
    }
  | {
      title: string;
      breadcrumbs: { label: string; href?: string }[];
      addButtonLabel: string;
      addHref: string;
      onAddClick?: never;
      onSaveDraft?: () => void;
      onPublish?: () => void;
      disableSaveButton?: boolean;
      loadingSaveButton?: boolean;
    }
  | {
      title: string;
      breadcrumbs: { label: string; href?: string }[];
      addButtonLabel: string;
      onAddClick: () => void;
      addHref?: never;
      onSaveDraft?: () => void;
      onPublish?: () => void;
      disableSaveButton?: boolean;
      loadingSaveButton?: boolean;
    };

const DashboardHeader = ({
  title,
  breadcrumbs,
  addButtonLabel,
  addHref,
  onAddClick,
  onSaveDraft,
  onPublish,
  disableSaveButton,
  loadingSaveButton,
}: DashboardHeaderProps) => {
  return (
    <header className="flex justify-between w-full h-16 px-6 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 h-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="space-y-1 group-has-[[data-collapsible=icon]]/sidebar-wrapper:space-y-0">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, idx) => (
                <Fragment key={idx}>
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink asChild>
                        <Link
                          href={item.href}
                          className="group-has-[[data-collapsible=icon]]/sidebar-wrapper:text-xs"
                        >
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbLink className="group-has-[[data-collapsible=icon]]/sidebar-wrapper:text-xs">
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-lg font-semibold group-has-[[data-collapsible=icon]]/sidebar-wrapper:text-sm">
            {title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {addButtonLabel &&
          (addHref || onAddClick) &&
          (addHref ? (
            <Button asChild variant="outline" size="sm" className="text-sm">
              <Link href={addHref}>
                <Plus className="w-4 h-4 mr-1" />
                {addButtonLabel}
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={onAddClick}>
              <Plus className="w-4 h-4 mr-1" />
              {addButtonLabel}
            </Button>
          ))}

        {(onPublish || onSaveDraft) && (
          <>
            {onSaveDraft && (
              <Button
                variant="outline"
                onClick={onSaveDraft}
                size="sm"
                disabled={disableSaveButton}
              >
                {loadingSaveButton ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                Save draft
              </Button>
            )}
            {onPublish && (
              <Button onClick={onPublish} size="sm">
                <Rocket className="w-4 h-4 mr-1" />
                Publish
              </Button>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
