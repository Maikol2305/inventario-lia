import { redirect } from "next/navigation";

export default function Home() {
  // Redirección forzada al dashboard
  redirect("/dashboard");
}
