"use client";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Rocket, Save, Loader2, Eye, EyeOff } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

type Breadcrumb = { label: string; href?: string };

type DashboardHeaderProps = {
  title: string;
  breadcrumbs: Breadcrumb[];
  onSaveDraft?: () => void;
  customSaveLabel?: string;
  onPublish?: () => void;
  saveDisabled?: boolean;
  isSaving?: boolean;
  publishButtonLabel?: string;
  isPublishing?: boolean;
  onTogglePreview?: () => void;
  previewVisible?: boolean;
};

const DashboardHeader = ({
  title,
  breadcrumbs,
  onSaveDraft,
  customSaveLabel,
  onPublish,
  saveDisabled,
  isSaving,
  publishButtonLabel = "Publish",
  isPublishing,
  onTogglePreview,
  previewVisible,
}: DashboardHeaderProps) => {
  return (
    <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-2.5 py-2 md:py-0 w-full h-fit md:h-16 px-4 md:px-6  shrink-0 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 h-full overflow-hidden">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="space-y-1 group-has-[[data-collapsible=icon]]/sidebar-wrapper:space-y-0 overflow-hidden">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, idx) => (
                <Fragment key={idx}>
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink asChild>
                        <Link
                          href={item.href}
                          className="text-xs group-has-[[data-collapsible=icon]]/sidebar-wrapper:text-xs"
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
          <p className="text-sm font-semibold group-has-[[data-collapsible=icon]]/sidebar-wrapper:text-sm truncate">
            {title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto md:ml-0">
        {onTogglePreview && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePreview}
            className="text-sm flex items-center gap-1"
          >
            <>
              {previewVisible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>
                <span className="hidden md:inline">Live </span>Preview
              </span>
            </>
          </Button>
        )}

        {(onPublish || onSaveDraft) && (
          <>
            {onSaveDraft && (
              <Button
                variant="outline"
                onClick={onSaveDraft}
                size="sm"
                disabled={saveDisabled}
                data-testid="header-save-button"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                {customSaveLabel ? (
                  <span>{customSaveLabel}</span>
                ) : (
                  <span>
                    Save<span className="hidden md:inline"> Draft</span>
                  </span>
                )}
              </Button>
            )}
            {onPublish && (
              <Button onClick={onPublish} size="sm">
                {isPublishing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Rocket className="w-4 h-4 mr-1" />
                )}
                <span className="inline md:hidden">Publish</span>
                <span className="hidden md:inline">{publishButtonLabel}</span>
              </Button>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
