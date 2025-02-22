
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthButtonProps {
  userId: string | null;
}

const AuthButton = ({ userId }: AuthButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async () => {
    if (userId) {
      try {
        await supabase.auth.signOut();
        toast({
          title: "Successfully signed out",
        });
      } catch (error: any) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      navigate("/auth");
    }
  };

  return (
    <Button onClick={handleAuth}>
      {userId ? "Sign Out" : "Sign In"}
    </Button>
  );
};

export default AuthButton;
