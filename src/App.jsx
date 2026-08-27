import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './screens/Welcome';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import ThemeSelector from './screens/ThemeSelector';
import GuestCount from './screens/GuestCount';
import Budget from './screens/Budget';
import Allergy from './screens/Allergy';
import TastePreference from './screens/TastePreference';
import Drinks from './screens/Drinks';
import Cake from './screens/Cake';
import TimeLocation from './screens/TimeLocation';
import AiMatching from './screens/AiMatching';
import CommunityOrder from './screens/CommunityOrder';
import Summary from './screens/Summary';
import Payment from './screens/Payment';
import Confirmation from './screens/Confirmation';
import MatchingResult from './screens/MatchingResult';
import EditMenu from './screens/EditMenu';
import OrderHistory from './screens/OrderHistory';
import OrderTracking from './screens/OrderTracking';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import Privacy from './screens/Privacy';
import Terms from './screens/Terms';
import Support from './screens/Support';
import DeleteAccount from './screens/DeleteAccount';
import Settings from './screens/Settings';
import AiConsent from './screens/AiConsent';
import TableRingPreview from './screens/TableRingPreview'; // Phase 1 test screen — remove after Phase 2
import TableFlowLayout from './components/TableFlowLayout'; // Phase 2 — Table Concept shell
import TableHome from './screens/TableHome'; // Phase 3 — persistent Table Home (Food / Members / Bill Bar)
import JoinTable from './screens/JoinTable'; // Phase 8 (early) — QR / invite-link landing page

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />

        {/* Table Concept shell — blurred table + dots + floating card.
            Every screen inside here is untouched; only the outer frame
            and the routing order changed. */}
        <Route element={<TableFlowLayout />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/theme" element={<ThemeSelector />} />
          <Route path="/guests" element={<GuestCount />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/taste" element={<TastePreference />} />
          <Route path="/allergy" element={<Allergy />} />
          <Route path="/drinks" element={<Drinks />} />
          <Route path="/cake" element={<Cake />} />
          <Route path="/time" element={<TimeLocation />} />
          <Route path="/matching" element={<AiMatching />} />
          <Route path="/result" element={<MatchingResult />} />
          <Route path="/community" element={<CommunityOrder />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Route>

        {/* Table Home — the live hub after a table is confirmed. Not part
            of the step-by-step shell above; it's a persistent screen people
            come back to (Food, Members, Bill Bar), not one linear step. */}
        <Route path="/table" element={<TableHome />} />

        {/* QR / invite-link landing page — quick Sign Up or Log In only,
            no theme/budget/menu questions, since the table already exists. */}
        <Route path="/join/:orderId" element={<JoinTable />} />

        <Route path="/edit-menu" element={<EditMenu />} />
        <Route path="/history" element={<OrderHistory />} />
        <Route path="/tracking/:orderId" element={<OrderTracking />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/support" element={<Support />} />
        <Route path="/delete" element={<DeleteAccount />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ai-consent" element={<AiConsent />} />
        <Route path="/table-preview" element={<TableRingPreview />} />
      </Routes>
    </BrowserRouter>
  );
}
