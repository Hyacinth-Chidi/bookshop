
'use client';

import { Menu } from 'lucide-react';

export default function AdminHeader({ onMenuClick }) {
    return (
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-neutral-900 text-white flex items-center px-4 z-30 border-b border-neutral-700">
            <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>
            <h1 className="ml-3 text-lg font-semibold">ESUT Bookshop</h1>
        </header>
    );
}
