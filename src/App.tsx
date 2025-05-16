import { Button } from "./components/ui/button"


const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">Employee Management System</h1>
        <p className="text-gray-600 mt-2 text-center">Manage your employees efficiently and effectively</p>
      </header>
      <main className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Welcome!</h2>
        <ul className="space-y-3">
          <li className="flex items-center">
            <span className="material-icons text-blue-500 mr-2">person_add</span>
            Add New Employee
          </li>
          <li className="flex items-center">
            <span className="material-icons text-green-500 mr-2">list_alt</span>
            View Employee List
          </li>
          <li className="flex items-center">
            <span className="material-icons text-yellow-500 mr-2">edit</span>
            Update Employee Details
          </li>
          <li className="flex items-center">
            <span className="material-icons text-red-500 mr-2">delete</span>
            Remove Employee
          </li>
        </ul>
        <Button >
          Get Started
        </Button>
      </main>
      <footer className="mt-10 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} EMS. All rights reserved.
      </footer>
    </div>
  )
}

export default App