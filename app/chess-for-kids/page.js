import Link from 'next/link';

export const metadata = {
  title: 'Chess for Kids',
  description: 'Learn chess basics, rules, and strategies designed for kids. Fun and educational chess resources for young players.',
  openGraph: {
    title: 'Chess for Kids | Kanata Chess Club',
    description: 'Learn chess basics, rules, and strategies designed for kids. Fun and educational chess resources for young players.',
  },
};

export default function ChessForKidsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-whisky-900 mb-4">
          Chess for Kids
        </h1>
        <p className="text-xl text-whisky-700 max-w-2xl mx-auto">
          Learn chess in a fun and easy way! Perfect for young players just starting their chess journey.
        </p>
      </div>

      <div className="space-y-8">
        {/* Getting Started Section */}
        <div className="bg-gradient-to-br from-whisky-100 to-whisky-50 rounded-lg border-2 border-whisky-300 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-4xl">🎯</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-whisky-900">Getting Started</h2>
          </div>
          <div className="space-y-4 text-whisky-800">
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">What is Chess?</h3>
              <p className="text-base">
                Chess is a two-player strategy game played on a board with 64 squares. Each player starts with 16 pieces: 
                one king, one queen, two rooks, two bishops, two knights, and eight pawns. The goal is to checkmate your 
                opponent's king!
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-3">Why Play Chess?</h3>
              <p className="text-base mb-4">
                Chess is more than just a game - it's a powerful tool for developing important life skills! 
                Here's how chess helps kids grow and learn:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border-2 border-whisky-200">
                  <h4 className="font-semibold text-whisky-900 mb-2">🧠 Brain Development</h4>
                  <ul className="text-sm text-whisky-700 space-y-1 list-disc list-inside">
                    <li>Improves memory and recall</li>
                    <li>Enhances concentration and focus</li>
                    <li>Develops logical thinking</li>
                    <li>Strengthens pattern recognition</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-whisky-200">
                  <h4 className="font-semibold text-whisky-900 mb-2">🎯 Problem Solving</h4>
                  <ul className="text-sm text-whisky-700 space-y-1 list-disc list-inside">
                    <li>Teaches strategic planning</li>
                    <li>Develops critical thinking</li>
                    <li>Encourages creative solutions</li>
                    <li>Builds decision-making skills</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-whisky-200">
                  <h4 className="font-semibold text-whisky-900 mb-2">📚 Academic Benefits</h4>
                  <ul className="text-sm text-whisky-700 space-y-1 list-disc list-inside">
                    <li>Improves math skills</li>
                    <li>Enhances reading comprehension</li>
                    <li>Boosts spatial reasoning</li>
                    <li>Supports STEM learning</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-whisky-200">
                  <h4 className="font-semibold text-whisky-900 mb-2">💪 Life Skills</h4>
                  <ul className="text-sm text-whisky-700 space-y-1 list-disc list-inside">
                    <li>Builds patience and discipline</li>
                    <li>Teaches how to handle winning and losing</li>
                    <li>Develops sportsmanship</li>
                    <li>Increases self-confidence</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                <p className="text-sm text-whisky-800">
                  <strong>Research shows</strong> that children who play chess regularly often see improvements 
                  in their academic performance, especially in mathematics and reading. Chess teaches kids to think 
                  ahead, consider consequences, and make thoughtful decisions - skills that help both in school and in life!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chess Pieces Section */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-amber-300 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">♟️</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-whisky-900">Meet the Chess Pieces</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-whisky-900 mb-2">👑 King</h3>
              <p className="text-sm text-whisky-700 mb-2">The most important piece! Moves one square in any direction.</p>
              <p className="text-xs text-whisky-600">Goal: Protect your king, capture opponent's king!</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-whisky-900 mb-2">♕ Queen</h3>
              <p className="text-sm text-whisky-700 mb-2">The most powerful piece! Moves in any direction, any number of squares.</p>
              <p className="text-xs text-whisky-600">Like a rook and bishop combined!</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-whisky-900 mb-2">♜ Rook</h3>
              <p className="text-sm text-whisky-700 mb-2">Moves in straight lines: up, down, left, or right.</p>
              <p className="text-xs text-whisky-600">Starts in the corners of the board.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-whisky-900 mb-2">♝ Bishop</h3>
              <p className="text-sm text-whisky-700 mb-2">Moves diagonally, any number of squares.</p>
              <p className="text-xs text-whisky-600">One bishop stays on light squares, one on dark squares.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-whisky-900 mb-2">♞ Knight</h3>
              <p className="text-sm text-whisky-700 mb-2">Moves in an L-shape: 2 squares one way, 1 square the other.</p>
              <p className="text-xs text-whisky-600">The only piece that can jump over others!</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-whisky-900 mb-2">♟️ Pawn</h3>
              <p className="text-sm text-whisky-700 mb-2">Moves forward one square (two on first move).</p>
              <p className="text-xs text-whisky-600">Captures diagonally. Can become a queen if it reaches the end!</p>
            </div>
          </div>
        </div>

        {/* Basic Rules Section */}
        <div className="bg-gradient-to-br from-whisky-100 to-whisky-50 rounded-lg border-2 border-whisky-300 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">📚</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-whisky-900">Basic Rules</h2>
          </div>
          <div className="space-y-4 text-whisky-800">
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">1. Setting Up the Board</h3>
              <p className="text-base mb-2">
                Place the board so each player has a light square in the bottom-right corner. 
                Rooks go in corners, knights next to rooks, bishops next to knights, queen on her color, 
                and king on the remaining square. Pawns go in front of all other pieces.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">2. How to Win</h3>
              <p className="text-base mb-2">
                You win by <strong>checkmating</strong> your opponent's king. This means the king is in check 
                (under attack) and cannot escape. You can also win if your opponent resigns or runs out of time.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-2">3. Special Moves</h3>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Castling:</strong> Move your king and rook together for safety</li>
                <li><strong>En Passant:</strong> A special pawn capture move</li>
                <li><strong>Pawn Promotion:</strong> When a pawn reaches the end, it becomes any piece you choose!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tips for Kids Section */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-amber-300 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">💡</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-whisky-900">Tips for Young Players</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
              <h3 className="font-semibold text-whisky-900 mb-2">🎯 Start Simple</h3>
              <p className="text-sm text-whisky-700">Learn one piece at a time. Practice moving each piece until you're comfortable.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
              <h3 className="font-semibold text-whisky-900 mb-2">🛡️ Protect Your King</h3>
              <p className="text-sm text-whisky-700">Always keep your king safe. Castle early to move your king to safety.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
              <h3 className="font-semibold text-whisky-900 mb-2">♟️ Control the Center</h3>
              <p className="text-sm text-whisky-700">Pieces in the center of the board are more powerful and flexible.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
              <h3 className="font-semibold text-whisky-900 mb-2">👀 Look Before You Move</h3>
              <p className="text-sm text-whisky-700">Before moving, check if your piece will be safe. Think about your opponent's next move too!</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
              <h3 className="font-semibold text-whisky-900 mb-2">🎓 Learn from Mistakes</h3>
              <p className="text-sm text-whisky-700">Everyone makes mistakes! Review your games to learn and improve.</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
              <h3 className="font-semibold text-whisky-900 mb-2">😊 Have Fun!</h3>
              <p className="text-sm text-whisky-700">Chess is a game - enjoy playing, win or lose. Every game teaches you something new!</p>
            </div>
          </div>
        </div>

        {/* Useful Resources Section */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-2 border-amber-300 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">🌐</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-whisky-900">Useful Resources</h2>
          </div>
          <div className="space-y-4 text-whisky-800">
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-3">Online Chess for Kids</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                  <h4 className="font-semibold text-whisky-900 mb-2">🎮 Play Online</h4>
                  <ul className="text-sm text-whisky-700 space-y-2">
                    <li>
                      <a 
                        href="https://www.chess.com/kids" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-amber hover:text-amber-dark underline font-medium"
                      >
                        Chess.com Kids
                      </a> - Safe chess platform designed for kids
                    </li>
                    <li>
                      <a 
                        href="https://lichess.org/kids" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-amber hover:text-amber-dark underline font-medium"
                      >
                        Lichess Kids
                      </a> - Free chess with kid-friendly features
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                  <h4 className="font-semibold text-whisky-900 mb-2">📚 Learn & Practice</h4>
                  <ul className="text-sm text-whisky-700 space-y-2">
                    <li>
                      <a 
                        href="https://www.chesskid.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-amber hover:text-amber-dark underline font-medium"
                      >
                        ChessKid.com
                      </a> - Fun lessons and puzzles for kids
                    </li>
                    <li>
                      <a 
                        href="https://www.chess.com/learn" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-amber hover:text-amber-dark underline font-medium"
                      >
                        Chess.com Lessons
                      </a> - Interactive chess lessons
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-3">Videos & Tutorials</h3>
              <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                <ul className="text-sm text-whisky-700 space-y-2">
                  <li>
                    <a 
                      href="https://www.youtube.com/results?search_query=chess+for+kids+beginner" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber hover:text-amber-dark underline font-medium"
                    >
                      YouTube Chess Tutorials
                    </a> - Watch fun chess videos for beginners
                  </li>
                  <li>
                    <a 
                      href="https://www.chess.com/videos" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber hover:text-amber-dark underline font-medium"
                    >
                      Chess.com Videos
                    </a> - Learn from chess masters
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-whisky-900 mb-3">Practice Puzzles</h3>
              <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                <ul className="text-sm text-whisky-700 space-y-2">
                  <li>
                    <a 
                      href="https://www.chess.com/puzzles" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber hover:text-amber-dark underline font-medium"
                    >
                      Chess.com Puzzles
                    </a> - Daily puzzles to improve your skills
                  </li>
                  <li>
                    <a 
                      href="https://lichess.org/training" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-amber hover:text-amber-dark underline font-medium"
                    >
                      Lichess Training
                    </a> - Free tactical puzzles
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Join Us Section */}
        <div className="bg-gradient-to-br from-whisky-100 to-whisky-50 rounded-lg border-2 border-whisky-300 p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-whisky-900 mb-4">
            Ready to Play?
          </h2>
          <p className="text-lg text-whisky-700 mb-6">
            Join us at Kanata Chess Club! We welcome players of all ages and skill levels. 
            It's free to play, and chess sets are provided.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md transition-colors font-medium"
            >
              Learn More About Our Club
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

