import { Copyright, Heart } from 'lucide-react';

const currentYear = new Date().getFullYear();
const copyrightYear = currentYear === 2025 ? '2025' : `2025 - ${currentYear}`;

const footerData = {
  about: {
    title: 'เกี่ยวกับเรา',
    content:
      '⚡ ขับเคลื่อนเว็บสุดล้ำด้วย WordPress + Next.js 🚀 เร็ว แรง โหลดไว และรองรับ Rank Math SEO!',
  },
  socialLinks: [
    {
      href: 'https://github.com/CoderBlitzTH',
      icon: (
        <svg
          className="h-6 w-6"
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>GitHub</title>
          <path
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            fill="currentColor"
          />
        </svg>
      ),
      label: 'CoderBlitz',
    },
    {
      href: 'https://github.com/CoderBlitzTH/nextjs-wordpress',
      icon: (
        <svg
          className="h-6 w-6"
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Next.js</title>
          <path
            d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z"
            fill="currentColor"
          />
        </svg>
      ),
      label: 'NextJS',
    },
    {
      href: 'https://github.com/CoderBlitzTH/barebones-headless',
      icon: (
        <svg
          className="h-6 w-6"
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>WordPress</title>
          <path
            d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0"
            fill="currentColor"
          />
        </svg>
      ),
      label: 'Barebones Headless',
    },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-50 to-gray-100 transition-colors duration-300 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* About Section */}
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {footerData.about.title}
          </h3>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {footerData.about.content}
          </p>
          {/* Social Icons */}
          <p className="flex items-center gap-6">
            {footerData.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                aria-label={link.label}
                className="text-gray-600 transition-colors duration-200 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                {link.icon}
              </a>
            ))}
          </p>
        </div>

        {/* Copyright and Links Section */}
        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
          <div className="flex flex-col items-center gap-4">
            <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Copyright size={16} />
              <span>{copyrightYear}</span>
              <span className="flex items-center gap-1">
                Made with
                <Heart size={16} className="animate-pulse text-red-500" />
                <a
                  href="https://coderblitz.com"
                  className="font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  CoderBlitz
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Subtle Background Effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute h-full w-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_50%)]"></div>
      </div>
    </footer>
  );
}
