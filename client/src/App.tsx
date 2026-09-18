import { Switch, Route } from "wouter";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SetPassword from "./pages/SetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Registration from "./pages/Registration";
import Schedule from "./pages/Schedule";
import Standings from "./pages/Standings";
import Stats from "./pages/Stats";
import News from "./pages/News";
import NewsPost from "./pages/NewsPost";
import StarsOfWeek from "./pages/StarsOfWeek";
import LeagueRules from "./pages/LeagueRules";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AdminDashboard from "./pages/admin/Dashboard";
import StaffPortal from "./pages/StaffPortal";
import GameStatsEntry from "./pages/GameStatsEntry";
import Logout from "./pages/Logout";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/set-password" component={SetPassword} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/logout" component={Logout} />
          <Route path="/register" component={Registration} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/standings" component={Standings} />
          <Route path="/stats" component={Stats} />
          <Route path="/news" component={News} />
          <Route path="/news/:id" component={NewsPost} />
          <Route path="/stars" component={StarsOfWeek} />
          <Route path="/rules" component={LeagueRules} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/staff" component={StaffPortal} />
          <Route path="/staff/game/:gameId" component={GameStatsEntry} />
          <Route path="/admin" component={AdminDashboard} />
          <Route>
            <div className="px-4 py-24 text-center text-gray-500">
              Page not found.
            </div>
          </Route>
        </Switch>
      </main>
    </div>
  );
}
