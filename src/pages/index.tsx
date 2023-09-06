import { ChangeEvent, useState } from "react";
import Image from "next/image";
import schoolData from "../utils/university.json";

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
  const [showProfessorInput, setShowProfessorInput] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [isSchoolSelected, setIsSchoolSelected] = useState(false);

  function handleClick() {
    setShowProfessorInput((prevState) => !prevState);
  }

  function handleSchoolSelect(schoolName: string) {
    setSelectedSchool(schoolName);
    setShowProfessorInput(true);
    setIsSchoolSelected(true);
  }

  return (
    <>
      <div
        className="flex h-screen w-screen flex-col items-center justify-center gap-5 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/—Pngtree—geometric rounded square shape background_1178834.jpg')",
        }}
      >
        <div
          className={`flex flex-col gap-5 ${
            isSchoolSelected
              ? ""
              : "transition-all duration-300 ease-in-out hover:scale-105"
          }`}
        >
          <div
            className={`w-full text-center text-5xl font-bold text-white ${
              isSchoolSelected ? "moveToTop" : ""
            }`}
          >
            CLASS WHISPER
          </div>
          {selectedSchool && (
            <div className="flex w-full flex-row justify-center text-2xl text-white">
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
            className="cursor-pointer select-none border-b text-xl text-white"
          >
            Tìm Trường Đại Học
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="cursor-pointer select-none border-b text-xl text-white"
          >
            Tìm Giảng Viên
          </div>
        )}
      </div>
    </>
  );
}

function ProfessorInput({ schoolName }: { schoolName: string | null }) {
  return (
    <div className="flex w-full justify-center">
      <div className="relative h-14 w-[30rem] transition duration-300 hover:scale-105">
        <Image
          src="/computer-icons-teacher-professor-education-lecturer-teacher-d1c3ff4a48ee0558d7b2bba418829c52.png"
          width={50}
          height={50}
          alt=""
          className="absolute left-1 top-2"
        />
        <input
          className="h-full w-full rounded-2xl p-2 pl-14 text-xl outline-none transition duration-300 hover:bg-gray-100"
          placeholder="Tìm Giảng Viên"
        />
      </div>
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

    // Filtering the suggestions based on the input value
    const filteredSuggestions = Object.keys(schoolData).filter((school) =>
      isMatch(school, value),
    );

    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    onSchoolSelect(suggestion);
  };

  return (
    <div className="flex w-full justify-center">
      <div className="relative h-14 w-[30rem] transition duration-300 hover:scale-105">
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
