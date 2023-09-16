import { UserProfile, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import RecentReview from "~/components/RecentReview";
import RecentReport from "~/components/RecentReport";
export default function UserProfilePage() {
  const router = useRouter();
  const user = useUser();
  if (user.isLoaded && !user.isSignedIn) {
    const currentURL = window.location.href;
    void router.push(`/sign-in/${encodeURIComponent(currentURL)}`);
  }

  const [isModal, setIsModal] = useState(false);

  function handleModal(event: React.MouseEvent) {
    event.stopPropagation();
    setIsModal((prev) => !prev);
  }

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div
          className={
            isModal
              ? "flex h-0 w-full justify-center border-b pt-10 md:w-80 md:border-b-0 md:border-r"
              : "flex w-full justify-center border-b pt-10 md:h-screen md:w-80 md:border-b-0  md:border-r"
          }
        >
          <div className="flex flex-col gap-2">
            <div>
              <Image
                src={user.user?.imageUrl ?? ""}
                alt=""
                width={150}
                height={150}
                className="rounded-full"
              />
            </div>
            <div onClick={handleModal} className="cursor-pointer select-none">
              Quản Lý Tài Khoản
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <div className="min-h-[16rem] border-b">
            <RecentReview />
          </div>
          <div>
            <RecentReport />
          </div>
        </div>
      </div>
      {isModal && (
        <>
          <div className="fixed inset-0 bg-gray-600 opacity-50"></div>
          <div className="flex h-screen w-screen items-center justify-center">
            <div className="relative rounded bg-white shadow-lg">
              <div
                className="m-2 flex  w-5 cursor-pointer justify-end text-center font-bold text-red-500 md:justify-start"
                onClick={handleModal}
              >
                X
              </div>
              <UserProfile />
            </div>
          </div>
        </>
      )}
    </>
  );
}
