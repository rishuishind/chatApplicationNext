import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ReactNode } from "react"

interface LayoutProps{
    children:ReactNode
}
const Layout = async ({children}:LayoutProps) => {
    const session = getServerSession(authOptions);
    if(!session) notFound();
  return (
    <div className="w-full flex h-screen">
        <div className="flex h-full w-full max-w-xs flex-col gap-y-5 overflow-y-auto border-r border-x-gray-200 bg-white px-6">
            <Link href='/dashboard' className="flex h-16 shrink-0 items-center"></Link>
        </div>
        {children}
        </div>
  )
}

export default Layout