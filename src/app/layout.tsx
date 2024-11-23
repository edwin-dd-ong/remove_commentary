import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "SSBM Commentary Remover",
  description: "No commentators were harmed in the making of this site",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="flex flex-col min-h-screen bg-yellow-100">
        <TRPCReactProvider>{children}</TRPCReactProvider>

        <footer className="border-4 border-double border-black bg-zinc-50/50 rounded-lg mx-4 my-4 mt-auto">
            <div className="w-full max-w-screen-xl mx-auto p-4 md-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="https://flowbite.com/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">Made by Edwin O.</span>
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-black sm:mb-0">
                        <li>
                            <a href="https://www.edwin.ong" className="hover:underline me-4 md:me-6">Website</a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/in/edwin-dd-ong/" className="hover:underline me-4 md:me-6">LinkedIn</a>
                        </li>
                        <li>
                            <a href="https://x.com/TheBestEdwinO" className="hover:underline me-4 md:me-6">Twitter</a>
                        </li>
                        <li>
                            <a href="mailto:edwinong@alumni.stanford.edu" className="hover:underline">Contact</a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>


      </body>
    </html>
  );
}
