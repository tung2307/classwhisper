import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [showProfessorInput, setShowProfessorInput] = useState(true);

  function handleClick() {
    setShowProfessorInput((prevState) => !prevState);
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
        <div className="flex flex-col gap-5 transition-all duration-300 ease-in-out hover:scale-105">
          <div className="animate__animated animate__bounce text-5xl font-bold text-white">
            CLASS WHISPER
          </div>
          {showProfessorInput ? <ProfessorInput /> : <SchoolInput />}
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

function ProfessorInput() {
  return (
    <div className="relative h-14 w-96 transition duration-300 hover:scale-105">
      <Image
        src="/computer-icons-teacher-professor-education-lecturer-teacher-d1c3ff4a48ee0558d7b2bba418829c52.png"
        width={50}
        height={50}
        alt=""
        className="absolute left-1 top-2"
      />
      <input
        className="h-full w-full rounded-2xl p-2 pl-14 outline-none transition duration-300 hover:bg-gray-100 text-xl"
        placeholder="Tên Giảng Viên"
      />
    </div>
  );
}

function SchoolInput() {
  return (
    <div className="relative h-14 w-96 transition duration-300 hover:scale-105">
      <Image
        src="/pngfind.com-education-icon-png-55817.png"
        width={40}
        height={50}
        alt=""
        className="absolute left-3 top-4"
      />
      <input
        className="h-full w-full rounded-2xl p-2 pl-14 outline-none transition duration-300 hover:bg-gray-100 text-xl"
        placeholder="Tên Đại Học"
      />
    </div>
  );
}
