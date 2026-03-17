"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DuckScene, type DuckEmotion } from "./duck-scene"
import {
  Question,
  Answer,
  getRandomQuestions,
  calculateTraits,
  getTopTraits,
  getJudgmentTitle,
  getRandomReaction,
  getRandomJudgment,
  getRandomFinalLine,
} from "@/lib/judgment-duck-data"

type GameState = "intro" | "playing" | "reaction" | "judgment"

export function JudgmentDuckGame() {
  const [gameState, setGameState] = useState<GameState>("intro")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([])
  const [duckSpeaking, setDuckSpeaking] = useState(false)
  const [duckEmotion, setDuckEmotion] = useState<DuckEmotion>("neutral")
  const [currentReaction, setCurrentReaction] = useState("")
  const [judgmentData, setJudgmentData] = useState({
    title: "",
    judgment: "",
    finalLine: "",
  })

  const startGame = useCallback(() => {
    const gameQuestions = getRandomQuestions(6)
    setQuestions(gameQuestions)
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setGameState("playing")
  }, [])

  const handleAnswer = useCallback((answer: Answer) => {
    const newAnswers = [...selectedAnswers, answer]
    setSelectedAnswers(newAnswers)
    
    // Pick a random reaction emotion
    const reactionEmotions: DuckEmotion[] = ["skeptical", "judging", "surprised", "disappointed", "amused"]
    const randomEmotion = reactionEmotions[Math.floor(Math.random() * reactionEmotions.length)]
    
    // Show duck reaction
    setCurrentReaction(getRandomReaction())
    setDuckSpeaking(true)
    setDuckEmotion(randomEmotion)
    setGameState("reaction")

    setTimeout(() => {
      setDuckSpeaking(false)
      
      if (currentQuestionIndex + 1 >= questions.length) {
        // Calculate final judgment
        const traits = calculateTraits(newAnswers)
        const { primary, secondary } = getTopTraits(traits)
        const title = getJudgmentTitle(primary, secondary)
        
        setDuckEmotion("intense")
        setJudgmentData({
          title,
          judgment: getRandomJudgment(),
          finalLine: getRandomFinalLine(),
        })
        setGameState("judgment")
      } else {
        setDuckEmotion("neutral")
        setCurrentQuestionIndex((prev) => prev + 1)
        setGameState("playing")
      }
    }, 2500)
  }, [selectedAnswers, currentQuestionIndex, questions.length])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex) / questions.length) * 100 : 0

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden">
      {/* 3D Duck Scene */}
      <DuckScene
        speaking={duckSpeaking}
        judgmentMode={gameState === "judgment"}
        emotion={duckEmotion}
        className="absolute inset-0 w-full h-full"
      />

      {/* Progress Bar */}
      <AnimatePresence>
        {gameState === "playing" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-10 p-4"
          >
            <div className="max-w-md mx-auto">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-amber-500/80"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-white/40 text-xs text-center mt-2 font-mono">
                {currentQuestionIndex + 1} / {questions.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Content */}
      <div className="relative z-10 flex flex-col items-center justify-end min-h-screen pb-8 px-4">
        <AnimatePresence mode="wait">
          {/* Intro Screen */}
          {gameState === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-8"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-white tracking-tight"
              >
                Judgment Duck
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-black/60 backdrop-blur-sm rounded-xl p-6 max-w-md border border-white/10"
              >
                <p className="text-white/90 text-lg italic leading-relaxed">
                  "Answer carefully. I am not easily impressed."
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full transition-colors shadow-lg shadow-amber-500/20"
              >
                Begin Judgment
              </motion.button>
            </motion.div>
          )}

          {/* Question Screen */}
          {gameState === "playing" && currentQuestion && (
            <motion.div
              key={`question-${currentQuestion.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-lg space-y-6"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-white text-center font-medium px-4"
              >
                {currentQuestion.question}
              </motion.h2>

              <div className="space-y-3">
                {currentQuestion.answers.map((answer, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(answer)}
                    className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 rounded-xl text-left text-white/90 hover:text-white transition-all group"
                  >
                    <span className="text-amber-500/60 group-hover:text-amber-500 mr-3 font-mono text-sm">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {answer.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reaction Screen */}
          {gameState === "reaction" && (
            <motion.div
              key="reaction"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center max-w-md"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/70 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20"
              >
                <p className="text-white/90 text-lg italic">
                  "{currentReaction}"
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Judgment Screen */}
          {gameState === "judgment" && (
            <motion.div
              key="judgment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center max-w-lg space-y-6 px-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="space-y-2"
              >
                <p className="text-amber-500/80 text-sm uppercase tracking-widest font-mono">
                  You Have Been Judged
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {judgmentData.title}
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <p className="text-white/80 text-base md:text-lg leading-relaxed italic whitespace-pre-line">
                  {judgmentData.judgment}
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-amber-500 text-xl font-semibold"
              >
                "{judgmentData.finalLine}"
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setGameState("intro")
                  setSelectedAnswers([])
                  setCurrentQuestionIndex(0)
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-white/20"
              >
                Face Judgment Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
