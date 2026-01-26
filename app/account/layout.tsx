import UserLayoutClient from "@/components/account/UserLayoutClient";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <UserLayoutClient>{children}</UserLayoutClient>;
}
