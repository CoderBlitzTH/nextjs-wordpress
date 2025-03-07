export default async function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">
              About
            </h3>
            <p className="text-sm">
              A personal blog sharing insights and experiences in web
              development and technology.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Articles
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">
              Newsletter
            </h3>
            <p className="mb-4 text-sm">
              Subscribe to get the latest updates directly in your inbox.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-l-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button className="rounded-r-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2025 My Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
