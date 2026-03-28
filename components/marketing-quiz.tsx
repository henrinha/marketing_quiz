"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, RotateCcw, Trophy, BookOpen, Sparkles, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import quizQuestionsData from "@/data/questions.json";
import type { QuizDifficulty, QuizQuestion } from "@/types/quiz";
import { cn } from "@/lib/utils";

const ALL_QUESTIONS = quizQuestionsData as QuizQuestion[];

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
  { value: "Hard", label: "Hard" }
];

type Phase = "setup" | "playing" | "finished";

export default function MarketingExamQuizApp() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);
  const [setupError, setSetupError] = useState<string | null>(null);

  const [countInput, setCountInput] = useState("10");
  const [selectedCats, setSelectedCats] = useState<Record<string, boolean>>({});
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | QuizDifficulty>("all");

  const categories = useMemo(() => {
    const names = new Set(ALL_QUESTIONS.map((q) => q.category));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, []);

  useEffect(() => {
    setSelectedCats((prev) => {
      const next = { ...prev };
      let changed = false;
      categories.forEach((c) => {
        if (next[c] === undefined) {
          next[c] = true;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [categories]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const total = sessionQuestions.length;
  const question = sessionQuestions[current];
  const progress = total > 0 ? (Object.keys(answers).length / total) * 100 : 0;

  const poolSize = useMemo(() => {
    const cats = categories.filter((c) => selectedCats[c]);
    if (cats.length === 0) return 0;
    return ALL_QUESTIONS.filter(
      (q) => cats.includes(q.category) && (difficultyFilter === "all" || q.difficulty === difficultyFilter)
    ).length;
  }, [categories, selectedCats, difficultyFilter]);

  const generateQuiz = () => {
    setSetupError(null);
    const cats = categories.filter((c) => selectedCats[c]);
    if (cats.length === 0) {
      setSetupError("Velg minst én kategori.");
      return;
    }
    const n = parseInt(countInput.trim(), 10);
    if (!Number.isFinite(n) || n < 1) {
      setSetupError("Skriv inn et heltall større enn 0.");
      return;
    }
    const pool = ALL_QUESTIONS.filter(
      (q) => cats.includes(q.category) && (difficultyFilter === "all" || q.difficulty === difficultyFilter)
    );
    if (pool.length === 0) {
      setSetupError("Ingen spørsmål matcher kategori og vanskelighetsgrad.");
      return;
    }
    const take = Math.min(n, pool.length);
    const shuffled = shuffle(pool);
    setSessionQuestions(shuffled.slice(0, take));
    setPhase("playing");
    setCurrent(0);
    setSelected(null);
    setAnswers({});
    setShowExplanation(false);
  };

  const backToSetup = () => {
    setPhase("setup");
    setSessionQuestions([]);
    setCurrent(0);
    setSelected(null);
    setAnswers({});
    setShowExplanation(false);
    setSetupError(null);
  };

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
      setPhase("finished");
    }
  };

  const toggleCategory = (c: string) => {
    setSelectedCats((prev) => ({ ...prev, [c]: !prev[c] }));
  };

  const selectAllCategories = (value: boolean) => {
    const next: Record<string, boolean> = {};
    categories.forEach((c) => {
      next[c] = value;
    });
    setSelectedCats(next);
  };

  const score = sessionQuestions.filter((q) => answers[q.id] === q.correctIndex).length;
  const groupedReview = sessionQuestions.reduce<Record<string, QuizQuestion[]>>((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});

  if (phase === "finished") {
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
                    <div className="text-3xl font-bold">
                      {score} / {total}
                    </div>
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

                <div className="flex flex-wrap gap-3">
                  <Button onClick={backToSetup} className="rounded-2xl">
                    <Sparkles className="mr-2 h-4 w-4" /> Ny quiz
                  </Button>
                </div>
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

  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 md:p-10">
        <div className="mx-auto max-w-lg space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl">Lag din quiz</CardTitle>
                <CardDescription>
                  Velg hvor mange spørsmål du vil ha, hvilke kategorier som skal inkluderes, og start. Spørsmålene trekkes
                  tilfeldig fra utvalget.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="quiz-count" className="text-sm font-medium text-slate-700">
                    Antall spørsmål
                  </label>
                  <input
                    id="quiz-count"
                    type="number"
                    min={1}
                    value={countInput}
                    onChange={(e) => setCountInput(e.target.value)}
                    className={cn(
                      "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm",
                      "focus:outline-none focus:ring-2 focus:ring-slate-400"
                    )}
                  />
                  <p className="text-xs text-slate-500">
                    Maks {poolSize} spørsmål i gjeldende utvalg (kategori + vanskelighetsgrad).
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Vanskelighetsgrad (filter før trekking)</span>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value as "all" | QuizDifficulty)}
                    className={cn(
                      "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm",
                      "focus:outline-none focus:ring-2 focus:ring-slate-400"
                    )}
                  >
                    {DIFFICULTY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-700">Kategorier</span>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => selectAllCategories(true)}>
                        Velg alle
                      </Button>
                      <Button type="button" variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => selectAllCategories(false)}>
                        Velg ingen
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3">
                    {categories.map((c) => (
                      <label
                        key={c}
                        className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={!!selectedCats[c]}
                          onChange={() => toggleCategory(c)}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                        />
                        <span className="text-sm leading-snug text-slate-800">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {setupError && <p className="text-sm text-rose-600">{setupError}</p>}

                <Button type="button" onClick={generateQuiz} className="w-full rounded-2xl py-6 text-base" disabled={poolSize === 0}>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generer og start quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>
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
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle className="text-3xl">Marketing Exam Quiz</CardTitle>
                  <CardDescription>
                    {total} spørsmål i denne økten · tilfeldig rekkefølge innenfor utvalget ditt.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={backToSetup} className="rounded-2xl">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake til oppsett
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Progress</span>
                  <span>
                    {Object.keys(answers).length} / {total}
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {total === 0 ? (
          <Card className="rounded-3xl border border-dashed border-slate-300 bg-white/80 shadow-sm">
            <CardContent className="py-12 text-center">
              <p className="text-slate-600">Ingen spørsmål i økten.</p>
              <Button className="mt-4 rounded-2xl" onClick={backToSetup}>
                Tilbake til oppsett
              </Button>
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
                    <Badge variant="outline">
                      Question {current + 1} of {total}
                    </Badge>
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

                      let classes =
                        "w-full justify-start whitespace-normal rounded-2xl border px-4 py-6 text-left h-auto ";
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 rounded-2xl bg-slate-50 p-4">
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
