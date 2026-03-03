import ProtectedLayout from "@/components/ProtectedLayout";

export default function RequestsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ProtectedLayout>{children}</ProtectedLayout>;
}
