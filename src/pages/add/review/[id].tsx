import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export default function Review() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const { mutate, isLoading } = api.review.create.useMutation({
    onSuccess() {
      void router.push(`/giangvien/${id}`);
    },
  });
  const user = useUser();
  const [course, setCourse] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [difficulty, setDifficulty] = useState("");
  const [describe, setDescribe] = useState("");
  const tagOptions = [
    "Sẽ học lại lần nữa",
    "Bài giảng tuyệt vời",
    "Dễ tiếp cận ngoài lớp",
    "Quan tâm",
    "Tiêu chí chấm điểm rõ ràng",
    "Cung cấp phản hồi tốt",
    "Chuẩn bị đọc nhiều",
    "Chấm điểm dựa trên vài yếu tố",
    "Dự án nhóm",
    "Hài hước",
    "Cảnh giác với bài kiểm tra bất ngờ",
    "Truyền cảm hứng",
    "Nhiều bài giảng",
    "Nhiều bài tập về nhà",
    "Yêu cầu tham gia lớp",
    "Được tôn trọng",
    "Bỏ lớp? Bạn sẽ không qua.",
    "Quá nhiều bài luận",
    "Nhiều bài kiểm tra",
    "Giao viên chấm điểm khắt khe",
  ];
  const [showNotification, setShowNotification] = useState(true);

  const handleNotificationClose = () => {
    setShowNotification(false);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const joinedTags = tags.join(", ");

    const formData = {
      course,
      tags: joinedTags,
      difficulty:(parseFloat(difficulty) + 1).toString(),
      describe,
    };



    if (user.isSignedIn) {
      mutate({ profId: id, userId: user.user.id, ...formData });
    } else {
      mutate({ profId: id, ...formData });
    }
  };
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const handleDifficultyClick = (index: number) => {
    setDifficulty(index.toString());
    setClickedIndex(index);
  };
  const [hoverIndex, setHoverIndex] = useState<number>(-1);

  const squares = [
    { color: "bg-green-300" }, // Easy
    { color: "bg-green-400" }, // Moderate
    { color: "bg-yellow-500" }, // Challenging
    { color: "bg-orange-600" }, // Hard
    { color: "bg-red-700" }, // Extremely Hard
  ];
  const handleTagClick = (tag: string) => {
    setTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  return (
    <>
      {!user.isSignedIn && user.isLoaded && showNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="rounded bg-white p-5">
            <p className="mb-4">
              Đăng nhập tài khoản sẽ có khả năng chỉnh sửa hoặc xóa nhận xét của
              mình.
            </p>
            <button
              onClick={handleNotificationClose}
              className="rounded bg-blue-500 px-4 py-2 text-white"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}
      <div className="flex w-screen justify-center p-5 md:p-10">
        <div className="flex flex-col gap-5 ">
          <div className="text-center text-3xl font-bold md:text-4xl">
            Viết Đánh Giá
          </div>
          <div className="guideline-container rounded-md bg-gray-100 p-2 md:p-5">
            <h2 className="mb-3 text-lg font-bold md:text-2xl">
              Hướng Dẫn Đánh Giá & Nhận Xét
            </h2>
            <p className="mb-2">
              Vui lòng tuân thủ các nguyên tắc sau khi viết nhận xét của bạn:
            </p>
            <ul className="list-inside list-disc text-sm md:text-base">
              <li>Hãy tôn trọng và cân nhắc.</li>
              <li>
                Tập trung vào những trải nghiệm gần đây. Nhận xét nên dựa trên
                những trải nghiệm trong năm học hiện tại hoặc trước đó.
              </li>
              <li>
                Cung cấp phản hồi xây dựng. Chia sẻ cụ thể những điều giáo viên
                làm tốt và những lĩnh vực họ có thể cải thiện.
              </li>
              <li>
                Giữ cho đề tài thảo luận. Nhận xét nên tập trung vào phong cách
                giảng dạy của giáo viên, không phải là những bình luận cá nhân
                hoặc vấn đề không liên quan.
              </li>
              <li>
                Tránh sử dụng ngôn ngữ không phù hợp hoặc tấn công cá nhân.
              </li>
              <li>Đảm bảo rằng nhận xét của bạn là sự thật và chính xác.</li>
              <li>
                Nhận xét nên là trải nghiệm cá nhân của bạn, không phải là tin
                đồn.
              </li>
            </ul>
            <p className="mt-2 text-sm font-semibold md:text-base">
              Những nhận xét không tuân thủ những nguyên tắc này có thể bị loại
              bỏ. Cảm ơn bạn đã giúp duy trì một cộng đồng tôn trọng và hữu ích.
            </p>
          </div>
          <div className="flex justify-center">
            <form
              onSubmit={handleSubmit}
              className=" w-full rounded border bg-gray-100  p-5 shadow md:w-[35rem] "
            >
              <div className="mb-5">
                <label className="mb-2 block">Tên môn học:</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 outline-none "
                  required
                />
              </div>
              <label className="mb-2 block">Tags:</label>
              <div className="mb-5 h-48 overflow-y-auto">
                <div className="mb-2 flex flex-wrap gap-2 text-sm">
                  {tagOptions.map((tag, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer rounded-xl border  p-2 ${
                        tags.includes(tag)
                          ? "bg-blue-500 text-white"
                          : "bg-white"
                      }`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block">Độ khó:</label>
                <div className="flex">
                  {squares.map((square, index) => (
                    <div
                      key={index}
                      className={`h-8 w-full cursor-pointer border 
                    ${index === 0 ? "rounded-l-2xl" : ""}
                    ${index === squares.length - 1 ? "rounded-r-2xl" : ""}
                    ${
                      index <=
                      (hoverIndex !== -1 ? hoverIndex : clickedIndex ?? -1)
                        ? square.color
                        : "bg-white"
                    }`}
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(clickedIndex ?? -1)}
                      onClick={() => handleDifficultyClick(index)}
                    ></div>
                  ))}
                </div>

                <div className="flex w-full justify-between">
                  <div>Dễ</div>
                  <div>Cực Khó</div>
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block">Mô tả:</label>
                <textarea
                  value={describe}
                  onChange={(e) => setDescribe(e.target.value)}
                  className="w-full resize-none rounded border border-gray-300 p-2 outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className={
                  isLoading
                    ? "disabled cursor-pointer rounded border-none bg-blue-500 px-8 py-3 text-white"
                    : "cursor-pointer rounded border-none bg-blue-500 px-8 py-3 text-white"
                }
                disabled={isLoading}
              >
                {isLoading ? "Đang Đăng" : "Đăng"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
