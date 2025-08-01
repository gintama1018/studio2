import type { SVGProps } from "react";

export function BatcompLogo(props: SVGProps<SVGSVGElement>) {
  return (
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
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
      <path d="M21 12c0-4.97-4.03-9-9-9" />
      <path d="M3 12c0 4.97 4.03 9 9 9" />
    </svg>
  );
}
