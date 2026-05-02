import { SocketProvider } from "#libs-schemas/context/socket-context";

export default function SettingsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SocketProvider namespace="/profile">
      {children}
    </SocketProvider>
  );
}
