import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import styles from './admin_layout.module.scss';
import { MapFill, GeoAltFill, List, X, ChatSquareQuoteFill, EnvelopePaperFill, EnvelopeOpenFill, CalendarCheckFill } from 'react-bootstrap-icons';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

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
            </div>
          </Col>
          
          <Col md={9} lg={10} className={styles.mainContent}>
            <div className={styles.topbar}>
              <Button variant="outline-secondary" className="d-md-none mb-3" onClick={toggleSidebar}>
                <List size={24} /> Menu
              </Button>
            </div>
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLayout;
