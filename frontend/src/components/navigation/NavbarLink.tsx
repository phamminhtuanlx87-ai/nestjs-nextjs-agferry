"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}
export default function NavbarLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <div>
      <Link
        href={href}
        className={`nav__link relative px-3 py-2 transition-all 
           rounded-lg 
          ${isActive ? "is-active" : ""}`}
      >
        {children}
      </Link>
    </div>
  );
}
