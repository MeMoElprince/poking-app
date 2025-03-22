import { Link } from 'react-router-dom'
export default function FirstPage() {
  return (
    <div className="w-full h-screen bg-background1 flex justify-center items-center">
      <div>
        <h1 className="text-4xl text-center text-white">Welcome to our Project</h1>
        <div className="flex justify-center mt-8">
          <Link to="/PokingApp" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">Poking App</Link>
          <Link to="/Calculator" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">Calculator</Link>
        </div>
      </div>
    </div>
  )
}
