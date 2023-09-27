import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function EditReview() {
  const router = useRouter();
  const user = useUser();
  if (!user.isSignedIn && user.isLoaded) {
    const currentURL = window.location.href;
    void router.push(`/sign-in/${encodeURIComponent(currentURL)}`);
  }
  const { data } = api.review.getReviewsbyUser.useQuery(
    {
      userId: user.user?.id ?? "",
    },
    { enabled: !!user.user?.id },
  );
  return <></>;
}
