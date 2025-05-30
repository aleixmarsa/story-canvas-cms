import { LoginForm } from "@/components/storyCanvas/auth/LoginForm";

const CreateInitialUserPage = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </div>
  );
};

export default CreateInitialUserPage;
