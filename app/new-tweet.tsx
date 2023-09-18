import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache"
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default function NewTweet({ user }: { user: User }){
  const addTweet = async (formData: FormData) => {
    'use server'

    const title = String(formData.get('title')); 
    const supabase = createServerActionClient<Database>({ cookies });
    await supabase.from('tweets').insert({ title, user_id: user.id})
    revalidatePath("/")
  }

  return (
    <form className="border border-gray-800 border-t-0" action={addTweet}>
      <div className="flex px-4 py-8 ">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-2"><Image src={user.user_metadata.avatar_url} alt="user avatar" width={48} height={48}/></div>
        <input name="title" className="ml-2 text-2xl bg-inherit flex-1 leading-loose placeholder-gray-500 px-2" placeholder="What is happening?!"/>
      </div>
    </form>
  )
}