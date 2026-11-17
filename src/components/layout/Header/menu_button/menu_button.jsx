import React, { useState } from "react";
import {
  ChevronDown,
  EnvelopeAtFill,
  GeoAlt,
  GeoAltFill,
  List,
  Telephone,
  TelephoneFill,
} from "react-bootstrap-icons";
import styles from "./menu_button.module.scss";
import { Offcanvas } from "react-bootstrap";

import Link from "next/link";
import { CONTACT_DETAILS } from "@/constants/conatct";
import Logo from "@/components/common/logo/logo";
import FONTS from "@/styles/fonts";
import { PAGES } from "@/constants/constants";

const NavItem = ({ item, setShowDrawer }) => {
  const [showDropDown, setShowDropDown] = useState(false);

  if (item.dropdown) {
    return (
      <div>
        <p
          onClick={() => {
            setShowDropDown((prev) => !prev);
          }}
          className={showDropDown ? styles.activeDropdownParent : ""}
        >
          {item.title}{" "}
          <ChevronDown
            style={{
              transform: showDropDown ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </p>

        {showDropDown && (
          <div className={styles.dropdown}>
            {item.dropdown.map((dd) => {
              return (
                <NavItem
                  key={dd.title}
                  item={dd}
                  setShowDrawer={setShowDrawer}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Link
        href={item.href || "#"}
        onClick={() => {
          setShowDrawer(false);
        }}
      >
        {item.title}
      </Link>
    </div>
  );
};

const RightMenu = ({ pages }) => {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <div className={styles.RightMenu}>


      <div className={styles.MenuButton}>
        <List
          onClick={() => {
            setShowDrawer(true);
          }}
        />

        <Offcanvas
          show={showDrawer}
          onHide={() => {
            setShowDrawer(false);
          }}
          placement="start"
          className={styles.drawer}
        >
          <Offcanvas.Header closeButton className={styles.drawerHeader}>
            <Logo />
          </Offcanvas.Header>

          <Offcanvas.Body className={styles.drawerBody}>
            
              <nav className={styles.navSm}>
                <ul>
                  {pages.map((page) => {
                    return (
                      <NavItem
                        key={page.title}
                        item={page}
                        setShowDrawer={setShowDrawer}
                      />
                    );
                  })}
                </ul>
              </nav>

            <div className={styles.drawerFooter}>
              <Link 
                href="/contact" 
                className={styles.mobileCtaBtn}
                onClick={() => setShowDrawer(false)}
              >
                Plan My Trip
              </Link>

              <div className={styles.contactDetails}>
                <a href={`tel:+${CONTACT_DETAILS.phone1.number}`} className={styles.contactItem}>
                  <TelephoneFill />
                  <span>{CONTACT_DETAILS.phone1.text}</span>
                </a>
                <a href={`mailto:${CONTACT_DETAILS.emails[0]}`} className={styles.contactItem}>
                  <EnvelopeAtFill />
                  <span>{CONTACT_DETAILS.emails[0]}</span>
                </a>
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
};

export default RightMenu;
