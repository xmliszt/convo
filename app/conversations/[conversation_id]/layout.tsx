type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout(props: LayoutProps) {
  return <>{props.children}</>;
}
