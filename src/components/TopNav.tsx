import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import schoolData from "../utils/university.json";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import SignedIn from "./SignedIn";
import SearchIcon from "@mui/icons-material/Search";
type ProfSuggestion = {
  value: string;
  id: string;
  element: JSX.Element;
};
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
  const [profSuggestions, setProfSuggestions] = useState<ProfSuggestion[]>([]);

  const profWrapperRef = useRef<HTMLDivElement>(null);

  const { data: results } = api.professor.getAll.useQuery(
    {
      name: profInputValue,
      school: selectedSchool ?? "",
    },
    {
      enabled: !!profInputValue,
    },
  );

  useEffect(() => {
    if (results && profInputValue) {
      const suggestions = results.map((prof) => ({
        value:
          prof.fname +
          " " +
          prof.lname +
          `\r\n` +
          prof.department +
          ", " +
          prof.school,
        id: prof.id,
        element: (
          <>
            {prof.lname} {prof.fname}
            <br />
            {prof.department}, {prof.school}
          </>
        ),
      }));
      setProfSuggestions(suggestions);
    } else {
      setProfSuggestions([]);
    }
  }, [results, profInputValue]);

  const handleProfInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setProfInputValue(value);
  };

  const handleProfFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (profInputValue == "") {
      alert("Vui lòng nhập tên giảng viên");
      return;
    }
    void router.push(`/search/${profInputValue}/${selectedSchool}`).then(() => {
      window.location.reload();
    });
    setProfInputValue("");
    setSchoolInputValue("");
    setSelectedSchool(null);
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

  function handleClick() {
    console.log("Click");
  }
  return (
    <>
      <div className="flex h-auto w-screen items-center bg-black text-white">
        <div className="flex h-full w-full items-center justify-between p-5">
          <div className=" text-2xl md:text-4xl">
            <Link href="/">ClassWhisper</Link>
          </div>
          <div className="hidden flex-col gap-5 text-black md:flex md:flex-row">
            <div className="flex w-full justify-center" ref={profWrapperRef}>
              <form
                onSubmit={handleProfFormSubmit}
                className="relative h-12 md:w-auto lg:w-64"
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
                      className="cursor-pointer border-b p-2 hover:bg-gray-200"
                      onClick={() => {
                        setProfInputValue("");
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
              <div className="relative h-12 md:w-auto lg:w-64">
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
            <div
              className="flex cursor-pointer items-center  text-white "
              onClick={handleProfFormSubmit}
            >
              <div className="px-2 py-1 border rounded ">
                <SearchIcon />
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center gap-2">
            <div className="flex md:hidden" onClick={handleClick}>
              <SearchIcon />
            </div>
            {user.isSignedIn ? (
              <SignedIn />
            ) : (
              <button onClick={handleClickSignIn}>Đăng Nhập</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
