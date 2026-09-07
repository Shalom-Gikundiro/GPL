import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { miscApi } from '../api';
import useReveal from '../hooks/useReveal';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const revealRef = useReveal();

  useEffect(() => {
    miscApi.plans().then(setPlans).catch(() => setPlans([]));
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> / Pricing</div>
          <h1>Simple, Flexible Pricing</h1>
          <p>Choose the plan that works best for you. Cancel anytime.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-4">
            {plans.map((p) => (
              <div className={`price-card ${p.popular ? 'popular' : ''}`} key={p.id}>
                {p.popular && <span className="popular-tag">⭐ Most Popular</span>}
                <h3>{p.name}</h3>
                <div className="price">${p.price}<span className="period">/{p.period}</span></div>
                <ul className="price-features">
                  {p.features.map((f, i) => (
                    <li key={i}><span className="check">✔</span> {f}</li>
                  ))}
                </ul>
                <Link to="/register" className={`btn ${p.popular ? 'btn-primary' : p.id === 4 ? 'btn-accent' : 'btn-outline'}`} style={{ width: '100%', justifyContent: 'center' }}>
                  Start {p.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-head"><span className="tag">Payment Methods</span><h2>Pay Your Way</h2><p>We accept a wide range of secure payment options.</p></div>
          <div className="grid grid-3" ref={revealRef}>
            <div className="card reveal"><div className="icon icon-blue">📱</div><h3>Mobile Money</h3><p>Pay easily with MTN Mobile Money, M-Pesa, and more.</p><p style={{ marginTop: '10px', fontWeight: 700, color: 'var(--primary)' }}>📞 0791160529</p></div>
            <div className="card reveal"><div className="icon icon-green">💳</div><h3>Credit & Debit Cards</h3><p>Visa, Mastercard, Maestro - all major cards accepted.</p></div>
            <div className="card reveal"><div className="icon icon-orange">💰</div><h3>Digital Wallets</h3><p>PayPal, Apple Pay, Google Pay, Stripe, Flutterwave, Paystack.</p></div>
            <div className="card reveal"><div className="icon icon-purple">🏦</div><h3>Bank Transfer</h3><p>Direct bank transfer - secure and reliable.</p></div>
            <div className="card reveal"><div className="icon icon-red">₿</div><h3>Cryptocurrency</h3><p>Bitcoin, Ethereum, USDT, BNB, Solana.</p></div>
            <div className="card reveal"><div className="icon icon-cyan">🔒</div><h3>100% Secure</h3><p>All payments encrypted with SSL. PCI-DSS compliant.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
