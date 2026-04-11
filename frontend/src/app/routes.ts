import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
    route('userRegistration','routes/userRegistration.tsx'),
    route('dashboard','routes/dashboard.tsx'),
    route('signin','authentication/signin.tsx'),
    route('signup','authentication/signup.tsx')
] satisfies RouteConfig;
