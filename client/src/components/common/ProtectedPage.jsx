import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedPage({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("userToken")?.value;

  if (!token) {
    redirect("/login");
  }

  return children;
}
