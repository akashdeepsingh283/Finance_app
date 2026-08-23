import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";

function Hero({ dashboardPath = "/dashboard", loginPath = "/sign-in" }) {
  const { isAuthenticated } = useAuth();

  return (
    <section className="h-[calc(100vh-82px)] w-full bg-[url('/moneybg.jpg')] bg-cover bg-center">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex">
        <div className="mx-auto max-w-xl pt-16 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Master Your Money
            <strong className="font-extrabold text-primary sm:block">
              Budget Better
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Spend smarter, save better, and simplify your financial journey.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button className="w-full px-12 sm:w-auto" asChild>
              <Link to={isAuthenticated ? dashboardPath : loginPath}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Hero };
export default Hero;
