// export default function Home() {
//   return (

//   );
// }


import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Next.js Demo</h1>
      <p className="mb-4">Backend: {process.env.NEXT_PUBLIC_BACKEND_TYPE || 'express'}</p>
      <Link href="/users" className="text-blue-500 underline">
        View Users
      </Link>
    </div>
  );
}