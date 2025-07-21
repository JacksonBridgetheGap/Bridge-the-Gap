export default function PostView({
  isOpen,
  post,
  onClose,
  prevPost,
  nextPost,
}) {
  return (
    <div>
      {isOpen && post && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50 backdrop-blur-xs">
          <button
            onClick={prevPost}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/80 hover:bg-white shadow-md transition"
          >
            {"<"}
          </button>
          <button
            onClick={nextPost}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/80 hover:bg-white shadow-md transition"
          >
            {">"}
          </button>
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative mx-4 transition-all">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-2 font-bold text-gray-500 hover:text-black transition"
            >
              x
            </button>
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold mb-4">{post.title}</h2>
              <h3 className="text-sm text-blue-600">{post.author}</h3>
              <div className="mx-auto w-100 h-100 bg-gray-100 rounded-xl flex items-center justify-center">
                <img src={post.img} alt="Post Photo" />
              </div>
              <p className="text-gray-700 m-2">{post.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
