export type QuizDifficulty = "Easy" | "Medium" | "Hard";

export interface QuizQuestion {
  id: number;
  difficulty: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
