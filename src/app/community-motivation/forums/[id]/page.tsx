import Link from "next/link";
import { BASE_API_URL } from "../page";
import type { Post } from "../page";

type BlogPostProps = Promise<{
  id: string;
}>;
  
async function getPost(id: string): Promise<Post> {
	const data = await fetch(`${BASE_API_URL}/posts/${id}`);
	return data.json();
}

//This is a placeholder component to showcase dynamic routes in Next.js
//Will be exchanged for useful information later
export default async function BlogPost(props: { params: BlogPostProps }) {

	//As of Next.js 15 onwards dynamic routing params such as search params should be awaited
	const postParams = await props.params;
	const post = await getPost(postParams.id);
	const { id, title, body } = post;
	return (
		<main className="flex min-h-screen flex-col items-center p-10">
			<article className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden p-6">
				<Link
					href="/community-motivation/forums"
					className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6"
				>
					Back to all posts
				</Link>
				<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
					Post {id}: {title}
				</h1>
				<p className="text-gray-900">{body}</p>
			</article>
		</main>
	);
}