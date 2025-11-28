import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hotel-navy to-hotel-gold">
      <div className="text-center text-white">
        <h1 className="text-9xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Admin Page Not Found</h2>
        <p className="text-xl mb-8">The admin page you're looking for doesn't exist.</p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-white text-hotel-navy hover:bg-gray-100"
        >
          <Home className="h-4 w-4 mr-2" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;