"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("type");

  const getMessage = () => {
    switch (errorType) {
      case "db":
        return {
          title: "Database Connection Error",
          message:
            "The application could not connect to the database. Please check the database configuration or contact the system administrator.",
        };
      case "count":
        return {
          title: "User Retrieval Error",
          message:
            "The database connection is active, but an error occurred while retrieving user data.",
        };
      default:
        return {
          title: "Unexpected Error",
          message:
            "An unknown error occurred. Please try again later or contact support.",
        };
    }
  };

  const { title, message } = getMessage();

  return (
    <div className="flex items-center justify-center h-screen p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground mb-6">{message}</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;
