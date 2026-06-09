import React, { useState } from "react";
import styles from "./top_header.module.scss";
import CustomContainer from "@/components/ui/custom_container/custom_container";
import {
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
} from "react-bootstrap-icons";
import Link from "next/link";

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

            <Link href={"/"}>test@gmail.com</Link>
          </div>

          <div className={styles.right}>
            <Link href={"/"}>+91 98765 41230</Link>
            <div className={styles.divider}></div>
            <LangDropDown />
          </div>
        </div>
      </CustomContainer>
    </div>
  );
};

export default TopHeader;
