import { ChangeEvent, useState, useRef, useEffect } from "react";

import Image from "next/image";
import schoolData from "../utils/university.json";
import { useRouter } from "next/router";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
interface SchoolData {
  [key: string]: string;
}
const schoolDataTyped: SchoolData = schoolData;
function isMatch(school: string, query: string) {
  function removeAccents(str: string) {
    return str
      .normalize("NFD")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[\u0300-\u036f]/g, "");
  }

  return removeAccents(school)
    .toLowerCase()
    .includes(removeAccents(query).toLowerCase());
}

export default function Home() {
  const [showProfessorInput, setShowProfessorInput] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [isSchoolSelected, setIsSchoolSelected] = useState(false);
  const router = useRouter();
  const user = useUser();
  function handleClick() {
    setShowProfessorInput((prevState) => !prevState);
  }

  function handleSchoolSelect(schoolName: string) {
    setSelectedSchool(schoolName);
    setShowProfessorInput(true);
    setIsSchoolSelected(true);
  }
  function handleClickSignIn() {
    const currentURL = window.location.href;
    void router.push(`/sign-in/${encodeURIComponent(currentURL)}`);
  }
  return (
    <>
      <div
        className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-cover bg-center md:gap-5"
        style={{
          backgroundImage:
            "url('/—Pngtree—geometric rounded square shape background_1178834.jpg')",
        }}
      >
        <div className="absolute top-0 m-5 text-white">
          <div className="flex flex-row gap-2">
            {user.isSignedIn ? (
              <SignOutButton>
                <button className="w-full text-left">Đăng Xuất</button>
              </SignOutButton>
            ) : (
              <span onClick={handleClickSignIn} className="cursor-pointer">
                Đăng Nhập
              </span>
            )}
          </div>
        </div>
        <div
          className={`flex flex-col gap-2 md:gap-5 ${
            isSchoolSelected
              ? ""
              : "transition-all duration-300 ease-in-out hover:scale-105"
          }`}
        >
          <div
            className={`w-full text-center text-3xl font-bold text-white md:text-5xl ${
              isSchoolSelected ? "moveToTop" : ""
            }`}
          >
            CLASS WHISPER
          </div>
          {selectedSchool && (
            <div className="flex w-full flex-row justify-center text-lg text-white md:text-2xl">
              <div>Tìm giảng viên ở&nbsp;</div>{" "}
              <div className="border-b font-bold">{selectedSchool}</div>
            </div>
          )}
          {showProfessorInput ? (
            <ProfessorInput schoolName={selectedSchool} />
          ) : (
            <SchoolInput onSchoolSelect={handleSchoolSelect} />
          )}
        </div>

        {showProfessorInput ? (
          <div
            onClick={handleClick}
            className="cursor-pointer select-none border-b text-base text-white md:text-xl"
          >
            Tìm Trường Đại Học
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="cursor-pointer select-none border-b text-base text-white md:text-xl"
          >
            Tìm Giảng Viên
          </div>
        )}
      </div>
      <div className="h-screen w-screen"></div>
    </>
  );
}

function ProfessorInput({ schoolName }: { schoolName: string | null }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(
    null,
  );
  const router = useRouter();

  const { data: results } = api.professor.getAll.useQuery(
    {
      name: inputValue,
      school: schoolName ?? "",
    },
    { enabled: !!inputValue },
  );

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.length > 0) {
      try {
        if (results) {
          setSuggestions(results.map((prof) => prof.fname + " " + prof.lname));
        }
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedProfessor) {
      // Navigate to the search results page here
      void router.push(`/search/${inputValue.toString()}/${schoolName}`);
    }
  };

  return (
    <div className="flex w-full justify-center" ref={wrapperRef}>
      <form
        onSubmit={handleFormSubmit}
        className="relative h-14 w-64 transition duration-300 hover:scale-105 md:w-[30rem]"
      >
        <Image
          src="/computer-icons-teacher-professor-education-lecturer-teacher-d1c3ff4a48ee0558d7b2bba418829c52.png"
          width={50}
          height={50}
          alt=""
          className="absolute left-1 top-2"
        />
        <input
          className={`h-full w-full p-2 pl-14 text-xl outline-none transition duration-300 hover:bg-gray-100 ${
            suggestions.length > 0 ? "rounded-t-2xl" : "rounded-2xl"
          }`}
          placeholder="Tìm Giảng Viên"
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className="absolute left-0 top-0 mt-14 max-h-64 w-full overflow-y-auto rounded-b-2xl bg-white">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="cursor-pointer p-2 hover:bg-gray-200"
              onClick={() => {
                setInputValue(suggestion);
                setSelectedProfessor(suggestion);
                setSuggestions([]);
                // Navigate to the profile page here
                console.log("Navigating to profile page");
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}

function SchoolInput({
  onSchoolSelect,
}: {
  onSchoolSelect: (schoolName: string) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    const filteredSuggestions = Object.keys(schoolDataTyped).filter(
      (school) =>
        isMatch(school, value) || isMatch(schoolDataTyped[school] || "", value),
    );

    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    onSchoolSelect(suggestion);
  };
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="flex w-full justify-center" ref={wrapperRef}>
      <div className="relative h-14 w-64 transition duration-300 hover:scale-105 md:w-[30rem]">
        <Image
          src="/pngfind.com-education-icon-png-55817.png"
          width={40}
          height={50}
          alt=""
          className="absolute left-3 top-4"
        />
        <input
          className={`h-full w-full p-2 pl-14 text-xl outline-none transition duration-300 hover:bg-gray-100 ${
            suggestions.length > 0 ? "rounded-t-2xl" : "rounded-2xl"
          }`}
          placeholder="Tên Đại Học"
          value={inputValue}
          onChange={handleInputChange}
        />

        <div className="absolute left-0 top-0 mt-14 max-h-64 w-full overflow-y-auto rounded-b-2xl bg-white">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="cursor-pointer p-2 hover:bg-gray-200"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
