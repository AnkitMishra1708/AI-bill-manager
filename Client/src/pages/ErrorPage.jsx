import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import what from "../assets/what.mp4";

export const ErrorPage = () => {
  const error = useRouteError();

  let errorMessage = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorMessage = "404 Not Found";
    } else {
      errorMessage = error.statusText || "Route Error";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8 font-sans antialiased">
      <h1 className="text-4xl font-bold">{errorMessage}</h1>

      <Link
        to="/"
        className="inline-block rounded-xl px-6 py-3 text-lg font-semibold text-black"
      >
        Back to Home Page
      </Link>

      <video
        autoPlay
        loop
        muted
        playsInline
        src={what}
        className="w-96"
      />
    </div>
  );
};