import { Plus_Jakarta_Sans as BodyFont, Playfair_Display as HeadingFont } from "next/font/google";

const bodyFont = BodyFont({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const headingFont = HeadingFont({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const FONTS = {
  font1: bodyFont.className,
  font2: headingFont.className,
};

export const FONT_VARIABLES = `${bodyFont.variable} ${headingFont.variable}`;

export default FONTS;
