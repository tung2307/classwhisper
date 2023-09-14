import { useState } from "react";
import FlagIcon from "@mui/icons-material/Flag";
import OutlinedFlagOutlinedIcon from "@mui/icons-material/OutlinedFlagOutlined";
import { useRouter } from "next/router";

type ReviewProps = { reviewId: string; isReport: boolean };

export default function Report({ reviewId, isReport }: ReviewProps) {
  const router = useRouter();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  function handleClick() {
    void router.push(`reviewReport/${reviewId}`);
  }
  function handleMouseEnter() {
    setIsTooltipVisible(true);
  }
  function handleMouseLeave() {
    setIsTooltipVisible(false);
  }
  return (
    <>
      <div>
        <div>
          {!isReport ? (
            <div
              className="cursor-pointer rounded border p-1"
              onClick={handleClick}
            >
              <OutlinedFlagOutlinedIcon />
            </div>
          ) : (
            <>
              <div className="group relative cursor-default rounded border p-1">
                <div
                  className="text-red-600"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <FlagIcon />
                </div>
                {isTooltipVisible && (
                  <div
                    id={`tooltip-${reviewId}`}
                    className="absolute w-80 rounded border bg-white p-2 text-red-600"
                    style={{ transform: "translate(-100%, -0%)" }}
                  >
                    Bài nhận xét này đã được báo cáo, đang chờ xem xét.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
