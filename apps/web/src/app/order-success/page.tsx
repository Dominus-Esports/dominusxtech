'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface OrderDetails {
  id: string;
  status: string;
  qr_code?: string;
  activation_code?: string;
  package: {
    name: string;
    description: string;
    price: number;
    data: string;
    validity: string;
    country: string;
  };
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/order-details?orderId=${id}`);
      const data = await response.json();

      if (data.order) {
        setOrderDetails(data.order);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError('Failed to load order details');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>❌ Order Error</h1>
          <p>{error || 'Unable to load order details'}</p>
          <Link href="/esims" className={styles.backButton}>
            ← Back to eSIM Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Success Header */}
      <header className={styles.header}>
        <div className={styles.successIcon}>✅</div>
        <h1 className={styles.title}>Order Successful!</h1>
        <p className={styles.subtitle}>
          Your eSIM is ready for activation
        </p>
      </header>

      {/* Order Details */}
      <div className={styles.orderCard}>
        <h2 className={styles.sectionTitle}>Order Details</h2>

        <div className={styles.orderInfo}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Order ID:</span>
            <span className={styles.value}>{orderDetails.id}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Status:</span>
            <span className={styles.status}>{orderDetails.status}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Package:</span>
            <span className={styles.value}>{orderDetails.package.name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Data:</span>
            <span className={styles.value}>{orderDetails.package.data}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Validity:</span>
            <span className={styles.value}>{orderDetails.package.validity}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Price:</span>
            <span className={styles.value}>${orderDetails.package.price}</span>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      {orderDetails.qr_code && (
        <div className={styles.qrSection}>
          <h2 className={styles.sectionTitle}>eSIM QR Code</h2>
          <div className={styles.qrContainer}>
            <img
              src={orderDetails.qr_code}
              alt="eSIM QR Code"
              className={styles.qrCode}
            />
            <p className={styles.qrInstructions}>
              Scan this QR code with your phone's camera to activate your eSIM
            </p>
          </div>
        </div>
      )}

      {/* Activation Code */}
      {orderDetails.activation_code && (
        <div className={styles.activationSection}>
          <h2 className={styles.sectionTitle}>Manual Activation</h2>
          <div className={styles.activationCode}>
            <span className={styles.codeLabel}>Activation Code:</span>
            <span className={styles.code}>{orderDetails.activation_code}</span>
          </div>
          <p className={styles.activationInstructions}>
            If QR code doesn't work, manually enter this code in your phone's eSIM settings
          </p>
        </div>
      )}

      {/* Next Steps */}
      <div className={styles.nextSteps}>
        <h2 className={styles.sectionTitle}>Next Steps</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Scan QR Code</h3>
            <p>Use your phone's camera to scan the QR code above</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Add eSIM</h3>
            <p>Follow your phone's prompts to add the eSIM to your device</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Activate</h3>
            <p>Enable the eSIM in your phone's settings and start using data</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3>Enjoy!</h3>
            <p>Your eSIM is now active and ready for use worldwide</p>
          </div>
        </div>
      </div>

      {/* Support & Navigation */}
      <div className={styles.supportSection}>
        <h2 className={styles.sectionTitle}>Need Help?</h2>
        <div className={styles.supportGrid}>
          <Link href="/support" className={styles.supportCard}>
            <h3>📞 Contact Support</h3>
            <p>Get help with activation or troubleshooting</p>
          </Link>
          <Link href="/dashboard" className={styles.supportCard}>
            <h3>📊 My Account</h3>
            <p>View your orders and manage your eSIMs</p>
          </Link>
          <Link href="/esims" className={styles.supportCard}>
            <h3>🛒 Buy More</h3>
            <p>Purchase additional eSIM packages</p>
          </Link>
          <Link href="/rewards" className={styles.supportCard}>
            <h3>🎁 Rewards</h3>
            <p>Check your loyalty status and rewards</p>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <Link href="/" className={styles.homeButton}>
          🏠 Back to Home
        </Link>
        <p className={styles.footerText}>
          Thank you for choosing DominusX eSIM!
        </p>
      </footer>
    </div>
  );
}
