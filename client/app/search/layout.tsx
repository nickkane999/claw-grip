import Search from "./Search";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <h1>Search</h1>
      </div>

      <div>
        <Search />

        <div>{children}</div>
      </div>
    </>
  );
}
