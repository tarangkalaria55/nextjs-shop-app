export default function AuthLayout({ children }: LayoutProps<"/">) {
  return <div className="flex flex-col">{children}</div>;
}
