import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    index("routes/_layout._index.tsx"),
    route("home", "routes/_layout.home.tsx"),
  ]),
  route("articles", "routes/articles._index.tsx"),
  route("articles/:slug", "routes/articles.$slug.tsx"),
  route("*", "routes/$.tsx"), // Catch-all route for 404s
] satisfies RouteConfig;
