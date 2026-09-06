import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='mx-auto text-center'>
      <h2>Not Found :( </h2>
      <Link className='text-xl' href="/">Return to the Dashboard</Link>
    </div>
  )
}