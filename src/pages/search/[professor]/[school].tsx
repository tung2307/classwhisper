import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export default function Page() {
  const router = useRouter();

  const professor =
    typeof router.query.professor === "string" ? router.query.professor : "";
  const [school, setSchool] = useState(
    typeof router.query.school === "string" ? router.query.school : "null",
  );
  const defaultSchool =
    typeof router.query.school === "string" ? router.query.school : "null";
  const { data: profResult } = api.professor.getAll.useQuery(
    {
      name: professor,
    },
    { enabled: !!professor && school == "null" },
  );
  const { data: schoolResult } = api.professor.getAll.useQuery(
    {
      name: professor,
      school: school,
    },
    { enabled: !!professor && school !== "null" },
  );
  console.log("ProfResult " + profResult);
  console.log("SchoolfResult " + school);
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

  return (
    <>
      <div className=" flex justify-center border p-10 text-sm md:p-20 md:text-base">
        <div className="flex flex-col">
          <div>
            {schoolResult === undefined && profResult && (
              <>Không tìm thấy giảng viên ở {defaultSchool}</>
            )}
          </div>
          <div>
            {schoolResult !== undefined && (
              <>
                Tìm thấy {schoolResult.length} giảng viên ở {defaultSchool}
              </>
            )}
            {(schoolResult === undefined ?? schoolResult?.length === 0) &&
              profResult && (
                <>Tìm thấy {profResult.length} giảng viên ở trường khác</>
              )}
          </div>

          {schoolResult ? (
            schoolResult.map((prof, index) => (
              <div
                key={index}
                className="flex w-full flex-col rounded border bg-gray-50 p-5 md:w-[50rem]"
              >
                <Link href={`/giangvien/${prof.id}`}>
                  <div className="flex flex-col gap-5 md:flex-row">
                    <div className="h-28 w-28 border bg-white">N/A</div>
                    <div className="flex flex-col" key={index}>
                      <div className="text-2xl font-bold">
                        {prof.lname + " " + prof.fname}
                      </div>
                      <div>{prof.level}</div>
                      <div>{prof.department}</div>
                      <div>{prof.school}</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <>
              {profResult?.map((prof, index) => (
                <div
                  key={index}
                  className="flex w-full flex-col rounded border bg-gray-50 p-5 md:w-[50rem]"
                >
                  <Link href={`/giangvien/${prof.id}`}>
                    <div className="flex flex-col gap-5 md:flex-row">
                      <div className="h-28 w-28 border bg-white">N/A</div>
                      <div className="flex flex-col" key={index}>
                        <div className="text-2xl font-bold">
                          {prof.lname + " " + prof.fname}
                        </div>
                        <div>{prof.level}</div>
                        <div>{prof.department}</div>
                        <div>{prof.school}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-10">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div>Không tìm thấy giảng viên</div>
            {school !== "null" ? <div>&nbsp;ở {school}?</div> : <>?</>}
          </div>
          <div className="flex w-full justify-center ">
            <Link
              href="/add/professor"
              className="border-b border-black text-center"
            >
              Tạo mới
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
