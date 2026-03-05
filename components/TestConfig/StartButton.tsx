import Link from "next/link"

const StartButton = () => {
  return (
    <div>
        <Link href="/practice"> 
          <button className="px-4 py-2 m-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">Start Practice</button>
        </Link>
    </div>
  )
}

export default StartButton