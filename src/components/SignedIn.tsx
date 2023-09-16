import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignedIn() {
  const user = useUser();
  const [isModal, setIsModal] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  function handleModal(event: React.MouseEvent) {
    event.stopPropagation();
    setIsModal((prev) => !prev);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="flex  flex-col items-center justify-center">
        <div className="relative flex flex-col items-center">
          <Image
            src={user.user?.imageUrl ?? "/path/to/default/image.png"}
            alt="User Image"
            width={50}
            height={50}
            className="cursor-pointer rounded-full hover:border hover:border-blue-400"
            onMouseDown={handleModal}
          />
          {isModal && (
            <div
              ref={modalRef}
              className="absolute right-0 top-14 w-32 rounded border bg-gray-100 p-2 text-center text-black"
            >
              <div className="mb-1 cursor-pointer hover:border-b hover:bg-gray-50">
                <Link href="/userprofile">Tài Khoản</Link>
              </div>
              <SignOutButton>
                <button className="w-full  hover:border-b hover:bg-gray-50">
                  Đăng Xuất
                </button>
              </SignOutButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
