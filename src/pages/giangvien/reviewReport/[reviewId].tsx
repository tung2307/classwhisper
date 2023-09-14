import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

export default function reviewReport() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const router = useRouter();
  const reviewId =
    typeof router.query.reviewId === "string" ? router.query.reviewId : "";

  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");

  const user = useUser();
  if (!user.isSignedIn && user.isLoaded) {
    const currentURL = window.location.href;
    void router.push(`/sign-in/${encodeURIComponent(currentURL)}`);
  }

  const { data } = api.review.getReviewbyID.useQuery(
    { reviewId: reviewId },
    { enabled: !!reviewId },
  );

  const { mutate, isLoading } = api.report.create.useMutation({
    onSuccess() {
      setShowSuccessMessage(true);

      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        setShowSuccessMessage(false);
        void router.push(`/giangvien/${data?.profId}`);
      }, 5000);
    },
  });
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    mutate({ reviewId, reason, detail });
  };

  return (
    <>
      <div className="flex w-screen justify-center pt-10">
        <div className="flex flex-col gap-4">
          <div>
            {showSuccessMessage && (
              <div className="rounded border p-5 ">
                <p className="font-bold">Báo cáo đã được gửi để xem xét</p>
                <p>Quay về trang ({timeLeft}s)</p>
              </div>
            )}
          </div>
          <div className="w-full text-center text-2xl font-bold">
            Báo Cáo Nhận Xét
          </div>
          <div className="w-full rounded border bg-gray-100 p-5 shadow">
            <div className="font-bold">Bạn đang báo cáo bài viết này:</div>
            {data?.describe}
          </div>
          <form
            onSubmit={handleSubmit}
            className="w-full rounded border bg-gray-100 p-5 shadow md:w-[35rem]"
          >
            <div className="mb-5">
              <label className="mb-2 block">
                Lý do <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 outline-none"
                required
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block">Chi tiết</label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full resize-none rounded border border-gray-300 p-2 outline-none"
              />
            </div>

            <button
              type="submit"
              className={
                isLoading
                  ? "disabled cursor-not-allowed rounded border-none bg-blue-500 px-8 py-3 text-white"
                  : "cursor-pointer rounded border-none bg-blue-500 px-8 py-3 text-white"
              }
              disabled={isLoading}
            >
              {isLoading ? "Đang Đăng" : "Đăng"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
