import Link from "next/link";

export default function Home() {

  return (
    <div>
      <Link href="/login" className="ml-5 text-blue-600 underline">login</Link>
      <Link href="/signup" className="ml-5 text-blue-600 underline">signup</Link>
      <Link href="/dashboard" className="ml-5 text-blue-600 underline">dashboard</Link>
      <Link href="/tasks" className="ml-5 text-blue-600 underline">task</Link>
      <h1>Productivity App</h1>
    </div>
  );
}
