'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  data: string;
  validity: string;
  country: string;
  region: string;
}

interface LoyaltyStatus {
  topUps: number;
  nextFreeTopUp: number;
  isEligible: boolean;
}

export default function ESIMsPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [email, setEmail] = useState('');
  const [loyaltyStatus, setLoyaltyStatus] = useState<LoyaltyStatus | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchPackages();
    fetchLoyaltyStatus();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/airalo?action=packages');
      const data = await response.json();
      setPackages(data.packages || []);
    } catch (err) {
      setError('Failed to load packages');
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoyaltyStatus = async () => {
    try {
      const response = await fetch('/api/loyalty');
      const data = await response.json();
      setLoyaltyStatus(data);
    } catch (err) {
      console.error('Error fetching loyalty status:', err);
    }
  };

  const handlePurchase = async (pkg: Package) => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setPurchasing(true);
    setError(null);

    try {
      const response = await fetch('/api/airalo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: pkg.id,
          customerEmail: email.trim(),
        }),
      });

      const data = await response.json();

      if (data.order) {
        // Redirect to order success page
        window.location.href = `/order-success?orderId=${data.order.id}`;
      } else {
        setError('Failed to create order');
      }
    } catch (err) {
      setError('Failed to process purchase');
      console.error('Error creating order:', err);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading eSIM packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back to Home
        </Link>
        <h1 className={styles.title}>🌐 Global eSIM Store</h1>
        <p className={styles.subtitle}>
          Instant activation worldwide with Airalo integration
        </p>
      </header>

      {/* Loyalty Status */}
      {loyaltyStatus && (
        <div className={styles.loyaltyCard}>
          <h3>🎁 Loyalty Program</h3>
          <p>
            You've made {loyaltyStatus.topUps} top-ups.
            {loyaltyStatus.isEligible ? (
              <span className={styles.eligible}> You're eligible for a FREE top-up!</span>
            ) : (
              <span> {loyaltyStatus.nextFreeTopUp - loyaltyStatus.topUps} more to get a free top-up.</span>
            )}
          </p>
        </div>
      )}

      {/* Email Input */}
      <div className={styles.emailSection}>
        <h3>📧 Enter Your Email</h3>
        <p>We'll send your eSIM activation details to this email</p>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.emailInput}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {/* Packages Grid */}
      <div className={styles.packagesSection}>
        <h2 className={styles.sectionTitle}>Available Packages</h2>
        <div className={styles.packagesGrid}>
          {packages.map((pkg) => (
            <div key={pkg.id} className={styles.packageCard}>
              <div className={styles.packageHeader}>
                <h3 className={styles.packageName}>{pkg.name}</h3>
                <div className={styles.packagePrice}>${pkg.price}</div>
              </div>

              <div className={styles.packageDetails}>
                <div className={styles.detail}>
                  <span className={styles.label}>📊 Data:</span>
                  <span className={styles.value}>{pkg.data}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>⏰ Validity:</span>
                  <span className={styles.value}>{pkg.validity}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>🌍 Region:</span>
                  <span className={styles.value}>{pkg.region}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>🏳️ Country:</span>
                  <span className={styles.value}>{pkg.country}</span>
                </div>
              </div>

              <p className={styles.packageDescription}>{pkg.description}</p>

              <button
                onClick={() => handlePurchase(pkg)}
                disabled={purchasing || !email.trim()}
                className={styles.purchaseButton}
              >
                {purchasing ? 'Processing...' : '🚀 Buy Now'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why Choose DominusX eSIM?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <h3>⚡ Instant Activation</h3>
            <p>Get connected immediately after purchase</p>
          </div>
          <div className={styles.feature}>
            <h3>🌍 Global Coverage</h3>
            <p>Works in 190+ countries worldwide</p>
          </div>
          <div className={styles.feature}>
            <h3>💰 Loyalty Rewards</h3>
            <p>Earn free top-ups and crypto tokens</p>
          </div>
          <div className={styles.feature}>
            <h3>📱 No Physical SIM</h3>
            <p>Digital activation, no shipping required</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>Need Help?</h4>
            <Link href="/support">Contact Support</Link>
            <Link href="/dashboard">My Account</Link>
          </div>
          <div className={styles.footerSection}>
            <h4>Learn More</h4>
            <Link href="/rewards">Loyalty Program</Link>
            <Link href="/ai-insights">Usage Analytics</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
