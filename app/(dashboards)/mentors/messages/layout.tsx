import { SocketProvider } from "#/libs_schemas/context/socket-context";

export default function MessagesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SocketProvider namespace="/messages">
      {children}
    </SocketProvider>
  );
}
