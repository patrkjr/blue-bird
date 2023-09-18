import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthButtonClient from "../auth-button-client";
import GithubButton from "./github-button";

export const dynamic = 'force-dynamic';

export default async function Login() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return <div className=" flex-1 flex justify-center items-center">
    <div className=" justify-center items-center">
      <h1 className="text-2xl p-2 align-middle font-bold">Log in with github</h1>
      <div className="flex justify-center">
        <GithubButton />
      </div>
    </div>
  </div>
}
