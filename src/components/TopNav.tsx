import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import schoolData from "../utils/university.json";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";

type SchoolData = Record<string, string>;

const schoolDataTyped: SchoolData = schoolData;

function isMatch(school: string, schoolCode: string, query: string) {
  function removeAccents(str: string) {
    return str
      .normalize("NFD")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[\u0300-\u036f]/g, "");
  }

  return (
    removeAccents(school)
      .toLowerCase()
      .includes(removeAccents(query).toLowerCase()) ||
    removeAccents(schoolCode)
      .toLowerCase()
      .includes(removeAccents(query).toLowerCase())
  );
}

export default function TopNav() {
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const router = useRouter();
  const user = useUser();

  function handleClickSignIn() {
    const currentURL = window.location.href;
    void router.push(`/sign-in/${encodeURIComponent(currentURL)}`);
  }

  // Professor Input handlers
  const [profInputValue, setProfInputValue] = useState("");
  const [profSuggestions, setProfSuggestions] = useState<
    { element: JSX.Element; value: string; id: string }[]
  >([]);
  const profWrapperRef = useRef<HTMLDivElement>(null);

  const { data: results } = api.professor.getAll.useQuery(
    {
      name: profInputValue,
      school: selectedSchool ?? "",
    },
    {
      enabled: !!profInputValue && !!selectedSchool,
    },
  );

  const handleProfInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setProfInputValue(value);

    if (results) {
      setProfSuggestions(
        results.map((prof) => ({
          element: (
            <div key={prof.id} className="flex flex-col border-b">
              <div className="flex flex-row">
                <div>{prof.level}&nbsp;</div>
                <div className="font-bold">{prof.fname + " " + prof.lname}</div>
              </div>
              <div>{prof.school}</div>
            </div>
          ),
          value: prof.fname + " " + prof.lname,
          id: prof.id,
        })),
      );
    } else {
      setProfSuggestions([]);
    }
  };

  const handleProfFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void router.push(`/search/${profInputValue}/${selectedSchool}`);
    setProfInputValue("");
    setSchoolInputValue("");
  };

  useEffect(() => {
    function handleProfClickOutside(event: MouseEvent) {
      if (
        profWrapperRef.current &&
        !profWrapperRef.current.contains(event.target as Node)
      ) {
        setProfSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleProfClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleProfClickOutside);
    };
  }, [profWrapperRef]);

  // School Input handlers
  const [schoolInputValue, setSchoolInputValue] = useState("");
  const [schoolSuggestions, setSchoolSuggestions] = useState<string[]>([]);
  const schoolWrapperRef = useRef<HTMLDivElement>(null);

  const handleSchoolInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSchoolInputValue(value);

    const filteredSuggestions = Object.entries(schoolDataTyped)
      .filter(([school, schoolCode]) =>
        isMatch(school, schoolCode ?? "", value),
      )
      .map(([school, schoolCode]) => school);

    setSchoolSuggestions(filteredSuggestions);
  };

  const handleSchoolSuggestionClick = (suggestion: string) => {
    setSchoolInputValue(suggestion);
    setSchoolSuggestions([]);
    setSelectedSchool(suggestion);
  };

  useEffect(() => {
    function handleSchoolClickOutside(event: MouseEvent) {
      if (
        schoolWrapperRef.current &&
        !schoolWrapperRef.current.contains(event.target as Node)
      ) {
        setSchoolSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleSchoolClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleSchoolClickOutside);
    };
  }, [schoolWrapperRef]);

  return (
    <>
      <div className="flex h-auto w-screen items-center bg-black text-white">
        <div className="flex h-full w-full items-center justify-between p-5">
          <div className=" text-2xl md:text-4xl">
            <Link href="/">ClassWhisper</Link>
          </div>
          <div className="md:flex hidden flex-col gap-5 text-black md:flex-row">
            <div className="flex w-full justify-center" ref={profWrapperRef}>
              <form
                onSubmit={handleProfFormSubmit}
                className="relative h-12 w-64"
              >
                <input
                  className={`h-full w-full p-2 text-xl outline-none hover:bg-gray-100 ${
                    profSuggestions.length > 0 ? "rounded-t-2xl" : "rounded-2xl"
                  }`}
                  placeholder="Tìm Giảng Viên"
                  value={profInputValue}
                  onChange={handleProfInputChange}
                />
                <div className="absolute left-0 top-0 mt-12 max-h-64 w-full overflow-y-auto rounded-b-2xl bg-white">
                  {profSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                      onClick={() => {
                        setProfInputValue(suggestion.value);
                        setProfSuggestions([]);
                        void router.push(`/giangvien/${suggestion.id}`);
                      }}
                    >
                      {suggestion.element}
                    </div>
                  ))}
                </div>
              </form>
            </div>
            <div className="flex w-full justify-center" ref={schoolWrapperRef}>
              <div className="relative h-12 w-64">
                <input
                  className={`h-full w-full p-2 text-xl outline-none hover:bg-gray-100 ${
                    schoolSuggestions.length > 0
                      ? "rounded-t-2xl"
                      : "rounded-2xl"
                  }`}
                  placeholder="Tên Đại Học"
                  value={schoolInputValue}
                  onChange={handleSchoolInputChange}
                />
                <div className="absolute left-0 top-0 mt-12 max-h-64 w-full overflow-y-auto rounded-b-2xl bg-white">
                  {schoolSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                      onClick={() => handleSchoolSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            {user.isSignedIn ? (
              <SignOutButton>
                <button className="w-full text-left">Đăng Xuất</button>
              </SignOutButton>
            ) : (
              <button onClick={handleClickSignIn}>Đăng Nhập</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
