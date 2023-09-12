import { useEffect, useState } from "react";
import { api } from "~/utils/api";

function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { mutate } = api.cookie.create.useMutation({});

  useEffect(() => {
    function checkConsent() {
      const consentCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("consent="));
      if (!consentCookie) {
        setShowBanner(true);
      }
    }

    checkConsent();
  }, []);

  const handleAccept = () => {
    setShowBanner(false);
    document.cookie = "consent=true; max-age=604800"; // Cookie expires in 7 days
    mutate({ cookieId: document.cookie });
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
      <div className="flex w-[30rem] flex-col items-start rounded-lg bg-white p-6 shadow-lg">
        <div className="text-xl font-bold">
          Điều khoản trước khi sử dụng ClassWhisper
        </div>
        <div className="mb-4">
          Trang web này sử dụng cookies để đảm bảo bạn nhận được trải nghiệm tốt
          nhất trên trang web của chúng tôi. Bằng cách nhấp vào &quot;Đồng
          ý&quot;, bạn đồng ý với
          <a
            href="/dieu-khoan-dich-vu"
            className="ml-1 text-blue-500 underline hover:text-blue-700"
          >
            Điều khoản dịch vụ
          </a>{" "}
          và
          <a
            href="/chinh-sach-bao-mat"
            className="ml-1 text-blue-500 underline hover:text-blue-700"
          >
            Chính sách bảo mật
          </a>
          của chúng tôi.
        </div>
        <button
          className="w-32 self-end rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={handleAccept}
        >
          Đồng ý
        </button>
      </div>
    </div>
  );
}

export default CookieConsent;
