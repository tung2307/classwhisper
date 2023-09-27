import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Loading from "~/components/Loading";
import Report from "~/components/Report";
import { api } from "~/utils/api";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
const squares = [
  { color: "bg-green-400" }, // Easy
  { color: "bg-green-500" }, // Moderate
  { color: "bg-yellow-500" }, // Challenging
  { color: "bg-orange-600" }, // Hard
  { color: "bg-red-700" }, // Extremely Hard
];

export default function Profile() {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [course, setCourse] = useState("");
  const [isAddCourse, setIsAddCourse] = useState(false);
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const { data, isLoading } = api.professor.getProfessor.useQuery({ id: id });
  const { mutate } = api.professor.updateCourse.useMutation({});
  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  const reviews = data?.reviews ?? [];
  const sortedReviews = reviews.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const totalDifficulty = reviews.reduce(
    (sum, review) => sum + parseFloat(review.difficulty),
    0,
  );

  const averageDifficulty = reviews.length
    ? totalDifficulty / reviews.length
    : 0;

  const roundedAverageDifficulty = Math.round(averageDifficulty);
  const difficultyColor =
    squares[roundedAverageDifficulty - 1]?.color ?? "bg-gray-200";

  const recentReviews = showAllReviews
    ? sortedReviews
    : sortedReviews.slice(0, 8);

  function getDifficultyColor(difficultyScore: number) {
    const adjustedScore = difficultyScore;
    return squares[adjustedScore - 1]?.color ?? "bg-gray-200";
  }

  function handleAddCourse() {
    if (course == "") {
      return;
    }
    if (data?.course) {
      data.course += `, ${course}`; // This just alters the local variable and will not persist
      setCourse(""); // reset the input field
      setIsAddCourse(false); // hide the input field
      mutate({ id: data.id, course: data.course });
    }
  }
  return (
    <>
      <div className="flex w-screen justify-center p-2 md:p-10">
        <div className="flex w-[50rem] flex-col gap-5">
          <div className="flex flex-col gap-3 rounded border p-5 md:flex-row">
            <div className="flex w-full flex-col items-center md:w-auto md:items-start">
              <div className="w-full text-center font-semibold">Độ Khó</div>
              <div className={`h-28 w-28 rounded-3xl ${difficultyColor}`}>
                <div className="flex h-full items-center justify-center text-5xl text-white ">
                  {averageDifficulty === 0
                    ? "N/A"
                    : averageDifficulty.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-5">
              <div className="text-4xl font-bold">
                <span className="text-3xl font-thin">{data?.level}</span>
                {" " + data?.lname + " " + data?.fname}
              </div>
              <div>
                Giảng dạy
                <u>
                  <strong>{data?.department}</strong>
                </u>{" "}
                tại{" "}
                <u>
                  <strong>{data?.school}</strong>
                </u>
              </div>
              <div>Môn học:&nbsp;</div>
              <div className="flex flex-row flex-wrap gap-2">
                {data?.course.split(", ").map((course, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className="rounded border bg-blue-600 px-2 text-white"
                      >
                        {course}
                      </div>
                    </>
                  );
                })}
                {isAddCourse ? (
                  <>
                    <div className="mt-3 flex w-full flex-col gap-2">
                      <input
                        placeholder="Nhập Môn Học"
                        className="h-10 w-full rounded-lg px-3 shadow outline-none"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                      />
                      <div className="flex flex-row gap-5">
                        <div
                          className="flex cursor-pointer items-center justify-center rounded bg-blue-500 px-2 py-1 text-white"
                          onClick={handleAddCourse}
                        >
                          <CheckIcon />
                        </div>
                        <div
                          className="flex cursor-pointer items-center justify-center rounded bg-red-500 px-2 py-1 text-white"
                          onClick={() => setIsAddCourse(false)}
                        >
                          <CloseIcon />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="flex cursor-pointer items-center rounded-lg bg-gray-500 px-2 py-1 text-white"
                    onClick={() => {
                      setCourse("");
                      setIsAddCourse(true);
                    }}
                  >
                    <span className=" flex items-center ">
                      <AddCircleIcon />
                    </span>
                    Thêm Môn Học
                  </div>
                )}
              </div>
            </div>
          </div>

          <Link
            href={`/add/review/${id}`}
            className="w-28 rounded-xl border bg-blue-600 p-1 text-center text-white"
          >
            Nhận Xét
          </Link>

          <div className="border-t pt-10">
            {reviews.length > 0 ? (
              <>
                {recentReviews.map((review, index) => (
                  <div
                    key={index}
                    className="mb-10 rounded-xl border bg-gray-100 p-2"
                  >
                    <div className="flex flex-col gap-2 md:flex-row">
                      <div className="flex justify-center">
                        <div className="flex flex-col">
                          <div className="w-full text-center">Độ Khó</div>
                          <div
                            className={`h-16 w-16 rounded-2xl ${getDifficultyColor(
                              parseFloat(review.difficulty),
                            )}`}
                          >
                            <div className="flex h-full items-center justify-center text-4xl text-white">
                              {parseInt(review.difficulty)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full flex-col gap-2 border-t border-gray-400 md:border-l md:border-t-0 md:pl-5">
                        <div className="flex justify-between">
                          <div>
                            Môn Học: <strong>{review.course}</strong>
                          </div>
                          <div className="flex flex-row items-center gap-2">
                            <div>
                              {new Date(review.createdAt).toLocaleDateString(
                                "vi-VN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </div>
                            <div className="hidden md:flex">
                              <Report
                                reviewId={review.id}
                                isReport={review.isReport}
                              />
                            </div>
                          </div>
                        </div>
                        <div>{review.describe}</div>
                        <div className="flex flex-col gap-2 md:flex-row">
                          Tags:
                          <div className="flex flex-row flex-wrap  gap-2">
                            {review.tags.split(", ").map((tag, tagIndex) => (
                              <div
                                key={tagIndex}
                                className="  rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                              >
                                {tag}
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end md:hidden">
                            <Report
                              reviewId={review.id}
                              isReport={review.isReport}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {reviews.length > 8 && !showAllReviews && (
                  <button
                    onClick={() => setShowAllReviews(true)}
                    className="text-blue-500"
                  >
                    See more
                  </button>
                )}
              </>
            ) : (
              <>Chưa có nhận xét nào về giảng viên</>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
