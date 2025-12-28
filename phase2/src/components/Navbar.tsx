'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

interface NavbarProps {
    user: any | null
}

export default function Navbar({ user }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        ...(user ? [{ name: 'Dashboard', href: '/dashboard' }, { name: 'My Orders', href: '/orders' }] : []),
    ]

    return (
        <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/10 bg-[#0a0a0c]/80 backdrop-blur-md">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-bold whitespace-nowrap text-white">
                        Shop2<span className="text-indigo-500">games</span>
                    </span>
                </Link>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400 hidden sm:block">{user.email}</span>
                            <form action="/auth/signout" method="post">
                                <button type="submit" className="text-white bg-white/10 hover:bg-white/20 focus:ring-4 focus:outline-none focus:ring-gray-700 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors">
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login" className="text-white hover:text-indigo-400 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors">
                                Login
                            </Link>
                            <Link href="/register" className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-800 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors">
                                Get Started
                            </Link>
                        </div>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                        aria-controls="navbar-sticky"
                        aria-expanded={isOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-700 rounded-lg bg-gray-800 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`block py-2 px-3 rounded md:p-0 transition-colors ${pathname === item.href
                                            ? 'text-white bg-indigo-600 md:bg-transparent md:text-indigo-500'
                                            : 'text-gray-400 hover:bg-gray-700 md:hover:bg-transparent md:hover:text-white'
                                        }`}
                                    aria-current={pathname === item.href ? 'page' : undefined}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
