"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, RotateCcw, Trophy, BookOpen, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import quizQuestionsData from "@/data/questions.json";
import type { QuizDifficulty, QuizQuestion } from "@/types/quiz";
import { cn } from "@/lib/utils";

const ALL_QUESTIONS = quizQuestionsData as QuizQuestion[];

const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 } as const;
type DifficultyKey = keyof typeof difficultyOrder;

function difficultyRank(difficulty: string): number {
  return difficultyOrder[difficulty as DifficultyKey] ?? 0;
}
const categoryColors: Record<string, string> = {
  "BLACKBOARD WEEK 1": "bg-indigo-100 text-indigo-800",
  "Marketing Fundamentals": "bg-slate-100 text-slate-700",
  Strategy: "bg-blue-100 text-blue-700",
  CRM: "bg-emerald-100 text-emerald-700",
  "Strategic Planning": "bg-violet-100 text-violet-700",
  Environment: "bg-amber-100 text-amber-700",
  "Consumer Behavior": "bg-rose-100 text-rose-700",
  "Innovation Adoption": "bg-cyan-100 text-cyan-700",
  "Business Markets": "bg-orange-100 text-orange-700",
  Orientations: "bg-fuchsia-100 text-fuchsia-700"
};

const DIFFICULTY_OPTIONS: { value: "all" | QuizDifficulty; label: string }[] = [
  { value: "all", label: "Alle nivåer" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

export default function MarketingExamQuizApp() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | QuizDifficulty>("all");

  const categories = useMemo(() => {
    const names = new Set(ALL_QUESTIONS.map((q) => q.category));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, []);

  const orderedQuestions = useMemo(() => {
    let list = ALL_QUESTIONS.filter((q) => {
      if (categoryFilter !== "all" && q.category !== categoryFilter) return false;
      if (difficultyFilter !== "all" && q.difficulty !== difficultyFilter) return false;
      return true;
    });
    return list.sort(
      (a, b) => difficultyRank(a.difficulty) - difficultyRank(b.difficulty) || a.id - b.id
    );
  }, [categoryFilter, difficultyFilter]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setCurrent(0);
    setSelected(null);
    setAnswers({});
    setFinished(false);
    setShowExplanation(false);
  }, [categoryFilter, difficultyFilter]);

  const question = orderedQuestions[current];
  const total = orderedQuestions.length;
  const progress = total > 0 ? (Object.keys(answers).length / total) * 100 : 0;

  const handleSelect = (index: number) => {
    if (selected !== null || !question) return;
    setSelected(index);
    setShowExplanation(true);
    setAnswers((prev) => ({ ...prev, [question.id]: index }));
  };

  const handleNext = () => {
    if (current < total - 1) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers({});
    setFinished(false);
    setShowExplanation(false);
  };

  const score = orderedQuestions.filter((q) => answers[q.id] === q.correctIndex).length;
  const groupedReview = orderedQuestions.reduce<Record<string, QuizQuestion[]>>((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-3xl shadow-lg border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-900 p-3 text-white">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">Quiz complete</CardTitle>
                    <CardDescription>
                      You already saw the explanation after each answer. Here is your final score and review.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Score</div>
                    <div className="text-3xl font-bold">{score} / {total}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Accuracy</div>
                    <div className="text-3xl font-bold">{total > 0 ? Math.round((score / total) * 100) : 0}%</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-sm text-slate-500">Difficulty path</div>
                    <div className="text-3xl font-bold">Easy → Hard</div>
                  </div>
                </div>

                <Button onClick={handleRestart} className="rounded-2xl">
                  <RotateCcw className="mr-2 h-4 w-4" /> Restart quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-5">
            {Object.entries(groupedReview).map(([category, items], idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Card className="rounded-3xl shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <BookOpen className="h-5 w-5" /> {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((q) => {
                      const userAnswer = answers[q.id];
                      const correct = userAnswer === q.correctIndex;
                      return (
                        <div key={q.id} className="rounded-2xl border border-slate-200 p-4">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge className={categoryColors[q.category] || "bg-slate-100 text-slate-700"}>{q.category}</Badge>
                            <Badge variant="outline">{q.difficulty}</Badge>
                            {correct ? (
                              <Badge className="bg-emerald-100 text-emerald-700">Correct</Badge>
                            ) : (
                              <Badge className="bg-rose-100 text-rose-700">Incorrect</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-slate-900">{q.question}</h3>
                          <p className="mt-2 text-sm text-slate-600">
                            <span className="font-medium">Your answer:</span> {q.options[userAnswer]}
                          </p>
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Correct answer:</span> {q.options[q.correctIndex]}
                          </p>
                          <p className="mt-3 text-sm leading-6 text-slate-700">{q.explanation}</p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-3xl border-0 shadow-lg">
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-3xl">Marketing Exam Quiz</CardTitle>
                  <CardDescription>
                    Multiple-choice practice in English, based on your notes, starting easy and getting harder.
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleRestart} className="rounded-2xl">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden />
                  Filtrer spørsmål
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="quiz-filter-category" className="block text-sm font-medium text-slate-700">
                      Kategori
                    </label>
                    <select
                      id="quiz-filter-category"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className={cn(
                        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm",
                        "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-0"
                      )}
                    >
                      <option value="all">Alle kategorier</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="quiz-filter-difficulty" className="block text-sm font-medium text-slate-700">
                      Vanskelighetsgrad
                    </label>
                    <select
                      id="quiz-filter-difficulty"
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value as "all" | QuizDifficulty)}
                      className={cn(
                        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm",
                        "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-0"
                      )}
                    >
                      {DIFFICULTY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {total === 0
                    ? "Ingen spørsmål matcher filteret. Juster filter eller velg «Alle»."
                    : `Viser ${total} spørsmål${categoryFilter !== "all" || difficultyFilter !== "all" ? " · filtrert utvalg" : ""}.`}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Progress</span>
                  <span>{Object.keys(answers).length} / {total}</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {total === 0 ? (
          <Card className="rounded-3xl border border-dashed border-slate-300 bg-white/80 shadow-sm">
            <CardContent className="py-12 text-center">
              <p className="text-slate-600">Ingen spørsmål i dette utvalget. Endre kategori eller vanskelighetsgrad over.</p>
            </CardContent>
          </Card>
        ) : question ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">Question {current + 1} of {total}</Badge>
                  <Badge className={categoryColors[question.category] || "bg-slate-100 text-slate-700"}>{question.category}</Badge>
                  <Badge variant="outline">{question.difficulty}</Badge>
                </div>
                <CardTitle className="text-2xl leading-tight">{question.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {question.options.map((option, index) => {
                    const isChosen = selected === index;
                    const isCorrect = selected !== null && index === question.correctIndex;
                    const isWrongChosen = selected !== null && isChosen && index !== question.correctIndex;

                    let classes = "w-full justify-start whitespace-normal rounded-2xl border px-4 py-6 text-left h-auto ";
                    if (selected === null) {
                      classes += "border-slate-200 bg-white hover:bg-slate-50";
                    } else if (isCorrect) {
                      classes += "border-emerald-300 bg-emerald-50";
                    } else if (isWrongChosen) {
                      classes += "border-rose-300 bg-rose-50";
                    } else {
                      classes += "border-slate-200 bg-slate-50";
                    }

                    return (
                      <Button key={index} variant="ghost" className={classes} onClick={() => handleSelect(index)}>
                        <div className="flex w-full items-start justify-between gap-4">
                          <span className="text-sm md:text-base">{option}</span>
                          {selected !== null && isCorrect && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />}
                          {selected !== null && isWrongChosen && <XCircle className="mt-0.5 h-5 w-5 shrink-0" />}
                        </div>
                      </Button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-slate-50 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      {selected === question.correctIndex ? (
                        <Badge className="bg-emerald-100 text-emerald-700">Correct</Badge>
                      ) : (
                        <Badge className="bg-rose-100 text-rose-700">Incorrect</Badge>
                      )}
                      <Badge variant="outline">Correct answer: {question.options[question.correctIndex]}</Badge>
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{question.explanation}</p>
                  </motion.div>
                )}

                <div className="flex justify-end pt-2">
                  <Button onClick={handleNext} disabled={selected === null} className="rounded-2xl px-6">
                    {current === total - 1 ? "Finish quiz" : "Next question"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
        ) : null}
      </div>
    </div>
  );
}
