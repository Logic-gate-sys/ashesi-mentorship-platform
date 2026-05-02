import { SocketProvider } from "#libs-schemas/context/socket-context";

export default function MessagesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SocketProvider namespace="/conversation">
      {children}
    </SocketProvider>
  );
}
