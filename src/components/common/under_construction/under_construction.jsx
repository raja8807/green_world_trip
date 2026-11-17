import React from "react";
import Head from "next/head";
import { Image } from "react-bootstrap";
import { TelephoneFill, Whatsapp, EnvelopeFill } from "react-bootstrap-icons";
import { CONTACT_DETAILS } from "@/constants/conatct";
import { getImageUrl } from "@/utils/image";
import { FONTS } from "@/styles/fonts";
import styles from "./under_construction.module.scss";

const UnderConstruction = () => {
  const logoUrl = getImageUrl("images/logo.png") || "/logo/logo.png";

  return (
    <>
      <Head>
        <title>Under Construction | Green World Trip</title>
        <meta
          name="description"
          content="Green World Trip website is currently undergoing scheduled updates. Please contact us for tour bookings and enquiries."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={`${styles.container} ${FONTS.font1}`}>
        <div className={styles.card}>
          <div className={styles.logoWrapper}>
            <Image
              src={logoUrl}
              alt="Green World Trip Logo"
              className={styles.logo}
              onError={(e) => {
                e.currentTarget.src = "/logo/logo.png";
              }}
            />
          </div>

          <div className={styles.badge}>
            <span className={styles.dot}></span>
            <span>Under Construction</span>
          </div>


          <p className={styles.description}>
            Our website is currently undergoing scheduled enhancements to serve
            you better with exceptional holiday packages and seamless bookings.
            We&apos;ll be back very soon!
          </p>

          <p className={styles.footerText}>
            © {new Date().getFullYear()} Green World Trip. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default UnderConstruction;
