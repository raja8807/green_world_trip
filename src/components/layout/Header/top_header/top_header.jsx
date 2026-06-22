import React, { useState } from "react";
import styles from "./top_header.module.scss";
import CustomContainer from "@/components/ui/custom_container/custom_container";
import {
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  EnvelopeFill,
  TelephoneFill,
} from "react-bootstrap-icons";
import Link from "next/link";
import { CONTACT_DETAILS } from "@/constants/conatct";

const LangDropDown = () => {
  const languages = ["ENG", "HIN"];

  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  const [showDropDown, setShowDropDown] = useState(false);

  return (
    <div className={styles.LangDropDown}>
      <p
        onClick={() => {
          setShowDropDown((prev) => !prev);
        }}
      >
        {currentLanguage} <ChevronDown />
      </p>
      {showDropDown && (
        <div className={styles.dropDown}>
          {languages.map((lang) => {
            return (
              <p
                key={lang}
                onClick={() => {
                  setCurrentLanguage(lang);
                  setShowDropDown(false);
                }}
              >
                {lang}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TopHeader = () => {
  return (
    <div className={styles.TopHeader}>
      <CustomContainer lg>
        <div className={styles.wrap}>
          <div className={styles.left}>
            <div className={styles.soc}>
              <Facebook />
              <Instagram />
              <Linkedin />
            </div>
            <div className={styles.divider}></div>

            <a href={`mailto:${CONTACT_DETAILS.emails[0]}`} className={styles.contactLink}>
              <EnvelopeFill className={styles.iconOnly} />
              <span className={styles.textOnly}>{CONTACT_DETAILS.emails[0]}</span>
            </a>
          </div>

          <div className={styles.right}>
            <a href={`tel:+${CONTACT_DETAILS.phone1.number}`} className={styles.contactLink}>
              <TelephoneFill className={styles.iconOnly} />
              <span className={styles.textOnly}>{CONTACT_DETAILS.phone1.text}</span>
            </a>
            <div className={styles.divider}></div>
            <LangDropDown />
          </div>
        </div>
      </CustomContainer>
    </div>
  );
};

export default TopHeader;
