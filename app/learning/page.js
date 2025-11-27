import Link from 'next/link';

export const metadata = {
  title: 'Learning Chess',
  description: 'Comprehensive chess learning resources, strategies, tactics, and educational materials for players of all levels.',
  openGraph: {
    title: 'Learning Chess | Kanata Chess Club',
    description: 'Comprehensive chess learning resources, strategies, tactics, and educational materials for players of all levels.',
  },
};

export default function LearningPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-whisky-900 mb-4">
          Learning Chess
        </h1>
        <p className="text-xl text-whisky-700 max-w-2xl mx-auto">
          Comprehensive resources to improve your chess skills, from beginner to advanced strategies.
        </p>
      </div>

      <div className="space-y-8">
        {/* Opening Principles Section */}
        <div className="bg-gradient-to-br from-whisky-100 to-whisky-50 rounded-lg border-2 border-whisky-300 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">🚀</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-whisky-900">Opening Principles</h2>
          </div>
          <div className="space-y-4 text-whisky-800">
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">1. Control the Center</h3>
              <p className="text-base mb-2">
                The center squares (e4, e5, d4, d5) are the most important. Pieces placed in the center 
                have more mobility and can influence more squares. Control the center to control the game.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">2. Develop Your Pieces</h3>
              <p className="text-base mb-2">
                Get your knights and bishops into the game quickly. Don't move the same piece multiple times 
                in the opening unless necessary. Develop all your pieces before launching an attack.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">3. Castle Early</h3>
              <p className="text-base mb-2">
                Castling moves your king to safety and connects your rooks. Generally, you should castle 
                within the first 10 moves to protect your king and activate your rook.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">4. Don't Bring Out the Queen Too Early</h3>
              <p className="text-base mb-2">
                While the queen is powerful, bringing it out too early can make it a target. Develop your 
                minor pieces (knights and bishops) first, then bring out the queen when it's safe and useful.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">5. Connect Your Rooks</h3>
              <p className="text-base mb-2">
                After castling, your rooks should be able to see each other. This allows them to work together 
                and control important files (columns) on the board.
              </p>
            </div>
          </div>
        </div>

        {/* Tactics Section */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-amber-300 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">⚔️</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-whisky-900">Essential Tactics</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-whisky-900 mb-3">Fork</h3>
              <p className="text-sm text-whisky-700 mb-2">
                A single piece attacks two or more enemy pieces at once. Knights are excellent at forking!
              </p>
              <p className="text-xs text-whisky-600 italic">Example: Knight attacks both king and queen</p>
            </div>
            <div className="bg-white rounded-lg p-5 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-whisky-900 mb-3">Pin</h3>
              <p className="text-sm text-whisky-700 mb-2">
                A piece is pinned when it cannot move without exposing a more valuable piece behind it.
              </p>
              <p className="text-xs text-whisky-600 italic">Example: Bishop pins knight to king</p>
            </div>
            <div className="bg-white rounded-lg p-5 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-whisky-900 mb-3">Skewer</h3>
              <p className="text-sm text-whisky-700 mb-2">
                Similar to a pin, but the more valuable piece is in front and must move, exposing the piece behind.
              </p>
              <p className="text-xs text-whisky-600 italic">Example: Rook skewers queen and rook</p>
            </div>
            <div className="bg-white rounded-lg p-5 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-whisky-900 mb-3">Discovered Attack</h3>
              <p className="text-sm text-whisky-700 mb-2">
                Moving one piece reveals an attack by another piece behind it. Can be very powerful!
              </p>
              <p className="text-xs text-whisky-600 italic">Example: Moving bishop reveals rook's attack</p>
            </div>
            <div className="bg-white rounded-lg p-5 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-whisky-900 mb-3">Double Attack</h3>
              <p className="text-sm text-whisky-700 mb-2">
                Attacking two targets simultaneously. Your opponent can only defend one, so you win the other.
              </p>
              <p className="text-xs text-whisky-600 italic">Example: Queen attacks two pieces at once</p>
            </div>
            <div className="bg-white rounded-lg p-5 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-whisky-900 mb-3">Back Rank Mate</h3>
              <p className="text-sm text-whisky-700 mb-2">
                A checkmate pattern where the king is trapped on the back rank by its own pieces.
              </p>
              <p className="text-xs text-whisky-600 italic">Example: Rook or queen delivers mate on back rank</p>
            </div>
          </div>
        </div>

        {/* Strategy Section */}
        <div className="bg-gradient-to-br from-whisky-100 to-whisky-50 rounded-lg border-2 border-whisky-300 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">🧠</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-whisky-900">Strategic Concepts</h2>
          </div>
          <div className="space-y-4 text-whisky-800">
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">Pawn Structure</h3>
              <p className="text-base mb-2">
                The arrangement of pawns determines the character of the position. Weak pawns (isolated, doubled, 
                or backward) can become targets. Strong pawn structures provide support for your pieces and limit 
                your opponent's options.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">Piece Activity</h3>
              <p className="text-base mb-2">
                Active pieces are more valuable than passive ones. Place your pieces on squares where they have 
                maximum influence. Rooks belong on open files, bishops on long diagonals, and knights on strong 
                central outposts.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">King Safety</h3>
              <p className="text-base mb-2">
                Keep your king safe throughout the game. In the opening and middlegame, castle to safety. 
                In the endgame, activate your king to help with pawn promotion.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">Material vs. Position</h3>
              <p className="text-base mb-2">
                Sometimes it's worth sacrificing material for a better position, initiative, or attack. 
                Learn to evaluate when material is less important than activity, coordination, or a direct attack.
              </p>
            </div>
          </div>
        </div>

        {/* Endgame Basics Section */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-amber-300 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">🏁</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-whisky-900">Endgame Basics</h2>
          </div>
          <div className="space-y-4 text-whisky-800">
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">King and Pawn Endgames</h3>
              <p className="text-base mb-2">
                In endgames, the king becomes a powerful piece. Learn the "square rule" for pawn races and 
                the concept of "opposition" - controlling key squares to advance your pawns.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">Basic Checkmates</h3>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>King and Queen vs. King:</strong> Force the king to the edge, then deliver mate</li>
                <li><strong>King and Rook vs. King:</strong> Use the "boxing" method to restrict the king</li>
                <li><strong>Two Rooks vs. King:</strong> Use the "ladder" or "staircase" method</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">Activate Your King</h3>
              <p className="text-base mb-2">
                In the endgame, your king should be active. Bring it to the center to support your pawns 
                and attack your opponent's pawns. A centralized king is often worth a pawn or more.
              </p>
            </div>
          </div>
        </div>

        {/* Study Resources Section */}
        <div className="bg-gradient-to-br from-whisky-100 to-whisky-50 rounded-lg border-2 border-whisky-300 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">📖</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-whisky-900">Study Resources</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border-2 border-whisky-200">
              <h3 className="font-semibold text-whisky-900 mb-2">📚 Books</h3>
              <ul className="text-sm text-whisky-700 space-y-1 list-disc list-inside">
                <li>"Bobby Fischer Teaches Chess" - Great for beginners</li>
                <li>"How to Reassess Your Chess" - Strategic understanding</li>
                <li>"100 Endgames You Must Know" - Essential endgames</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-whisky-200">
              <h3 className="font-semibold text-whisky-900 mb-2">🌐 Online Resources</h3>
              <ul className="text-sm text-whisky-700 space-y-1 list-disc list-inside">
                <li>
                  <a 
                    href="https://www.chess.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber hover:text-amber-dark underline"
                  >
                    Chess.com
                  </a> - Puzzles and lessons
                </li>
                <li>
                  <a 
                    href="https://lichess.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber hover:text-amber-dark underline"
                  >
                    Lichess.org
                  </a> - Free puzzles and analysis
                </li>
                <li>
                  <a 
                    href="https://www.chessbase.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber hover:text-amber-dark underline"
                  >
                    ChessBase
                  </a> - Database and training
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-whisky-200">
              <h3 className="font-semibold text-whisky-900 mb-2">🎯 Practice</h3>
              <ul className="text-sm text-whisky-700 space-y-1 list-disc list-inside">
                <li>Solve tactical puzzles daily</li>
                <li>Review your games</li>
                <li>Play regularly with stronger players</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-whisky-200">
              <h3 className="font-semibold text-whisky-900 mb-2">👥 Join a Club</h3>
              <ul className="text-sm text-whisky-700 space-y-1 list-disc list-inside">
                <li>Play over-the-board games</li>
                <li>Learn from experienced players</li>
                <li>Participate in tournaments</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Improvement Tips Section */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-amber-300 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">📈</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-whisky-900">Improvement Tips</h2>
          </div>
          <div className="space-y-3 text-whisky-800">
            <div className="flex items-start space-x-3">
              <span className="text-2xl flex-shrink-0">1️⃣</span>
              <div>
                <h3 className="font-semibold text-whisky-900 mb-1">Study Tactics Daily</h3>
                <p className="text-sm">Solve 10-20 tactical puzzles every day. Pattern recognition is key to improvement.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl flex-shrink-0">2️⃣</span>
              <div>
                <h3 className="font-semibold text-whisky-900 mb-1">Analyze Your Games</h3>
                <p className="text-sm">After each game, review what went well and what you could improve. Use an engine to find mistakes.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl flex-shrink-0">3️⃣</span>
              <div>
                <h3 className="font-semibold text-whisky-900 mb-1">Learn from Masters</h3>
                <p className="text-sm">Study games by great players. Try to understand their plans and ideas.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl flex-shrink-0">4️⃣</span>
              <div>
                <h3 className="font-semibold text-whisky-900 mb-1">Play Longer Time Controls</h3>
                <p className="text-sm">While blitz is fun, longer games (15+ minutes) help you think deeply and improve your calculation.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl flex-shrink-0">5️⃣</span>
              <div>
                <h3 className="font-semibold text-whisky-900 mb-1">Be Patient</h3>
                <p className="text-sm">Improvement takes time. Focus on understanding concepts rather than memorizing moves.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Join Us Section */}
        <div className="bg-gradient-to-br from-whisky-100 to-whisky-50 rounded-lg border-2 border-whisky-300 p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-whisky-900 mb-4">
            Practice at Kanata Chess Club
          </h2>
          <p className="text-lg text-whisky-700 mb-6">
            Join us for biweekly gatherings where you can practice what you've learned, 
            play friendly games, and participate in tournaments. All skill levels welcome!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md transition-colors font-medium"
            >
              Learn About Our Gatherings
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-whisky-800 text-white rounded-md hover:bg-whisky-900 shadow-md transition-colors font-medium"
            >
              Join the Club
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

