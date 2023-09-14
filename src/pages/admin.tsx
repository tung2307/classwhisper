import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Admin() {
  const user = useUser();
  const router = useRouter();
  const email = user.user?.emailAddresses[0]?.emailAddress;
  useEffect(() => {
    if (
      !user.isSignedIn &&
      user.isLoaded &&
      email !== "tung.nguyen23797@gmail.com"
    ) {
      router.push("/");
    }
  }, [user, router]);

  return <></>;
}
