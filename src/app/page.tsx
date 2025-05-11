import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Home = () => {
  return (
    <main className="min-h-screen grid place-items-center p-8 sm:p-20 bg-background text-foreground font-sans">
      <Card className="max-w-xl w-full text-center space-y-6 shadow-lg">
        <CardHeader className="mb-0">
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            <Image
              src="/story-canvas-logo-with-name.svg"
              alt="Logo"
              width={280}
              height={38}
              className="mx-auto dark:invert"
              priority
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            A flexible and visual content management system to build interactive
            stories and customizable sections.
          </p>
          <p>
            Get started by creating your first user and begin crafting your
            stories!
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/admin/dashboard">Go to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default Home;
