import { client } from "./lib/sanity";
import { Post } from "./lib/interface";
import Link from "next/link";
import { Source_Code_Pro } from "next/font/google";
import { FaRegCalendarCheck } from "react-icons/fa";
import ArticleFooter from "./components/ArticleFooter";
import Featured from "./components/Featured";
import Article from "./components/Article";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";

const sourceCodeProStyles = Source_Code_Pro({ subsets: ["latin"] });

async function getData() {
  const query = `*[_type == "post"]{
    _id,
    title,
    overview,
    slug,
    _createdAt,
    thumbnail {
      asset -> {
        url
      },
      alts
    },
    content
  }`;

  const data = await client.fetch(query);

  return data;
}

export const dynamic = "force-dynamic";

export default async function IndexPage() {
  const data = (await getData()) as Post[];

  // Find the article with title "Mastering Tailwind CSS Basics"
  const featuredArticle = data.find(
    (post) => post.title === "Mastering Tailwind CSS Basics"
  );

  // Filter out the featured article from the list
  const otherPosts = data
    .filter((post) => post.title !== "Mastering Tailwind CSS Basics")
    .sort(
      (a, b) =>
        new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
    );

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700 mb-10">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          All Posts
        </h1>
      </div>
      <div className="pt-4 flex">
        {featuredArticle && (
          <div>
            <Featured featuredArticle={featuredArticle} />
            <Newsletter />
            <Article otherPosts={otherPosts} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
