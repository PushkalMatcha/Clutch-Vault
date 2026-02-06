import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleTournamentsClick } from "@/utils/auth";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const router = useRouter();

  return (
    <div>
      <h1>Dashboard</h1>
      <Button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleTournamentsClick(e, router, "/tournaments")}
        className="bg-neon-green text-black hover:bg-neon-green/80"
      >
        Join Tournaments
      </Button>
    </div>
  );
}