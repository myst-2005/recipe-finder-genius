
import { Recipe } from "@/types/recipe";
import { supabase } from "@/integrations/supabase/client";

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
    
    // Transform Spoonacular data and store in Supabase
    const recipes = data.map((item: any) => ({
      id: item.id.toString(),
      name: item.title,
      image: item.image,
      cuisine: "Various",
      difficulty: "medium" as const,
      duration: 30,
      ingredients: item.usedIngredients.map((ing: any) => ing.name),
      instructions: [],
      dietary: [],
      saved: false
    }));

    // Store recipes in Supabase
    for (const recipe of recipes) {
      const { data: existingRecipe } = await supabase
        .from('recipes')
        .select()
        .eq('id', recipe.id)
        .single();

      if (!existingRecipe) {
        await supabase
          .from('recipes')
          .insert({
            id: recipe.id,
            name: recipe.name,
            image: recipe.image,
            cuisine: recipe.cuisine,
            difficulty: recipe.difficulty,
            duration: recipe.duration,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            dietary: recipe.dietary
          });
      }
    }

    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

export const toggleFavoriteRecipe = async (recipeId: string, userId: string | undefined) => {
  if (!userId) {
    throw new Error('User must be logged in to save recipes');
  }

  const { data: existing } = await supabase
    .from('user_favorites')
    .select()
    .eq('recipe_id', recipeId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    await supabase
      .from('user_favorites')
      .delete()
      .eq('recipe_id', recipeId)
      .eq('user_id', userId);
    return false;
  } else {
    await supabase
      .from('user_favorites')
      .insert({
        recipe_id: recipeId,
        user_id: userId
      });
    return true;
  }
};

export const getFavoriteStatus = async (recipeId: string, userId: string | undefined): Promise<boolean> => {
  if (!userId) return false;

  const { data } = await supabase
    .from('user_favorites')
    .select()
    .eq('recipe_id', recipeId)
    .eq('user_id', userId)
    .single();

  return !!data;
};
