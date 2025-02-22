
import { Recipe } from "@/types/recipe";

const BASE_URL = "https://api.spoonacular.com/recipes";

export const searchRecipesByIngredients = async (
  ingredients: string,
  apiKey: string
): Promise<Recipe[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/findByIngredients?apiKey=${apiKey}&ingredients=${ingredients}&number=9&ranking=2&ignorePantry=true`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }

    const data = await response.json();
    
    // Transform Spoonacular data to match our Recipe type
    return data.map((item: any) => ({
      id: item.id.toString(),
      name: item.title,
      image: item.image,
      cuisine: "Various", // Spoonacular doesn't provide cuisine in this endpoint
      difficulty: "medium" as const,
      duration: 30, // Default duration as this endpoint doesn't provide it
      ingredients: item.usedIngredients.map((ing: any) => ing.name),
      instructions: [], // We'll need another API call to get instructions
      dietary: [], // We'll need another API call to get dietary info
      saved: false
    }));
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};
