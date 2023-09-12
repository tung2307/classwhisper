import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function profile() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const { data, isLoading } = api.professor.getProfessor.useQuery({ id: id });
  return (
    <>
      <div className="w-screen p-10">
        <Link href={`/add/review/${id}`}>review here</Link>
      </div>
    </>
  );
}
