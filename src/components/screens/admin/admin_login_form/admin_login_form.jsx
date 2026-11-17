import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Form, Button, Alert, Spinner, Image } from "react-bootstrap";
import { Eye, EyeSlash, LockFill } from "react-bootstrap-icons";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/utils/image";
import { FONTS } from "@/styles/fonts";
import styles from "./admin_login_form.module.scss";

const AdminLoginForm = ({ onSuccess }) => {
  const { signIn, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const { data, error } = await signIn(email.trim(), password);

      if (error) {
        setErrorMsg(error.message || "Failed to sign in. Please verify your credentials.");
      } else if (data?.user) {
        if (onSuccess) {
          onSuccess(data.user);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const logoUrl = getImageUrl("images/logo.png") || "/logo/logo.png";

  return (
    <>
      <Head>
        <title>Admin Login | Green World Trip</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={`${styles.loginPage} ${FONTS.font1}`}>
        <div className={styles.loginCard}>
          <div className={styles.brandHeader}>
            <Image
              src={logoUrl}
              alt="Green World Trip"
              className={styles.logo}
              onError={(e) => {
                e.currentTarget.src = "/logo/logo.png";
              }}
            />
            <h2 className={FONTS.font2}>Admin Portal</h2>
            <p>Sign in to manage tours, bookings & content</p>
          </div>

          {errorMsg && (
            <Alert variant="danger" dismissible onClose={() => setErrorMsg("")}>
              {errorMsg}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="adminEmail">
              <Form.Label className={styles.formLabel}>Email Address</Form.Label>
              <Form.Control
                type="email"
                required
                autoComplete="email"
                placeholder="admin@greenworldtrip.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                disabled={submitting}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="adminPassword">
              <Form.Label className={styles.formLabel}>Password</Form.Label>
              <div className={styles.passwordWrapper}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputField}
                  disabled={submitting}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Form.Group>

            <Button
              type="submit"
              disabled={submitting || authLoading}
              className={styles.submitBtn}
            >
              {submitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Signing In...
                </>
              ) : (
                <>
                  <LockFill className="me-1" />
                  Sign In
                </>
              )}
            </Button>
          </Form>

          <div className={styles.footerNote}>
            <span>Protected by Supabase Authentication. </span>
            <Link href="/">Back to Website</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginForm;
