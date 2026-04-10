import type { Route } from "./+types/home";
import LandingPage from "./landingPage"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MzansiBuilds" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <LandingPage  />;
}
