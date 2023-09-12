import Link from "next/link";

function Footer() {
  return (
    <div className="bg-black py-4 text-white">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-8">
          <Link href="/chinh-sach-bao-mat" className="hover:underline">
            Chính Sách Bảo Mật
          </Link>
          <Link href="/dieu-khoan-dich-vu" className="hover:underline">
            Điều Khoản Dịch Vụ
          </Link>
        </div>
        <div className="mt-2">© {new Date().getFullYear()} Skillspoke</div>
      </div>
    </div>
  );
}

export default Footer;
