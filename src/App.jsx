
import React, { useEffect, useState } from 'react';
import { supabase } from './supabase.js';
import './index.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [year, setYear] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [assistance, setAssistance] = useState([]);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setLoading(false);
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (!session) {
          setRole('');
          setLoading(false);
        }
      });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    async function loadDashboard() {
      setLoading(true);
      setError('');

      const { data: profile, error: profileError } =
        await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

      if (profileError) {
        setError('প্রোফাইল পাওয়া যায়নি: ' + profileError.message);
        setLoading(false);
        return;
      }

      setRole(profile.role);

      const [tx, aid, members] = await Promise.all([
        supabase.from('transactions')
          .select('amount, transaction_type, category, transaction_date, ward'),
        supabase.from('assistance')
          .select('amount, date, ward'),
        supabase.from('members')
          .select('*', { count: 'exact', head: true })
      ]);

      if (tx.error || aid.error || members.error) {
        setError(
          tx.error?.message ||
          aid.error?.message ||
          members.error?.message
        );
        setLoading(false);
        return;
      }

      setTransactions(tx.data || []);
      setAssistance(aid.data || []);
      setMemberCount(members.count || 0);
      setLoading(false);
    }

    loadDashboard();
  }, [session, year]);

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError('লগইন হয়নি: ' + error.message);
      setLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setTransactions([]);
    setAssistance([]);
  }

  const filteredTransactions = transactions.filter(item =>
    year === 'all' ||
    String(item.transaction_date).startsWith(year)
  );

  const filteredAssistance = assistance.filter(item =>
    year === 'all' ||
    String(item.date).startsWith(year)
  );

  const totalIncome = filteredTransactions
    .filter(x => x.transaction_type === 'income')
    .reduce((sum, x) => sum + Number(x.amount || 0), 0);

  const totalDonation = filteredTransactions
    .filter(x =>
      x.transaction_type === 'income' &&
      /দান|অনুদান|donation/i.test(x.category || '')
    )
    .reduce((sum, x) => sum + Number(x.amount || 0), 0);

  const transactionExpense = filteredTransactions
    .filter(x => x.transaction_type === 'expense')
    .reduce((sum, x) => sum + Number(x.amount || 0), 0);

  const assistanceTotal = filteredAssistance
    .reduce((sum, x) => sum + Number(x.amount || 0), 0);

  const totalExpense = transactionExpense + assistanceTotal;
  const cash = totalIncome - totalExpense;

  const wards = [...new Set([
    ...filteredTransactions.map(x => x.ward),
    ...filteredAssistance.map(x => x.ward)
  ].filter(Boolean))].sort();

  if (loading) {
    return <div className="loading">লোড হচ্ছে...</div>;
  }

  if (!session) {
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={login}>
          <h1>কুশাখালী আওয়ামী প্রবাসী ফাউন্ডেশন</h1>
          <p>সদস্য ও প্রশাসনিক লগইন</p>
          <input
            type="email"
            placeholder="আপনার ইমেইল"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="পাসওয়ার্ড"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">লগইন করুন</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>কুশাখালী আওয়ামী প্রবাসী ফাউন্ডেশন</h1>
        <p>মানবতার সেবায় আমরা একসাথে</p>
        <span>{role === 'admin' ? 'প্রশাসক' : 'সদস্য'}</span>
        <button onClick={logout}>লগআউট</button>
      </header>

      <main className="dashboard">
        <div className="dashboard-heading">
          <h2>প্রশাসনিক ড্যাশবোর্ড</h2>
          <select value={year} onChange={e => setYear(e.target.value)}>
            <option value="all">সর্বমোট</option>
            <option value="2024">২০২৪</option>
            <option value="2025">২০২৫</option>
            <option value="2026">২০২৬</option>
            <option value="2027">২০২৭</option>
          </select>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="cards">
          <div className="card">
            <h3>মোট আয়</h3>
            <p>৳ {totalIncome.toLocaleString('en-IN')}</p>
          </div>
          <div className="card">
            <h3>মোট অনুদান</h3>
            <p>৳ {totalDonation.toLocaleString('en-IN')}</p>
          </div>
          <div className="card">
            <h3>মোট ব্যয়</h3>
            <p>৳ {totalExpense.toLocaleString('en-IN')}</p>
          </div>
          <div className="card">
            <h3>বর্তমান ক্যাশ</h3>
            <p>৳ {cash.toLocaleString('en-IN')}</p>
          </div>
          <div className="card">
            <h3>মোট সদস্য</h3>
            <p>{memberCount.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <section className="ward-section">
          <h2>ওয়ার্ডভিত্তিক হিসাব</h2>
          {wards.length === 0 ? (
            <p>এখনো কোনো ওয়ার্ডের হিসাব পাওয়া যায়নি।</p>
          ) : (
            <div className="ward-grid">
              {wards.map(ward => {
                const income = filteredTransactions
                  .filter(x => x.ward === ward &&
                    x.transaction_type === 'income')
                  .reduce((s, x) => s + Number(x.amount || 0), 0);

                const expense = filteredTransactions
                  .filter(x => x.ward === ward &&
                    x.transaction_type === 'expense')
                  .reduce((s, x) => s + Number(x.amount || 0), 0);

                const aid = filteredAssistance
                  .filter(x => x.ward === ward)
                  .reduce((s, x) => s + Number(x.amount || 0), 0);

                return (
                  <div className="ward-card" key={ward}>
                    <h3>{ward} নং ওয়ার্ড</h3>
                    <p>আয়: ৳ {income.toLocaleString('en-IN')}</p>
                    <p>ব্যয়: ৳ {(expense + aid).toLocaleString('en-IN')}</p>
                    <strong>
                      ক্যাশ: ৳ {(income - expense - aid)
                        .toLocaleString('en-IN')}
                    </strong>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer>কুশাখালী আওয়ামী প্রবাসী ফাউন্ডেশন © ২০২৬</footer>
    </div>
  );
}
