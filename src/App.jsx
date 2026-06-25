import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './screens/Welcome';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import ThemeSelector from './screens/ThemeSelector';
import GuestCount from './screens/GuestCount';
import Budget from './screens/Budget';
import Allergy from './screens/Allergy';
import TastePreference from './screens/TastePreference';
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/theme" element={<ThemeSelector />} />
        <Route path="/guests" element={<GuestCount />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/allergy" element={<Allergy />} />
        <Route path="/taste" element={<TastePreference />} />
        <Route path="/time" element={<TimeLocation />} />
        <Route path="/matching" element={<AiMatching />} />
        <Route path="/result" element={<MatchingResult />} />
        <Route path="/edit-menu" element={<EditMenu />} />
        <Route path="/community" element={<CommunityOrder />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/history" element={<OrderHistory />} />
        <Route path="/tracking/:orderId" element={<OrderTracking />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
