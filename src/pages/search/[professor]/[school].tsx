import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";
interface Review {
  difficulty: string;
  // include other fields if necessary
}

const squares = [
  { color: "bg-green-400" }, // Easy
  { color: "bg-green-500" }, // Moderate
  { color: "bg-yellow-500" }, // Challenging
  { color: "bg-orange-600" }, // Hard
  { color: "bg-red-700" }, // Extremely Hard
];

export default function Page() {
  const router = useRouter();

  const professor =
    typeof router.query.professor === "string" ? router.query.professor : "";
  const [school, setSchool] = useState(
    typeof router.query.school === "string" ? router.query.school : "null",
  );
  const defaultSchool =
    typeof router.query.school === "string" ? router.query.school : "null";
  const { data: profResult, isLoading: profLoading } =
    api.professor.getAll.useQuery(
      {
        name: professor,
      },
      { enabled: !!professor && school == "null" },
    );
  const { data: schoolResult, isLoading: schoolLoading } =
    api.professor.getAll.useQuery(
      {
        name: professor,
        school: school,
      },
      { enabled: !!professor && school !== "null" },
    );

  useEffect(() => {
    setSchool(
      typeof router.query.school === "string" ? router.query.school : "null",
    );
  }, [router.query.school]);

  useEffect(() => {
    if (schoolResult?.length == 0 && schoolResult !== undefined) {
      setSchool("null");
    }
  }, [schoolResult]);

  const calculateAverageDifficulty = (
    reviews: Review[] | undefined,
  ): number => {
    if (!reviews || reviews.length === 0) return 0;

    const totalDifficulty = reviews.reduce(
      (acc, review) => acc + parseFloat(review.difficulty),
      0,
    );
    return totalDifficulty / reviews.length;
  };
  return (
    <>
      {profLoading ?? schoolLoading ? <Loading /> : null}
      <div className=" flex justify-center border p-10 text-sm md:p-20 md:text-base">
        <div className="flex w-full flex-col">
          <div className="text-center">
            {defaultSchool !== "null" &&
              schoolResult === undefined &&
              profResult && <>Không tìm thấy giảng viên ở {defaultSchool}</>}
            {defaultSchool === "null" &&
              schoolResult === undefined &&
              profResult?.length == 0 && <>Không tìm thấy giảng viên</>}
          </div>
          <div className="text-center">
            {schoolResult !== undefined && (
              <>
                Tìm thấy {schoolResult.length} giảng viên ở {defaultSchool}
              </>
            )}
            {(schoolResult === undefined ?? schoolResult?.length === 0) &&
              defaultSchool !== "null" &&
              profResult &&
              profResult.length !== 0 && (
                <>
                  Tìm thấy {profResult.length} giảng viên có tên{" "}
                  <strong>{professor}</strong> ở trường khác
                </>
              )}
            {(schoolResult === undefined ?? schoolResult?.length === 0) &&
              defaultSchool == "null" &&
              profResult &&
              profResult.length !== 0 && (
                <>
                  Tìm thấy {profResult.length} giảng viên{" "}
                  <strong>{professor}</strong> ở các trường
                </>
              )}
          </div>

          {schoolResult ? (
            schoolResult.map((prof, index) => {
              const averageDifficulty =
                calculateAverageDifficulty(prof.reviews) ?? 0;
              let difficultyColor = "bg-gray-200"; // Default to gray
              if (averageDifficulty !== 0) {
                const difficultyIndex = Math.max(
                  1,
                  Math.min(5, Math.round(averageDifficulty)),
                );
                difficultyColor =
                  squares[difficultyIndex - 1]?.color ?? "bg-gray-200"; // this will rarely fall back to gray now, since the array has defined colors for indices 1-5
              }
              return (
                <div
                  key={index}
                  className="mb-5 flex w-full flex-col rounded border bg-gray-50 p-5 md:w-[50rem]"
                >
                  <Link href={`/giangvien/${prof.id}`}>
                    <div className="flex flex-col gap-5 md:flex-row">
                      <div className="flex flex-col">
                        <div className="text-center font-semibold">Độ Khó</div>
                        <div
                          className={`h-24 w-24 border ${difficultyColor} flex items-center justify-center rounded-xl`}
                        >
                          <div className="text-3xl text-white">
                            {averageDifficulty === 0
                              ? "N/A"
                              : averageDifficulty.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col" key={index}>
                        <div className="text-2xl font-bold">
                          {prof.lname + " " + prof.fname}
                        </div>
                        <div>{prof.level}</div>
                        <div>{prof.course}</div>
                        <div>{prof.school}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })
          ) : (
            <>
              {profResult?.map((prof, index) => {
                const averageDifficulty =
                  calculateAverageDifficulty(prof.reviews) ?? 0;
                let difficultyColor = "bg-gray-200"; // Default to gray
                if (averageDifficulty !== 0) {
                  const difficultyIndex = Math.max(
                    1,
                    Math.min(5, Math.round(averageDifficulty)),
                  );
                  difficultyColor =
                    squares[difficultyIndex - 1]?.color ?? "bg-gray-200"; // this will rarely fall back to gray now, since the array has defined colors for indices 1-5
                }
                return (
                  <div key={index} className="flex w-full justify-center">
                    <div className="mb-5 flex w-full flex-col rounded border bg-gray-50 p-5 md:w-[50rem]">
                      <Link href={`/giangvien/${prof.id}`}>
                        <div className="flex flex-col gap-5 md:flex-row">
                          <div className="flex flex-col items-center">
                            <div className="text-center font-semibold">
                              Độ Khó
                            </div>
                            <div
                              className={`h-24 w-24 border ${difficultyColor} flex items-center justify-center rounded-xl`}
                            >
                              <div className="text-3xl text-white">
                                {averageDifficulty === 0
                                  ? "N/A"
                                  : averageDifficulty.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col" key={index}>
                            <div className="text-2xl font-bold">
                              {prof.lname + " " + prof.fname}
                            </div>
                            <div>{prof.level}</div>
                            <div>{prof.course}</div>
                            <div>{prof.school}</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-10 font-bold">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div>Không tìm thấy giảng viên</div>
            {school !== "null" ? <div>&nbsp;ở {school}?</div> : <>?</>}
          </div>
          <div className="flex w-full justify-center ">
            <Link
              href="/add/professor"
              className="mb-10 border-b border-black text-center text-xl text-red-500 md:text-2xl"
            >
              Tạo mới
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
