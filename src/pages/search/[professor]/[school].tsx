import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export default function page() {
  const router = useRouter();
  const professor =
    typeof router.query.professor === "string" ? router.query.professor : "";

  const [school, setSchool] = useState("null");
  const [defaultSchool, setDefaultSchool] = useState<string | null>(null);

  useEffect(() => {
    const savedSchool = localStorage.getItem("school");
    if (savedSchool) {
      setSchool(savedSchool);
    }

    if (
      typeof router.query.school === "string" &&
      router.query.school !== "null"
    ) {
      setDefaultSchool(router.query.school);
      setSchool(router.query.school);
      localStorage.setItem("school", router.query.school);
    }
  }, [router.query.school]);

  const { data: profResult } = api.professor.getAll.useQuery(
    {
      name: professor,
    },
    { enabled: !!professor && school == "null" },
  );
  const { data: schoolResult } = api.professor.getAll.useQuery(
    {
      name: professor,
      school: school!,
    },
    { enabled: !!professor && school != "null" },
  );

  useEffect(() => {
    if (schoolResult && schoolResult?.length === 0 && school !== "null") {
      setSchool("null");
      localStorage.setItem("school", "null");
    }
  }, [school, schoolResult, schoolResult?.length]);

  console.log("defaultSchool:", defaultSchool);
  console.log("schoolResult:", schoolResult);

  return (
    <>
      <div className="h-20 bg-black"></div>
      <div className=" flex justify-center border p-20">
        <div className="flex flex-col">
          <div>
            <div className="flex flex-row">
              {defaultSchool &&
                (schoolResult === undefined ?? schoolResult?.length === 0) && (
                  <div>Không tìm thấy giảng viên ở {defaultSchool}</div>
                )}
            </div>
          </div>

          <div className="mb-10 text-xl font-semibold">
            Có&nbsp;
            {schoolResult && schoolResult.length > 0
              ? schoolResult.length
              : profResult?.length}{" "}
            giảng viên{" "}
            {school !== "null" && schoolResult && schoolResult.length > 0 && (
              <>ở {school}</>
            )}
            {school === "null" && profResult && profResult.length > 0 && (
              <>cùng tên ở trường khác</>
            )}
          </div>
          <div className="flex w-[50rem] flex-col rounded border bg-gray-50 p-5">
            <div className="flex flex-row gap-5">
              <div className="h-28 w-28 border bg-white">N/A</div>
              {schoolResult
                ? schoolResult.map((prof, index) => (
                    <div className="flex flex-col" key={index}>
                      <div className="text-2xl font-bold">
                        {prof.lname + " " + prof.fname}
                      </div>
                      <div>{prof.level}</div>
                      <div>{prof.department}</div>
                      <div>{prof.school}</div>
                    </div>
                  ))
                : profResult &&
                  profResult.map((prof, index) => (
                    <div className="flex flex-col" key={index}>
                      <div className="text-2xl font-bold">
                        {prof.lname + " " + prof.fname}
                      </div>
                      <div>{prof.level}</div>
                      <div>{prof.department}</div>
                      <div>{prof.school}</div>
                    </div>
                  ))}
            </div>
          </div>
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
