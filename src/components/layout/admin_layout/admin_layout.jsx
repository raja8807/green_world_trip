import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Row, Col, Nav, Button, Spinner } from 'react-bootstrap';
import styles from './admin_layout.module.scss';
import { 
  MapFill, 
  GeoAltFill, 
  List, 
  X, 
  ChatSquareQuoteFill, 
  EnvelopePaperFill, 
  EnvelopeOpenFill, 
  CalendarCheckFill,
  BoxArrowRight,
  BoxArrowUpRight,
  PersonCircle
} from 'react-bootstrap-icons';
import { useAuth } from '@/context/AuthContext';
import AdminLoginForm from '@/components/screens/admin/admin_login_form/admin_login_form';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const isLoginPage = router.pathname === '/admin/login';

  // If on login page, render child component directly without admin layout chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while verifying user session
  if (loading) {
    return (
      <div 
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '16px', 
          backgroundColor: '#f4f6f9' 
        }}
      >
        <Spinner animation="border" variant="success" />
        <span className="text-muted small">Checking admin authentication...</span>
      </div>
    );
  }

  // If not authenticated, directly render the AdminLoginForm!
  // No blank page! No redirect errors!
  if (!user) {
    return <AdminLoginForm onSuccess={() => router.replace(router.asPath)} />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className={styles.adminLayout}>
      <Container fluid className="px-0">
        <Row className="g-0">
          {/* Backdrop for mobile */}
          {isSidebarOpen && <div className={styles.backdrop} onClick={closeSidebar}></div>}

          <Col md={3} lg={2} className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
            <div className={styles.sidebarSticky}>
              <div className="d-flex justify-content-between align-items-center mb-4 pe-3">
                <h4 className={`${styles.sidebarTitle} mb-0`}>Admin Panel</h4>
                <Button variant="link" className="d-md-none text-dark p-0" onClick={closeSidebar}>
                  <X size={28} />
                </Button>
              </div>
              <Nav className="flex-column px-3">
                <Link href="/admin/tours" onClick={closeSidebar} className={`${styles.navLink} ${router.pathname.startsWith('/admin/tours') ? styles.active : ''}`}>
                  <MapFill className="me-2" /> Tours
                </Link>
                <Link href="/admin/top-destinations" onClick={closeSidebar} className={`${styles.navLink} ${router.pathname.startsWith('/admin/top-destinations') ? styles.active : ''}`}>
                  <GeoAltFill className="me-2" /> Top Destinations
                </Link>
                <Link href="/admin/testimonials" onClick={closeSidebar} className={`${styles.navLink} ${router.pathname.startsWith('/admin/testimonials') ? styles.active : ''}`}>
                  <ChatSquareQuoteFill className="me-2" /> Testimonials
                </Link>
                <Link href="/admin/enquiries" onClick={closeSidebar} className={`${styles.navLink} ${router.pathname.startsWith('/admin/enquiries') ? styles.active : ''}`}>
                  <EnvelopePaperFill className="me-2" /> Enquiries
                </Link>
                <Link href="/admin/contact-messages" onClick={closeSidebar} className={`${styles.navLink} ${router.pathname.startsWith('/admin/contact-messages') ? styles.active : ''}`}>
                  <EnvelopeOpenFill className="me-2" /> Contact Msgs
                </Link>
                <Link href="/admin/bookings" onClick={closeSidebar} className={`${styles.navLink} ${router.pathname.startsWith('/admin/bookings') ? styles.active : ''}`}>
                  <CalendarCheckFill className="me-2" /> Bookings
                </Link>
              </Nav>

              <div className={styles.sidebarFooter}>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleSignOut}
                >
                  <BoxArrowRight /> Sign Out
                </Button>
              </div>
            </div>
          </Col>
          
          <Col md={9} lg={10} className={styles.mainContent}>
            <div className={styles.topbar}>
              <div className={styles.topbarLeft}>
                <Button variant="outline-secondary" className="d-md-none" onClick={toggleSidebar}>
                  <List size={22} />
                </Button>
              </div>

              <div className={styles.topbarRight}>
                <Link 
                  href="/" 
                  target="_blank" 
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                >
                  <BoxArrowUpRight size={13} /> View Website
                </Link>

                <div className={styles.userBadge}>
                  <PersonCircle size={18} className="text-muted" />
                  <span>{user?.email || 'Admin'}</span>
                </div>

                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className={styles.logoutBtn}
                  onClick={handleSignOut}
                >
                  <BoxArrowRight /> Logout
                </Button>
              </div>
            </div>
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLayout;
