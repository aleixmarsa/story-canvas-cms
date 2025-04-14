import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userCount = await prisma.user.count();
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  if (userCount === 0 && pathname !== "/admin/create-initial-user") {
    redirect("/admin/create-initial-user");
  } else if (userCount > 0 && pathname !== "/admin/login") {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
