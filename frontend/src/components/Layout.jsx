import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Smart Study Planner</h1>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link 
                    to="/" 
                    className={`hover:text-indigo-200 transition-colors ${
                      location.pathname === '/' ? 'text-white font-medium' : 'text-indigo-100'
                    }`}
                  >
                    Plan Setup
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/study-plan" 
                    className={`hover:text-indigo-200 transition-colors ${
                      location.pathname === '/study-plan' ? 'text-white font-medium' : 'text-indigo-100'
                    }`}
                  >
                    Study Plan
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Smart Study Planner
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-indigo-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-300 transition-colors">Help</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 