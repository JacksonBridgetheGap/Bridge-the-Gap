import { Link } from "react-router";

export default function BackButton() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 text-black hover:text-blue-300 transition text-sm font-medium"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <p>Back</p>
    </Link>
  );
}
