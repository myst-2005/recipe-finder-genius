
import { Button } from "@/components/ui/button";

interface DietaryFilterProps {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

const DietaryFilter = ({ options, selected, onToggle }: DietaryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option}
          variant="outline"
          size="sm"
          className={`rounded-full transition-colors ${
            selected.includes(option)
              ? "bg-primary text-primary-foreground"
              : "bg-white hover:bg-gray-50"
          }`}
          onClick={() => onToggle(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default DietaryFilter;
