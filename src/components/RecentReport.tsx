import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

export default function RecentReport() {
  const user = useUser();
  const { data } = api.report.getAllReport.useQuery({
    userId: user.user?.id ?? "",
  });
  return <></>;
}