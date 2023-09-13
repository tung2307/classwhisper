import React, { useState } from "react";
import { api } from "~/utils/api";
import schoolData from "../../utils/university.json";
import departmentData from "../../utils/department.json";
import { useRouter } from "next/router";
type SchoolData = Record<string, string>;

type DepartmentData = string[];
const schoolDataTyped: SchoolData = schoolData;
const departmentDataTyped: DepartmentData = departmentData;

function isMatch(str: string, query: string) {
  function removeAccents(str: string) {
    return str
      .normalize("NFD")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[\u0300-\u036f]/g, "");
  }

  return removeAccents(str)
    .toLowerCase()
    .includes(removeAccents(query).toLowerCase());
}

function SchoolInput({
  onSchoolSelect,
  setIsSchoolValid, // add setIsSchoolValid as a prop
}: {
  onSchoolSelect: (schoolName: string) => void;
  setIsSchoolValid: (isValid: boolean) => void; // define the prop type
}) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    const filteredSuggestions = Object.keys(schoolDataTyped).filter(
      (school) =>
        isMatch(school, value) ?? isMatch(schoolDataTyped[school] ?? "", value),
    );

    setSuggestions(filteredSuggestions);

    // update isSchoolValid state based on whether the input matches a school in the data
    setIsSchoolValid(filteredSuggestions.includes(value));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    onSchoolSelect(suggestion);
  };

  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
    <div className="relative" ref={wrapperRef}>
      <input
        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
        value={inputValue}
        onChange={handleInputChange}
        required
      />

      {suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-b-lg border border-gray-300 bg-white">
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
      )}
    </div>
  );
}

function DepartmentInput({
  onDepartmentSelect,
  setIsDepartmentValid,
}: {
  onDepartmentSelect: (departmentName: string) => void;
  setIsDepartmentValid: (isValid: boolean) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    const filteredSuggestions = departmentDataTyped.filter((department) =>
      isMatch(department, value),
    );

    setSuggestions(filteredSuggestions);
    setIsDepartmentValid(filteredSuggestions.includes(value));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    onDepartmentSelect(suggestion);
  };

  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
    <div className="relative" ref={wrapperRef}>
      <input
        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
        value={inputValue}
        onChange={handleInputChange}
        required
      />

      {suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-b-lg border border-gray-300 bg-white">
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
      )}
    </div>
  );
}

export default function Professor() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    school: "",
    department: "",
    level: "",
  });
  const { mutate, isLoading } = api.professor.create.useMutation({
    onSuccess: (data) => {
      void router.push(`/giangvien/${data.id}`);
    },
  });
  const [isDepartmentValid, setIsDepartmentValid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function handleChangeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }
  const [isSchoolValid, setIsSchoolValid] = useState(false); // new state variable to track validity of school input

  function handleSchoolSelect(schoolName: string) {
    setFormData({
      ...formData,
      school: schoolName,
    });
    setIsSchoolValid(true); // set isSchoolValid to true when a school is selected from the suggestions
  }
  function handleDepartmentSelect(departmentName: string) {
    setFormData({
      ...formData,
      department: departmentName,
    });
    setIsDepartmentValid(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isSchoolValid || !isDepartmentValid) {
      alert("Please select a valid school and department from the suggestions");
      return;
    }

    mutate({ ...formData });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col gap-5 p-5 sm:p-0 md:flex-row md:gap-10">
        <div className="h-56  w-full flex-grow rounded-lg bg-white p-5 shadow-lg sm:h-40 sm:w-96">
          <h2 className="mb-6 text-center text-2xl font-bold">
            Trước khi tạo giảng viên mới
          </h2>
          <p>
            Vui lòng kiểm tra tên giảng viên chắc chắn rằng không có tên mà bạn
            đang tìm kiếm.
          </p>
        </div>
        <div className="animate__animated animate__fadeIn rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-2xl font-bold">
            Tạo Giảng Viên
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-gray-700">Họ</label>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-gray-700">Tên</label>
              <input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-gray-700">Cấp bậc</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChangeSelect}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none "
                required
              >
                <option value="">Chọn cấp bậc</option>
                <option value="Cử Nhân">Trợ Giảng</option>
                <option value="Thạc Sĩ">Thạc Sĩ</option>
                <option value="Tiến Sĩ">Tiến Sĩ</option>
                <option value="Giáo Sư">Giáo Sư</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-gray-700">Trường</label>
              {/* Integrated the SchoolInput component here */}
              <SchoolInput
                onSchoolSelect={handleSchoolSelect}
                setIsSchoolValid={setIsSchoolValid}
              />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-gray-700">Khoa</label>
              <DepartmentInput
                onDepartmentSelect={handleDepartmentSelect}
                setIsDepartmentValid={setIsDepartmentValid}
              />
            </div>

            <button
              type="submit"
              className={
                isLoading
                  ? "disabled w-full rounded-lg bg-blue-500 py-2 font-semibold text-white"
                  : "w-full rounded-lg bg-blue-500 py-2 font-semibold text-white"
              }
              disabled={isLoading}
            >
              {isLoading ? "Đang Tạo" :"Tạo"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
