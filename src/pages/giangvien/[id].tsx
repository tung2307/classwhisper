import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

const squares = [
  { color: "bg-green-400" }, // Easy
  { color: "bg-green-500" }, // Moderate
  { color: "bg-yellow-500" }, // Challenging
  { color: "bg-orange-600" }, // Hard
  { color: "bg-red-700" }, // Extremely Hard
];

export default function Profile() {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const { data, isLoading } = api.professor.getProfessor.useQuery({ id: id });

  if (isLoading) {
    return <>Loading...</>;
  }

  const reviews = data?.reviews ?? [];
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

  const recentReviews = showAllReviews ? reviews : reviews.slice(0, 8);

  function getDifficultyColor(difficultyScore: number) {
    const roundedScore = Math.round(difficultyScore);
    return squares[roundedScore - 1]?.color ?? "bg-gray-200";
  }

  return (
    <>
      <div className="flex w-screen justify-center p-2 md:p-10">
        <div className="flex w-[45rem] flex-col gap-5">
          <div className="flex flex-col gap-3 rounded border p-5 md:flex-row">
            <div className="flex w-full flex-col items-center md:w-auto md:items-start">
              <div className="text-center font-semibold">Độ Khó</div>
              <div className={`h-24 w-24 rounded-3xl ${difficultyColor}`}>
                <div className="flex h-full items-center justify-center text-5xl text-white">
                  {averageDifficulty === 0
                    ? "N/A"
                    : averageDifficulty.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-5">
              <div className="text-4xl font-bold">
                {data?.level + " " + data?.lname + " " + data?.fname}
              </div>
              <div>
                Giảng Viên khoa{" "}
                <u>
                  <strong>{data?.department}</strong>
                </u>{" "}
                ở{" "}
                <u>
                  <strong>{data?.school}</strong>
                </u>
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
                          <div>Độ Khó</div>
                          <div
                            className={`h-16 w-16 rounded-2xl ${getDifficultyColor(
                              parseFloat(review.difficulty),
                            )}`}
                          >
                            <div className="flex h-full items-center justify-center text-4xl text-white">
                              {review.difficulty}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 border-t md:border-t-0 border-gray-400 md:pl-5 md:border-l">
                        <div>
                          Môn Học: <strong>{review.course}</strong>
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
