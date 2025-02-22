
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import RecipeCard from "@/components/RecipeCard";
import DietaryFilter from "@/components/DietaryFilter";
import { Recipe } from "@/types/recipe";

// Temporary mock data
const mockRecipes: Recipe[] = [
  {
    id: "1",
    name: "Vegetarian Pasta Primavera",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
    cuisine: "Italian",
    difficulty: "easy",
    duration: 30,
    ingredients: ["pasta", "vegetables", "olive oil"],
    instructions: ["Boil pasta", "Sauté vegetables", "Combine and serve"],
    dietary: ["vegetarian"],
    saved: false,
  },
  {
    id: "2",
    name: "Chicken Stir Fry",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
    cuisine: "Asian",
    difficulty: "medium",
    duration: 45,
    ingredients: ["chicken", "vegetables", "soy sauce"],
    instructions: ["Cut chicken", "Stir fry vegetables", "Add sauce"],
    dietary: ["high-protein"],
    saved: true,
  },
];

const dietaryOptions = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "high-protein",
];

const Index = () => {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  const handleSaveRecipe = (id: string) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, saved: !recipe.saved } : recipe
      )
    );
  };

  const toggleDietary = (option: string) => {
    setSelectedDietary((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Recipe Finder</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your ingredients to discover delicious recipes you can make right now
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} />

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Dietary Preferences</h2>
            <DietaryFilter
              options={dietaryOptions}
              selected={selectedDietary}
              onToggle={toggleDietary}
            />
          </div>

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
