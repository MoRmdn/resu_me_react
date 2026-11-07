import DocumentShell, { pageMetadata } from "@/components/DocumentShell";
export { viewport } from "@/components/DocumentShell";
export const metadata = pageMetadata("ar");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocumentShell locale="ar">{children}</DocumentShell>;
}
