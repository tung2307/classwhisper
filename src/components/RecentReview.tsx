import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
const squares = [
  { color: "bg-green-400" }, // Easy
  { color: "bg-green-500" }, // Moderate
  { color: "bg-yellow-500" }, // Challenging
  { color: "bg-orange-600" }, // Hard
  { color: "bg-red-700" }, // Extremely Hard
];
export default function RecentReview() {
  const user = useUser();
  const { data } = api.review.getReviewsbyUser.useQuery(
    {
      userId: user.user?.id ?? "",
    },
    { enabled: !!user.user?.id },
  );
  function getDifficultyColor(difficultyScore: number) {
    const adjustedScore = difficultyScore + 1;
    return squares[adjustedScore - 1]?.color ?? "bg-gray-200";
  }
  return (
    <>
      <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-2 gap-5 p-5">
        {data
          ? data.map((review, index) => (
              <>
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
                            {parseInt(review.difficulty) + 1}
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
                        </div>
                      </div>
                      <div className="h-20 overflow-y-auto">
                        {review.describe}
                      </div>

                      <div className="flex flex-col gap-2 md:flex-row">
                        Tags:
                        <div className="flex flex-row flex-wrap  gap-2 max-h-20 overflow-auto">
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
              </>
            ))
          : null}
      </div>
    </>
  );
}
