import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <h1 className={styles.title}>
            <span className={styles.highlight}>DominusX</span> eSIM Platform
          </h1>
          <p className={styles.subtitle}>
            Next-Generation Mobile Data Solutions with Blockchain Rewards
          </p>
          <div className={styles.heroButtons}>
            <Link href="/esims" className={styles.primaryButton}>
              🚀 Get eSIM Now
            </Link>
            <Link href="/dashboard" className={styles.secondaryButton}>
              📊 Dashboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className={styles.features}>
          <h2 className={styles.sectionTitle}>Platform Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>🌐 Global eSIM</h3>
              <p>Instant activation worldwide with Airalo integration</p>
              <Link href="/esims" className={styles.featureLink}>Browse Packages</Link>
            </div>

            <div className={styles.featureCard}>
              <h3>💰 Loyalty Rewards</h3>
              <p>Free top-up every 10th purchase + crypto tokens</p>
              <Link href="/rewards" className={styles.featureLink}>View Rewards</Link>
            </div>

            <div className={styles.featureCard}>
              <h3>🤖 AI Insights</h3>
              <p>Smart usage analysis and cost optimization</p>
              <Link href="/ai-insights" className={styles.featureLink}>Get Insights</Link>
            </div>

            <div className={styles.featureCard}>
              <h3>⚡ Auto Top-Up</h3>
              <p>Never run out of data with smart auto-recharge</p>
              <Link href="/settings" className={styles.featureLink}>Configure</Link>
            </div>

            <div className={styles.featureCard}>
              <h3>🏢 Enterprise</h3>
              <p>White-label solutions for businesses</p>
              <Link href="/enterprise" className={styles.featureLink}>Learn More</Link>
            </div>

            <div className={styles.featureCard}>
              <h3>📱 Mobile App</h3>
              <p>Native iOS and Android applications</p>
              <Link href="/mobile-app" className={styles.featureLink}>Download</Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.actionGrid}>
            <Link href="/esims" className={styles.actionCard}>
              <h3>🛒 Buy eSIM</h3>
              <p>Browse and purchase data packages</p>
            </Link>

            <Link href="/dashboard" className={styles.actionCard}>
              <h3>📊 My Account</h3>
              <p>Manage your eSIMs and settings</p>
            </Link>

            <Link href="/rewards" className={styles.actionCard}>
              <h3>🎁 Rewards</h3>
              <p>Check your tokens and loyalty status</p>
            </Link>

            <Link href="/support" className={styles.actionCard}>
              <h3>💬 Support</h3>
              <p>Get help and contact support</p>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h4>DominusX Tech</h4>
              <p>Next-generation mobile data solutions</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Platform</h4>
              <Link href="/esims">eSIM Store</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/rewards">Rewards</Link>
            </div>
            <div className={styles.footerSection}>
              <h4>Support</h4>
              <Link href="/support">Help Center</Link>
              <Link href="/enterprise">Enterprise</Link>
              <Link href="/mobile-app">Mobile App</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2025 DominusX Tech. Powered by S.O.L. Consciousness.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
