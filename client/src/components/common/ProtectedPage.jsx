import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function ProtectedPage({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get("userToken")?.value;

  if (!token) {
    redirect("/login");
  }

  return children;
}
