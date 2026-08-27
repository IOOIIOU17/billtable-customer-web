import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrderStore from '../store/orderStore';
import api from '../services/api';
import TableRing from '../components/TableRing';
import FoodSheet from '../components/FoodSheet';
import MemberPanel from '../components/MemberPanel';
import InviteSheet from '../components/InviteSheet';
import ChatSheet from '../components/ChatSheet';
import BillBar from '../components/BillBar';

// Fallback so this screen can be checked directly (localhost/table) without
// walking the whole SignUp → Matching flow first — same idea as the Phase 1
// /table-preview screen. Once a real order exists (store.currentOrderId is
// set — either because someone just confirmed a table, or a guest joined
// via a QR/invite link), Table Home switches to "live" mode: restaurant,
// menu, Food/Members/Activities all come from the real backend so everyone
// looking at the same order sees the same table.
const MOCK_RESTAURANT_NAME = 'Downy Thai Kitchen';
const MOCK_MENUS = [
  { id: 1, name: 'Pad Thai', price: 14 },
  { id: 2, name: 'Green Curry', price: 16 },
  { id: 3, name: 'Mango Sticky Rice', price: 8 },
  { id: 4, name: 'Spring Rolls', price: 7 },
  { id: 5, name: 'Thai Iced Tea', price: 5 },
];

const NAME_KEY = 'billtable_my_name';

export default function TableHome() {
  const navigate = useNavigate();
  const store = useOrderStore();
  const orderId = store.currentOrderId;
  const isLive = !!orderId;

  const [foodOpen, setFoodOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [myName, setMyNameState] = useState(() => {
    try { return localStorage.getItem(NAME_KEY) || ''; } catch { return ''; }
  });
  const [remoteOrder, setRemoteOrder] = useState(null);
  const [remoteMenus, setRemoteMenus] = useState([]);
  const [remoteMembers, setRemoteMembers] = useState([]);
  const [remoteActivities, setRemoteActivities] = useState([]);
  const [syncError, setSyncError] = useState('');

  const refetchAll = useCallback(async () => {
    if (!orderId) return;
    try {
      const [orderRes, membersRes, activitiesRes] = await Promise.all([
        api.get(`/api/orders/${orderId}/table`),
        api.get(`/api/orders/${orderId}/members`),
        api.get(`/api/orders/${orderId}/activities`),
      ]);
      const order = orderRes.data?.data?.order || null;
      setRemoteOrder(order);
      setRemoteMembers(membersRes.data?.data?.members || []);
      setRemoteActivities(activitiesRes.data?.data?.activities || []);
      setSyncError('');

      if (order?.restaurant_id) {
        try {
          const menuRes = await api.get(`/api/menus/restaurant/${order.restaurant_id}`);
          setRemoteMenus(menuRes.data?.menuItems || []);
        } catch {
          setRemoteMenus([]);
        }
      }
    } catch {
      setSyncError('Could not load the latest table data. Pull down to try again.');
    }
  }, [orderId]);

  useEffect(() => { refetchAll(); }, [refetchAll]);

  // Once I have a name and this is a real order, register myself in the
  // roster (idempotent on the backend — same name just no-ops).
  useEffect(() => {
    if (isLive && myName) {
      api.post(`/api/orders/${orderId}/members`, { name: myName }).then(refetchAll).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLive, myName, orderId]);

  const handleSetMyName = (name) => {
    setMyNameState(name);
    try { localStorage.setItem(NAME_KEY, name); } catch { /* ignore */ }
    if (!isLive) store.setMyName(name);
  };

  const handleAddItem = async (item) => {
    if (isLive) {
      try {
        await api.post(`/api/orders/${orderId}/items`, { menuItemId: item.menuItemId, quantity: 1, addedBy: item.addedBy });
        await refetchAll();
      } catch (err) {
        setSyncError(err.response?.data?.message || 'Could not add that item.');
      }
    } else {
      store.addPartyItem(item);
    }
  };

  const handleDecrementItem = async (itemId) => {
    if (isLive) {
      try {
        await api.delete(`/api/orders/${orderId}/items/${itemId}`, { data: { addedBy: myName } });
        await refetchAll();
      } catch (err) {
        setSyncError(err.response?.data?.message || 'Could not update that item.');
      }
    } else {
      store.decrementPartyItem(itemId);
    }
  };

  const handleAddActivity = async (activity) => {
    if (isLive) {
      try {
        await api.post(`/api/orders/${orderId}/activities`, { ...activity, createdBy: myName || undefined });
        await refetchAll();
      } catch (err) {
        setSyncError(err.response?.data?.message || 'Could not add that activity.');
      }
    } else {
      store.addActivity(activity);
    }
  };

  const restaurantName = isLive
    ? (remoteOrder?.restaurant_name || 'Your Restaurant')
    : (store.matchedRestaurant?.restaurant?.name || store.matchedRestaurant?.name || MOCK_RESTAURANT_NAME);

  const theme = isLive ? (remoteOrder?.theme || '') : store.theme;
  const guestCount = (isLive ? remoteOrder?.guest_count : store.guestCount) || store.guestCount || 6;
  const deliveryTime = isLive ? remoteOrder?.delivery_time : store.deliveryTime;

  const menus = isLive
    ? remoteMenus.map((m) => ({ id: m.id, name: m.name, price: parseFloat(m.price) || 0 }))
    : (() => {
        const matched = store.matchedRestaurant;
        const editedMenus = matched?.menus;
        const hasValidPrices = editedMenus?.length && editedMenus.every((m) => typeof m.price === 'number');
        return (hasValidPrices ? editedMenus : (matched?.recommended_menus || MOCK_MENUS)).slice(0, 8);
      })();

  const partyItems = isLive
    ? (remoteOrder?.items || []).map((it) => ({
        id: it.id,
        menuItemId: it.menu_item_id ?? it.item_name,
        name: it.item_name,
        price: parseFloat(it.unit_price) || 0,
        quantity: it.quantity,
        addedBy: it.added_by || 'Host',
      }))
    : store.partyItems;

  const activities = isLive
    ? remoteActivities.map((a) => ({ id: a.id, title: a.title, time: a.time || '-' }))
    : store.activities;

  const itemCount = partyItems.reduce((sum, p) => sum + p.quantity, 0);
  const total = partyItems.reduce((sum, p) => sum + p.price * p.quantity, 0);

  // Members: live mode uses the real roster (earliest join = Host for
  // display purposes); local/demo mode falls back to the old placeholder.
  let members;
  if (isLive) {
    const rosterNames = new Set(remoteMembers.map((m) => m.name));
    const extraNames = [...new Set(partyItems.map((p) => p.addedBy))].filter((n) => n && !rosterNames.has(n));
    members = [
      ...remoteMembers.map((m, i) => ({
        name: m.name,
        role: i === 0 ? 'host' : 'guest',
        itemCount: partyItems.filter((p) => p.addedBy === m.name).reduce((s, p) => s + p.quantity, 0),
      })),
      ...extraNames.map((name) => ({
        name,
        role: 'guest',
        itemCount: partyItems.filter((p) => p.addedBy === name).reduce((s, p) => s + p.quantity, 0),
      })),
    ];
    if (members.length === 0) members = [{ name: myName || 'You', role: 'host', itemCount: 0 }];
  } else {
    const addedByNames = [...new Set(partyItems.map((p) => p.addedBy))].filter((n) => n && n !== (myName || 'You'));
    members = [
      { name: myName || 'You', role: 'host', itemCount: partyItems.filter((p) => p.addedBy === (myName || 'You')).reduce((s, p) => s + p.quantity, 0) },
      ...addedByNames.map((name) => ({
        name,
        role: 'guest',
        itemCount: partyItems.filter((p) => p.addedBy === name).reduce((s, p) => s + p.quantity, 0),
      })),
    ];
  }
  const tableMembers = members.map((m) => ({ name: m.name, role: m.role }));

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-paper)', maxWidth: '480px', margin: '0 auto', paddingBottom: '90px' }}>
      <div style={{ padding: '28px 24px 12px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', margin: '0 0 4px' }}>
          {theme || 'your event'}
        </p>
        <h1 style={{ fontFamily: 'var(--font-logo)', fontSize: '30px', margin: '0 0 4px' }}>{restaurantName}</h1>
        <p style={{ fontFamily: 'var(--font-hint)', fontSize: '13px', color: 'var(--color-pencil)', margin: 0 }}>
          {guestCount} guests{deliveryTime ? ` · ${deliveryTime}` : ''}
        </p>
        {syncError && (
          <p style={{ fontFamily: 'var(--font-hint)', fontSize: '12px', color: 'var(--color-ink)', marginTop: '8px' }}>{syncError}</p>
        )}
      </div>

      <div style={{ padding: '8px 16px' }}>
        <TableRing guestCount={guestCount} members={tableMembers} />
      </div>

      <div style={{ display: 'flex', gap: '10px', padding: '12px 24px' }}>
        <button
          onClick={() => setFoodOpen(true)}
          style={{ flex: 1, padding: '14px 8px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', background: 'var(--color-ink)', color: 'var(--color-paper)', fontFamily: 'var(--font-body)', fontSize: '15px', cursor: 'pointer' }}
        >
          Food
        </button>
        <button
          onClick={() => setMemberOpen(true)}
          style={{ flex: 1, padding: '14px 8px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', background: 'var(--color-paper)', color: 'var(--color-ink)', fontFamily: 'var(--font-body)', fontSize: '15px', cursor: 'pointer' }}
        >
          Members ({members.length})
        </button>
        {isLive && (
          <button
            onClick={() => setInviteOpen(true)}
            style={{ flex: 1, padding: '14px 8px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', background: 'var(--color-paper)', color: 'var(--color-ink)', fontFamily: 'var(--font-body)', fontSize: '15px', cursor: 'pointer' }}
          >
            Invite
          </button>
        )}
        {isLive && (
          <button
            onClick={() => setChatOpen(true)}
            style={{ flex: 1, padding: '14px 8px', border: '2px solid var(--color-ink)', borderRadius: 'var(--radius)', background: 'var(--color-paper)', color: 'var(--color-ink)', fontFamily: 'var(--font-body)', fontSize: '15px', cursor: 'pointer' }}
          >
            Chat
          </button>
        )}
      </div>

      <div style={{ padding: '4px 24px' }}>
        <button
          onClick={() => navigate('/')}
          style={{ width: '100%', padding: '10px', border: 'none', background: 'none', color: 'var(--color-pencil)', fontFamily: 'var(--font-hint)', fontSize: '13px', cursor: 'pointer' }}
        >
          ← Back home
        </button>
      </div>

      <BillBar itemCount={itemCount} total={total} onOpenFood={() => setFoodOpen(true)} />

      <FoodSheet
        open={foodOpen}
        onClose={() => setFoodOpen(false)}
        menus={menus}
        partyItems={partyItems}
        myName={myName}
        onSetMyName={handleSetMyName}
        onAddItem={handleAddItem}
        onDecrementItem={handleDecrementItem}
      />
      <MemberPanel
        open={memberOpen}
        onClose={() => setMemberOpen(false)}
        members={members}
        activities={activities}
        onAddActivity={handleAddActivity}
      />
      <InviteSheet
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        orderId={orderId}
      />
      <ChatSheet
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        orderId={orderId}
        myName={myName}
      />
    </div>
  );
}
