import { SVGProps } from "react";

export const AppLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
    <path d="M2 17l10 5 10-5"></path>
    <path d="M2 12l10 5 10-5"></path>
  </svg>
);

export const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" {...props}>
        <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.686H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.002-.002-38.334 29.55-.003.004c23.7,19.13,57.73,29.58,90.5,29.58 26.507 0 49.99-8.52 66.49-22.953l-3.214-4.818-4.173-6.425c-8.625 5.8-20.085 9.22-33.41 9.22-24.552 0-45.15-16.18-52.58-38.047l-.002-.01-44.22 2.13-.003.01c13.37,26.4,41.4,45.2,74,45.2 21.99 0 38.93-7.39 51.42-18.91l-3.21-4.816-4.96-7.43c-3.14,2.2-7.03,3.8-11.45,4.9-10.27,2.5-21.53,3.9-33.41,3.9-32.74,0-60.46-24.3-60.46-57.2 0-32.9,27.72-57.2,60.46-57.2 24.13,0,40.42,16.1,44.9,20.9l-30.86,30.2z" />
    </svg>
);