import { SocketProvider } from "#/libs_schemas/context/socket-context";

export default function SettingsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SocketProvider namespace="/profile">
      {children}
    </SocketProvider>
  );
}
