import { useEffect, useState } from "react";
import CustomContainer from "@/components/ui/custom_container/custom_container";
import styles from "./Header.module.scss";

import Link from "next/link";
import {
  BellFill,
  ChevronDown,
  ChevronRight,
  EnvelopeAt,
  EnvelopeAtFill,
  TelephoneFill,
} from "react-bootstrap-icons";
import TopHeader from "./top_header/top_header";
import Logo from "@/components/common/logo/logo";
import { PAGES } from "@/constants/constants";
import RightMenu from "./menu_button/menu_button";

const DropDownItem = ({ item, setParentDropdown }) => {
  const [showSubDropDown, setShowSubDropDown] = useState(false);

  if (item.dropdown) {
    return (
      <div
        className={styles.subDropdown}
        onMouseEnter={() => {
          setShowSubDropDown(true);
        }}
        onMouseLeave={() => {
          setShowSubDropDown(false);
        }}
      >
        <p href={item.href || "#"}>
          {item.title}
          <ChevronRight />
        </p>
        {showSubDropDown && (
          <div className={styles.subDropdownWrap}>
            <div className={`${styles.subDropdown}`}>
              {item.dropdown.map((dd) => {
                return (
                  <DropDownItem
                    item={dd}
                    key={dd.title}
                    setParentDropdown={setParentDropdown}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      onClick={() => {
        setParentDropdown(false);
      }}
    >
      {item.title}
    </Link>
  );
};

const NavItem = ({ item }) => {
  const [showDropDown, setShowDropDown] = useState(false);

  if (item.dropdown) {
    return (
      <li
        onMouseEnter={() => {
          setShowDropDown(true);
        }}
        onMouseLeave={() => {
          setShowDropDown(false);
        }}
      >
        <Link href={item.href || "#"}>
          {item.title}
          &nbsp;
          <ChevronDown />
        </Link>
        {showDropDown && (
          <div className={styles.dropdownWrap}>
            <div className={`${styles.dropdown}`}>
              {item.dropdown.map((dd) => {
                return (
                  <DropDownItem
                    item={dd}
                    key={dd.title}
                    setParentDropdown={setShowDropDown}
                  />
                );
              })}
            </div>
          </div>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link href={item.href || "#"}>{item.title}</Link>
    </li>
  );
};

const Header = () => {
  return (
    <header className={styles.header} data-aos="fade-down">
      <TopHeader />
      <div className={styles.mainHead}>
        <CustomContainer lg>
          <div className={styles.wrap}>
            <div className={styles.left}>
              <Logo />
              <nav className={styles.navLg}>
                <ul>
                  {PAGES.map((page) => {
                    return <NavItem key={page.title} item={page} />;
                  })}
                </ul>
              </nav>
            </div>
            <div className={styles.right}>
              <RightMenu pages={PAGES} />
            </div>
          </div>
        </CustomContainer>
      </div>
    </header>
  );
};

export default Header;
