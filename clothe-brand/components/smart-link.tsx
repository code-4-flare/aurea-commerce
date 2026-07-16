import Link from "next/link";

import { isExternalHttpUrl, type UtmParameters, withUtmParameters } from "@/lib/links";

type SmartLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  utm?: UtmParameters;
  onClick?: () => void;
};

export default function SmartLink({ href, children, className, ariaLabel, utm, onClick }: SmartLinkProps) {
  const resolvedHref = utm ? withUtmParameters(href, utm) : href;

  if (isExternalHttpUrl(resolvedHref)) {
    return (
      <a
        href={resolvedHref}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={resolvedHref} className={className} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </Link>
  );
}
