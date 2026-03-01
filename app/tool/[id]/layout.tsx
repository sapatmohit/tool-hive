import { getAllTools } from "@/services/browseService";

export async function generateStaticParams() {
    const tools = await getAllTools();
    return tools.map((tool) => ({
        id: tool.id,
    }));
}

export default function ToolLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
