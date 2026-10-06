import { useState } from 'react';

const ShieldTrain = () => {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showVideoLesson, setShowVideoLesson] = useState(false);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const quizQuestions = [
    {
      question: "You receive a Telegram voice note from 'Zerodha Support' asking you to speak your OTP aloud for demat re-verification. What should you do?",
      options: [
        "Speak the OTP clearly into the mic",
        "Block the user & report synthetic voice clone to Investor Kavach",
        "Send a screenshot of your demat account balance instead",
        "Ask them for their employee ID before giving the OTP"
      ],
      correct: 1,
      explanation: "SEBI and registered brokers NEVER ask for OTPs via voice calls or Telegram. This spectral pattern matches AI voice cloning."
    },
    {
      question: "A WhatsApp message advertises 'Pre-IPO Shares of Tata Tech with 400% Guaranteed Returns'. The link leads to 'tata-ipo-guaranteed.net'. What red flag is most critical?",
      options: [
        "The domain was registered recently and promises 'guaranteed returns'",
        "WhatsApp messages cannot contain links",
        "Tata Tech is already publicly listed",
        "Pre-IPO shares can only be bought via crypto"
      ],
      correct: 0,
      explanation: "Guaranteed high returns and unofficial domains are classic signs of pump-and-dump or advance-fee investment fraud."
    }
  ];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === quizQuestions[quizQuestionIndex].correct) {
      setQuizScore(quizScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizQuestionIndex + 1 < quizQuestions.length) {
      setQuizQuestionIndex(quizQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizCompleted(false);
    setShowQuizModal(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="mb-2">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0b1c30] dark:text-white tracking-tight">ShieldTrain</h1>
        <p className="text-lg text-[#45464d] dark:text-slate-400 mt-2">Investor Immunity &amp; Gamified Education Module</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Immunity Score & Leaderboard (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Immunity Score Card */}
          <div className="glass-panel bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm flex flex-col items-center text-center border border-[#c6c6cd]/50 dark:border-slate-800">
            <div className="relative w-48 h-48 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-[#dce9ff] dark:text-slate-800 stroke-current" cx="50" cy="50" fill="transparent" r="40" strokeWidth="8" />
                <circle
                  className="text-[#006c49] dark:text-emerald-500 stroke-current progress-ring__circle"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  strokeDasharray="251.2"
                  strokeDashoffset="50.24"
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-[#0b1c30] dark:text-white">80%</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-[#0b1c30] dark:text-white mb-2">Immunity Score</h2>
            <p className="text-xs text-[#45464d] dark:text-slate-400 mb-6">You have successfully identified 4 out of 5 simulated phishing attacks this month.</p>
            <button
              onClick={() => { resetQuiz(); setShowQuizModal(true); }}
              className="w-full bg-[#000000] dark:bg-sky-600 text-white py-3 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm"
            >
              Start Practice Quiz
            </button>
          </div>

          {/* Department Leaderboard Card */}
          <div className="glass-panel bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-[#c6c6cd]/50 dark:border-slate-800">
            <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb95f]">social_leaderboard</span>
              Department Leaderboard
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 bg-[#eff4ff] dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs w-4 text-[#0b1c30] dark:text-white">1</span>
                  <div className="w-8 h-8 rounded-full bg-[#bec6e0] dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-[#0b1c30] dark:text-white">AR</div>
                  <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">Amit Raj</span>
                </div>
                <span className="text-[#006c49] dark:text-emerald-400 font-bold text-xs">950 pts</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-[#dce9ff] dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs w-4 text-[#76777d]">2</span>
                  <div className="w-8 h-8 rounded-full bg-[#bec6e0] dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-[#0b1c30] dark:text-white">SK</div>
                  <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">Sneha Kapoor</span>
                </div>
                <span className="text-[#006c49] dark:text-emerald-400 font-bold text-xs">820 pts</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-[#dce9ff] dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs w-4 text-[#76777d]">3</span>
                  <div className="w-8 h-8 rounded-full bg-[#bec6e0] dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-[#0b1c30] dark:text-white">RJ</div>
                  <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">Rahul Jain</span>
                </div>
                <span className="text-[#006c49] dark:text-emerald-400 font-bold text-xs">780 pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Campaigns, Micro-learning, Badges (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Recent Simulated Campaigns */}
          <div className="glass-panel bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-[#c6c6cd]/50 dark:border-slate-800">
            <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#76777d]">campaign</span>
              Recent Simulated Campaigns
            </h3>
            <div className="flex flex-col gap-4">
              {/* Passed Scenario */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border border-[#c6c6cd]/40 dark:border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-[#6cf8bb]/20 text-[#006c49] flex items-center justify-center mt-0.5">
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0b1c30] dark:text-white">Deepfake Voice Call</h4>
                    <p className="text-xs text-[#76777d]">July 10, 2026</p>
                  </div>
                </div>
                <span className="bg-[#6cf8bb]/20 border border-[#006c49]/30 text-[#006c49] dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                  Passed (Didn't share OTP)
                </span>
              </div>

              {/* Failed Scenario */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border border-[#c6c6cd]/40 dark:border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mt-0.5">
                    <span className="material-symbols-outlined text-xl">warning</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0b1c30] dark:text-white">Fake SMS Alert</h4>
                    <p className="text-xs text-[#76777d]">June 28, 2026</p>
                  </div>
                </div>
                <span className="bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#ba1a1a] px-3 py-1 rounded-full text-xs font-bold">
                  Failed (Clicked Link)
                </span>
              </div>
            </div>
          </div>

          {/* Micro-learning Moment (Highlighted Amber Card) */}
          <div className="rounded-xl p-6 shadow-sm border-t-2 border-[#ffb95f] bg-gradient-to-br from-[#FFFCF5] to-[#F8FAFC] dark:from-slate-900 dark:to-slate-800 border border-[#c6c6cd]/30">
            <div className="flex justify-between items-start">
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-[#b87500] dark:text-amber-400 mb-2">Micro-learning Moment</h3>
                <p className="text-xs text-[#45464d] dark:text-slate-300 mb-4">Because you clicked the simulated SMS link last week, we prepared a 30-second video on how to spot fake domains.</p>
                <button
                  onClick={() => setShowVideoLesson(true)}
                  className="flex items-center gap-2 bg-[#ffb95f] text-[#2a1700] py-2 px-4 rounded-lg text-xs font-bold hover:bg-amber-400 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">play_circle</span>
                  Watch 30s Lesson
                </button>
              </div>
              <div className="hidden sm:block opacity-20">
                <span className="material-symbols-outlined text-[80px] text-[#b87500]">workspace_premium</span>
              </div>
            </div>
          </div>

          {/* Earn Your Certifications */}
          <div className="glass-panel bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-[#c6c6cd]/50 dark:border-slate-800">
            <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c49]">military_tech</span>
              Earn Your Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-slate-900 rounded-lg border border-[#c6c6cd]/30 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-[#dce9ff] dark:bg-slate-800 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-3xl text-[#0b1c30] dark:text-white">gpp_good</span>
                </div>
                <h4 className="text-xs font-bold text-[#0b1c30] dark:text-white mb-1">Phishing Basics</h4>
                <p className="text-xs font-bold text-[#006c49] dark:text-emerald-400">Completed</p>
              </div>

              <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-slate-900 rounded-lg border border-[#c6c6cd]/30 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-[#dce9ff] dark:bg-slate-800 flex items-center justify-center mb-3 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 bg-[#0b1c30]/10 h-1/2" />
                  <span className="material-symbols-outlined text-3xl text-[#0b1c30] dark:text-white relative z-10">smart_toy</span>
                </div>
                <h4 className="text-xs font-bold text-[#0b1c30] dark:text-white mb-1">AI Deepfake Spotter</h4>
                <div className="w-full bg-[#d3e4fe] dark:bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-[#006c49] h-1.5 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>

              <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-slate-900 rounded-lg border border-[#c6c6cd]/30 opacity-50 cursor-not-allowed">
                <div className="w-16 h-16 rounded-full bg-[#dce9ff] dark:bg-slate-800 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-3xl text-[#76777d]">lock</span>
                </div>
                <h4 className="text-xs font-bold text-[#0b1c30] dark:text-white mb-1">Advanced Forensics</h4>
                <p className="text-xs font-semibold text-[#76777d]">Locked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-xl max-w-xl w-full p-6 border border-[#c6c6cd] space-y-4 shadow-2xl bg-white dark:bg-slate-900">
            <div className="flex justify-between items-center border-b border-[#e5eeff] pb-3">
              <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c49]">quiz</span>
                ShieldTrain Practice Quiz
              </h3>
              <button onClick={() => setShowQuizModal(false)} className="p-1 hover:bg-[#eff4ff] rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {quizCompleted ? (
              <div className="py-6 text-center space-y-3">
                <span className="material-symbols-outlined text-5xl text-[#006c49]">military_tech</span>
                <h4 className="text-xl font-bold text-[#0b1c30] dark:text-white">Quiz Completed!</h4>
                <p className="text-xs text-[#45464d] dark:text-slate-400">
                  You scored <strong className="text-[#006c49]">{quizScore} / {quizQuestions.length}</strong>! Your Immunity Score has been updated to 85%.
                </p>
                <button
                  onClick={resetQuiz}
                  className="mt-4 px-6 py-2.5 bg-[#000000] dark:bg-sky-600 text-white font-bold rounded-lg text-xs"
                >
                  Close Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between text-xs text-[#45464d] font-bold">
                  <span>Question {quizQuestionIndex + 1} of {quizQuestions.length}</span>
                  <span>Score: {quizScore}</span>
                </div>

                <p className="text-sm font-bold text-[#0b1c30] dark:text-white leading-relaxed">
                  {quizQuestions[quizQuestionIndex].question}
                </p>

                <div className="space-y-2">
                  {quizQuestions[quizQuestionIndex].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all ${
                        selectedAnswer === i
                          ? i === quizQuestions[quizQuestionIndex].correct
                            ? 'bg-[#6cf8bb]/20 border-[#006c49] text-[#006c49] font-bold'
                            : 'bg-[#ffdad6] border-[#ba1a1a] text-[#ba1a1a] font-bold'
                          : 'bg-white dark:bg-slate-800 border-[#c6c6cd]/40 text-[#0b1c30] dark:text-slate-200 hover:bg-[#eff4ff]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {selectedAnswer !== null && (
                  <div className="p-3 bg-[#eff4ff] dark:bg-slate-800 rounded-lg text-xs text-[#45464d] dark:text-slate-300 border border-[#c6c6cd]/30 leading-relaxed">
                    <strong className="text-[#0b1c30] dark:text-white">Explanation: </strong>
                    {quizQuestions[quizQuestionIndex].explanation}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    disabled={selectedAnswer === null}
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 bg-[#000000] dark:bg-sky-600 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                  >
                    {quizQuestionIndex + 1 === quizQuestions.length ? 'Finish Quiz' : 'Next Question'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Lesson Modal */}
      {showVideoLesson && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-xl max-w-xl w-full p-6 border border-[#c6c6cd] space-y-4 shadow-2xl bg-white dark:bg-slate-900">
            <div className="flex justify-between items-center border-b border-[#e5eeff] pb-3">
              <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b87500]">play_circle</span>
                30s Micro-Learning: Spotting Fake Domains
              </h3>
              <button onClick={() => setShowVideoLesson(false)} className="p-1 hover:bg-[#eff4ff] rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="aspect-video bg-[#dce9ff] dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center p-6 text-center text-[#0b1c30] dark:text-white relative overflow-hidden border border-[#c6c6cd]">
              <span className="material-symbols-outlined text-6xl text-[#b87500] mb-2">domain_verification</span>
              <h4 className="text-sm font-bold mb-1">Lesson: Domain Reputation &amp; pHash Spoofing</h4>
              <p className="text-xs text-[#45464d] dark:text-slate-400 max-w-sm">
                Always verify that circular URLs originate from `.sebi.gov.in`, `.nseindia.com`, or `.bseindia.com`. Look for extra hyphens or typo-squatted domains like `sebi-alert-urgent.com`.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowVideoLesson(false)}
                className="px-5 py-2 bg-[#000000] dark:bg-sky-600 text-white font-bold rounded-lg text-xs"
              >
                Got It, Complete Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShieldTrain;
