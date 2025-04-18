"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center h-screen p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">Database Connection Error</h1>
          <p className="text-muted-foreground mb-6">
            We couldn’t connect to the database. Please try again later or
            contact the system administrator.
          </p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
