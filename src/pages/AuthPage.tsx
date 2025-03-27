import { useState } from "react";
import RegistrationForm from "../components/auth/RegistrationForm";
import LoginForm from "../components/auth/LoginForm";
import { useRedirectIfAuthenticated } from "../hooks/useRequireAuth";

export default function AuthPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const { isLoading } = useRedirectIfAuthenticated("/");

  const handleFormSwitch = (shouldFlip: boolean) => {
    setIsFlipped(shouldFlip);
  };
  // could go with Tabs from shadcn instead
  // Show loading state while checking auth status
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-primary-400 text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full items-center justify-center min-h-screen bg-neutral-900 p-4 flex flex-col lg:grid grid-cols-2">
      <div className="col-span-1 w-full max-w-lg lg:max-w-full flex flex-col items-center">
        {/* Card container with perspective */}
        <div
          className="w-full h-[600px] relative"
          style={{ perspective: "2000px" }}
        >
          {/* Flip container */}
          <div
            className="w-full h-full duration-700 relative preserve-3d"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.6s ease-in-out",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front side (Registration Form) */}
            <div
              className="w-full h-full absolute backface-hidden"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <RegistrationForm onLoginClick={() => handleFormSwitch(true)} />
            </div>

            {/* Back side (Login Form) */}
            <div
              className="w-full h-full absolute backface-hidden"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <LoginForm onRegisterClick={() => handleFormSwitch(false)} />
            </div>
          </div>
        </div>
      </div>

      {/* Right side content for larger screens */}
      <div className="col-span-1 hidden lg:flex items-center justify-center">
        <div className="text-white max-w-md p-8">
          <h1 className="text-4xl font-bold mb-6 text-primary-400">
            Welcome to Kaido
          </h1>
          <p className="text-xl text-neutral-300 mb-4">
            Find the perfect laptop to match your needs with our expert
            recommendations.
          </p>
          <p className="text-neutral-400">
            Create an account to save your preferences, track prices, and
            receive personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}

/* 

if i were to request GET http://localhost:3000/auth/whoami based on my backend in klaptback, and im not logged in and i get this
{
  "message": "Forbidden resource",
  "error": "Forbidden",
  "statusCode": 403
}

if im logged in i get
id and email like this

{
  "id": 1,
  "email": "bigbig113@balls.com"
}

how do i show login/register button conditionally

 
*/
