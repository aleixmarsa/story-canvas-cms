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

// Types

type DashboardHeaderProps =
  | {
      title: string;
      breadcrumbs: { label: string; href?: string }[];
      addButtonLabel?: undefined;
      addHref?: undefined;
      onAddClick?: undefined;
      onSaveDraft?: () => void;
      onPublish?: () => void;
    }
  | {
      title: string;
      breadcrumbs: { label: string; href?: string }[];
      addButtonLabel: string;
      addHref: string;
      onAddClick?: never;
      onSaveDraft?: () => void;
      onPublish?: () => void;
    }
  | {
      title: string;
      breadcrumbs: { label: string; href?: string }[];
      addButtonLabel: string;
      onAddClick: () => void;
      addHref?: never;
      onSaveDraft?: () => void;
      onPublish?: () => void;
    };

const DashboardHeader = ({
  title,
  breadcrumbs,
  addButtonLabel,
  addHref,
  onAddClick,
  onSaveDraft,
  onPublish,
}: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 px-6 border-b h-20">
      <div className="space-y-1">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, idx) => (
              <Fragment key={idx}>
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink>{item.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <p className="text-lg font-semibold">{title}</p>
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
              <Button variant="outline" onClick={onSaveDraft} size="sm">
                <Save className="w-4 h-4 mr-1" />
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
    </div>
  );
};

export default DashboardHeader;
