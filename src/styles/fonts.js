import { Manrope as Font1 } from "next/font/google";
import { Oxanium as Font2 } from "next/font/google";
// import localFont from "next/font/local";

const font1 = Font1({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-primary",
});
const font2 = Font2({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-primary",
});

// const sunsive = localFont({
//   src: [
//     {
//       path: "../../public/fonts/sunsive-medium.woff",
//       weight: "500",
//       style: "normal",
//     },
//   ],
//   variable: "--font-sunsive",
// });

export const FONTS = {
  font1: font1.className,
  font2: font2.className,
  // font2: sunsive.className,
};

// export const FONT_VARIABLES = `${font1.variable} ${sunsive.variable}`;

export default FONTS;
