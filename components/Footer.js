import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-whisky-900 text-whisky-100 py-8 border-t border-amber-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-serif font-bold text-amber-light mb-2">Kanata Chess Club</h3>
                        <p className="text-sm text-whisky-300">
                            A community of strategy, skill, and friendship.
                        </p>
                    </div>

                    <div className="text-center md:text-right">
                        <h4 className="text-lg font-serif font-semibold text-amber-light mb-2">Contact</h4>
                        <div className="flex flex-col space-y-1 text-sm text-whisky-200">
                            <p>Andrii Vasylenko</p>
                            <a
                                href="mailto:andrey.vasilenko.ua@gmail.com"
                                className="hover:text-amber text-whisky-300 transition-colors"
                            >
                                andrey.vasilenko.ua@gmail.com
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-whisky-800 text-center text-xs text-whisky-500">
                    <p>&copy; {currentYear} Kanata Chess Club. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
