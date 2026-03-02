import ProtectedLayout from "@/components/ProtectedLayout";

export default function MyToolsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ProtectedLayout>{children}</ProtectedLayout>;
}
