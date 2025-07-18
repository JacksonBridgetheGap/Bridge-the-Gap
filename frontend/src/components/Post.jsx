import "../styles/Post.css";

export default function Post({ post }) {
  return (
    <div className="w-[12em] min-w-[200px] max-h-[30vh] m-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-700/60">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        {post.title}
      </h3>
      <p>{post.author}</p>
      <img src={post.img} alt="Post Photo" />
    </div>
  );
}
