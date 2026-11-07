import DocumentShell, { pageMetadata } from "@/components/DocumentShell";
export { viewport } from "@/components/DocumentShell";
export const metadata = pageMetadata("en");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocumentShell locale="en">{children}</DocumentShell>;
}
