import useUser from "../hooks/useUser.js";

export default function ProfileBanner() {
  const { user } = useUser();

  return (
    <div className="bg-gradient-to-r from-blue-200 via-gray-200 to-blue-300 dark:from-blue-800 dark:via-gray-700 dark:to-blue-900 py-10 px-6 md:px-12 rounded-xl shadow-lg mb-6 border border-blue-300 dark:border-blue-900">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">{`Hello ${user.username}!`}</h2>
    </div>
  );
}
