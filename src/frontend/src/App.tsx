import { AuthProvider } from "@/components/auth/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { StoryViewer } from "@/components/stories/StoryViewer";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AccountsCentrePage } from "@/pages/AccountsCentrePage";
import { AdminPage } from "@/pages/AdminPage";
import { EditProfilePage } from "@/pages/EditProfilePage";
import { ExplorePage } from "@/pages/ExplorePage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { MessagesPage } from "@/pages/MessagesPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ReelsPage } from "@/pages/ReelsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { SignupPage } from "@/pages/SignupPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Outlet />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  ),
});

// Public routes (no auth required)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});

// Auth shell layout - uses path "/" so nested routes get correct paths
const shellRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "shell",
  component: AppShell,
});

const homeRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/",
  component: HomePage,
});

const exploreRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/explore",
  component: ExplorePage,
});

const reelsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/reels",
  component: ReelsPage,
});

const messagesRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/messages",
  component: MessagesPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/notifications",
  component: NotificationsPage,
});

const editProfileRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/profile/edit",
  component: EditProfilePage,
});

const profileRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/profile/$username",
  component: ProfilePage,
});

const storiesRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/stories/$userId",
  component: StoriesRouteComponent,
});

function StoriesRouteComponent() {
  const { userId } = storiesRoute.useParams();
  return <StoryViewer userId={userId} />;
}

const settingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/settings",
  component: SettingsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/admin",
  component: AdminPage,
});

const accountsCentreRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/accounts-centre",
  component: AccountsCentrePage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  signupRoute,
  shellRoute.addChildren([
    homeRoute,
    exploreRoute,
    reelsRoute,
    messagesRoute,
    notificationsRoute,
    editProfileRoute,
    profileRoute,
    storiesRoute,
    settingsRoute,
    adminRoute,
    accountsCentreRoute,
  ]),
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
