import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function userProfile() {
  const router = useRouter();
  const user = useUser();
  if (user.isLoaded && !user.isSignedIn) {
    const currentURL = window.location.href;
    void router.push(`/sign-in/${encodeURIComponent(currentURL)}`);
  }

  
  return <></>;
}
