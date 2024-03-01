import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen flex items-center justify-center bg-img-pattern bg-cover bg-no-repeat">
        <SignIn />
    </div>
  );
}