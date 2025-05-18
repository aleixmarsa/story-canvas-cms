import SignupForm from "@/components/storyCanvas/auth/SignupForm";
import { ROUTES } from "@/lib/constants/story-canvas";
import { checkDbConnection } from "@/lib/db";
import { countAllUsers } from "@/lib/dal/users";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

const CreateInitialUserPage = async () => {
  const headerList = await headers();

  const pathname = headerList.get("x-current-path");
  const isErrorPage = pathname === ROUTES.error;

  // Check if the database connection is successful
  const isDbUp = await checkDbConnection();
  if (!isDbUp && !isErrorPage) {
    redirect(`${ROUTES.error}?type=db`);
  }

  // Fetch the number of users
  const countResult = await countAllUsers();
  if ("error" in countResult && !isErrorPage) {
    redirect(`${ROUTES.error}?type=count`);
  }

  const existingUser =
    "numberOfUsers" in countResult && countResult.numberOfUsers > 0;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        {existingUser ? (
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-2">
                Admin user already created
              </h1>
              <p className="text-muted-foreground mb-6">
                The initial admin user has already been created.
                <br />
                Please log in or contact the administrator to create new users
                from the dashboard.
              </p>
              <Button asChild>
                <Link href={ROUTES.login}>Go to Login</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <SignupForm />
        )}
      </div>
    </div>
  );
};

export default CreateInitialUserPage;
