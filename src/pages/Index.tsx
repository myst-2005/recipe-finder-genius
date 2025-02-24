
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import SearchBar from "@/components/SearchBar";
import RecipeCard from "@/components/RecipeCard";
import DietaryFilter from "@/components/DietaryFilter";
import AuthButton from "@/components/AuthButton";
import { Recipe } from "@/types/recipe";
import { searchRecipesByIngredients, toggleFavoriteRecipe, getFavoriteStatus } from "@/services/recipeApi";
import { supabase } from "@/integrations/supabase/client";

const dietaryOptions = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "high-protein",
];

const Index = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Debounce search input
  const handleSearchChange = (value: string) => {
    setSearch(value);
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  // Fetch recipes using React Query
  const { data: recipes = [], isLoading, isError } = useQuery({
    queryKey: ['recipes', debouncedSearch],
    queryFn: () => searchRecipesByIngredients(debouncedSearch, import.meta.env.VITE_SPOONACULAR_API_KEY),
    enabled: debouncedSearch.length > 0,
  });

  const handleSaveRecipe = async (id: string) => {
    try {
      if (!user) {
        toast({
          title: "Please log in to save recipes",
          variant: "destructive",
          duration: 2000
        });
        return;
      }

      const isSaved = await toggleFavoriteRecipe(id, user.id);
      toast({
        title: isSaved ? "Recipe saved to favorites" : "Recipe removed from favorites",
        duration: 2000
      });
    } catch (error) {
      toast({
        title: "Error saving recipe",
        variant: "destructive",
        duration: 2000
      });
    }
  };

  const toggleDietary = (option: string) => {
    setSelectedDietary((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // Load favorite status for each recipe
  useEffect(() => {
    if (user && recipes.length > 0) {
      recipes.forEach(async (recipe) => {
        const isSaved = await getFavoriteStatus(recipe.id, user.id);
        if (isSaved !== recipe.saved) {
          recipe.saved = isSaved;
        }
      });
    }
  }, [recipes, user]);

  return (
    <div className="min-h-screen bg-[#F2FCE2]">
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-center space-y-4 flex-grow">
            <h1 className="text-4xl font-bold text-gray-900">Recipe Finder</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enter your ingredients to discover delicious recipes you can make right now
            </p>
          </div>
          <AuthButton userId={user?.id ?? null} />
        </div>

        <SearchBar 
          value={search} 
          onChange={handleSearchChange}
          placeholder="Enter ingredients (e.g., tomatoes, basil, mozzarella)"
        />

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Dietary Preferences</h2>
            <DietaryFilter
              options={dietaryOptions}
              selected={selectedDietary}
              onToggle={toggleDietary}
            />
          </div>

          {isError && (
            <div className="text-center text-red-500">
              Error loading recipes. Please try again later.
            </div>
          )}

          {isLoading && (
            <div className="text-center text-gray-600">
              Searching for recipes...
            </div>
          )}

          {!isLoading && !isError && recipes.length === 0 && debouncedSearch && (
            <div className="text-center text-gray-600">
              No recipes found. Try different ingredients!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onSave={handleSaveRecipe}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
