
export interface Recipe {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  ingredients: string[];
  instructions: string[];
  dietary: string[];
  saved: boolean;
}
