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
  const reviewId =
    typeof router.query.reviewId === "string" ? router.query.reviewId : "";

  const { data } = api.review.getReviewbyID.useQuery(
    {
      reviewId: reviewId,
    },
    { enabled: !!user.user?.id },
  );
  return <></>;
}
