'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Likes from "./likes";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {

  const supabase = createClientComponentClient()

  const router = useRouter();

  useEffect(() => {
    const channel = supabase.channel('realtime tweets').on
    ('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'tweets'
    }, (payload) => {
      router.refresh()
    }).subscribe()

    return () => {
      supabase.removeChannel(channel);
    }
  },[supabase, router])

  const [optimisticTweets, addOptimisticTweet] = useOptimistic<TweetWithAuthor[], TweetWithAuthor>(
    tweets,
    (currentOptimisticTweets, newTweet) => {
      const newOptimisticTweets = [...currentOptimisticTweets]
      const index = newOptimisticTweets.findIndex(tweet => tweet.id === newTweet.id)
      newOptimisticTweets[index] = newTweet;
      return newOptimisticTweets;
    }
  )

  return optimisticTweets.map((tweet) => (
    <div key={tweet.id} className="border border-gray-800 borde-t-0 px-4 py-4 flex">
      <div className="rounded-full overflow-hidden w-12 h-12">
        <Image src={tweet.author.avatar_url} alt="user avatar" width={48} height={48}/>
      </div>
      <div className="ml-4 items-center">
        <p>
          <span className="font-bold">{tweet.author.name}</span> 
          <span className="text-sm ml-2 text-gray-400">{tweet.author.username}</span>
        </p>
        <p>
          {tweet.title}
        </p>
        <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet}/>
      </div>
    </div>
  ))
}