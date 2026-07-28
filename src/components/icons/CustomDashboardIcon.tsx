import { SVGProps } from "react"

export function CustomDashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="7" height="10" rx="1.5" />
      <rect x="14" y="3" width="7" height="10" rx="1.5" />
      <rect x="3" y="16" width="18" height="5" rx="1.5" />
    </svg>
  )
}
