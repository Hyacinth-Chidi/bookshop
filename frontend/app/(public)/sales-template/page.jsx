'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

// Book Size A Data - LW: 9.7 - 11 inches x 7.3 - 8 inches (4 ups: A4 size+)
const bookSizeA = [
    { pages: '40', amount: 1000 },
    { pages: '81-120', amount: 2500 },
    { pages: '121-160', amount: 3100 },
    { pages: '161-200', amount: 3800 },
    { pages: '201-240', amount: 4600 },
    { pages: '241-280', amount: 5300 },
    { pages: '281-320', amount: 6000 },
    { pages: '321-360', amount: 6700 },
    { pages: '361-400', amount: 7400 },
    { pages: '401-440+', amount: 8000 },
];

// Book Size B Data - LW: 8 - 9 inches x 5.8 - 6.5 inches (8 ups: below A4)
const bookSizeB = [
    { pages: '40', amount: 800 },
    { pages: '41-60', amount: 1000 },
    { pages: '61-80', amount: 1200 },
    { pages: '81-100', amount: 1500 },
    { pages: '101-120', amount: 1700 },
    { pages: '121-140', amount: 2000 },
    { pages: '141-160', amount: 2200 },
    { pages: '161-180', amount: 2400 },
    { pages: '181-200', amount: 2600 },
    { pages: '201-220', amount: 2200 },
    { pages: '221-240', amount: 3200 },
    { pages: '241-260', amount: 3400 },
    { pages: '261-280', amount: 3600 },
    { pages: '281-300', amount: 3800 },
    { pages: '301-320', amount: 4100 },
    { pages: '321-340', amount: 4300 },
    { pages: '341-360', amount: 4600 },
    { pages: '361-380', amount: 4800 },
    { pages: '381-400', amount: 5000 },
    { pages: '401-420', amount: 5200 },
    { pages: '421-440', amount: 5500 },
];

// Book Size C Data - LW: 7.5 - 8 inches x 5.5 - 5.7 inches (12 ups: below 8 ups)
const bookSizeC = [
    { pages: '40', amount: 500 },
    { pages: '41-60', amount: 600 },
    { pages: '61-80', amount: 700 },
    { pages: '81-100', amount: 800 },
    { pages: '101-120', amount: 900 },
    { pages: '121-140', amount: 1000 },
    { pages: '141-160', amount: 1200 },
    { pages: '161-180', amount: 1300 },
    { pages: '181-200', amount: 1400 },
    { pages: '201-220', amount: 1500 },
    { pages: '221-240', amount: 1600 },
    { pages: '241-260', amount: 1700 },
    { pages: '261-280', amount: 1800 },
    { pages: '281-300', amount: 2000 },
    { pages: '301-320', amount: 2100 },
    { pages: '321-340', amount: 2200 },
    { pages: '341-360', amount: 2300 },
    { pages: '361-380', amount: 2400 },
    { pages: '381-400', amount: 2500 },
    { pages: '401-420', amount: 2500 },
];

// Price table component
function PriceTable({ title, subtitle, data }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
            <div className="bg-gradient-to-br from-amber-900 to-amber-950 text-white p-3 sm:p-4">
                <h3 className="font-bold text-sm sm:text-base">{title}</h3>
                <p className="text-amber-200 text-xs sm:text-sm mt-0.5">{subtitle}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                    <thead>
                        <tr className="bg-neutral-100 border-b border-neutral-200">
                            <th className="text-left p-2 sm:p-3 font-semibold text-neutral-700">No of Pages</th>
                            <th className="text-right p-2 sm:p-3 font-semibold text-neutral-700">Amount (₦)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index} className={`border-b border-neutral-100 ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
                                <td className="p-2 sm:p-3 text-neutral-900">{row.pages}</td>
                                <td className="p-2 sm:p-3 text-right font-medium text-primary">{row.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function SalesTemplatePage() {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            <Navbar />

            <div className="flex-1 py-6 sm:py-8 lg:py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full mb-4 shadow-md p-2">
                            <Image
                                src="/esut logo.png"
                                alt="ESUT Logo"
                                width={64}
                                height={64}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-500 mb-1">
                            Enugu State University of Science and Technology
                        </p>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 mb-2">
                            Modified Book Sales Template
                        </h1>
                        <p className="text-sm sm:text-base text-primary font-medium">
                            2025/2026 Session
                        </p>
                    </div>

                    {/* Price Tables Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <PriceTable
                            title="BOOK SIZE A"
                            subtitle="LW: 9.7 - 11 inches x 7.3 - 8 inches (4 ups: A4 size+)"
                            data={bookSizeA}
                        />
                        <PriceTable
                            title="BOOK SIZE B"
                            subtitle="LW: 8 - 9 inches x 5.8 - 6.5 inches (8 ups: below A4)"
                            data={bookSizeB}
                        />
                        <PriceTable
                            title="BOOK SIZE C"
                            subtitle="LW: 7.5 - 8 inches x 5.5 - 5.7 inches (12 ups: below 8 ups)"
                            data={bookSizeC}
                        />
                    </div>

                    {/* Note */}
                    <div className="mt-6 sm:mt-8 bg-info/10 border border-info/20 rounded-lg p-4">
                        <p className="text-info text-xs sm:text-sm text-center">
                            📚 Prices are subject to change. Please confirm with the bookshop for current rates.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
