import { SocketProvider } from "#libs-schemas/context/socket-context";

export default function RequestLayout({ children,}: Readonly<{ children: React.ReactNode}>) {
  return (
        <SocketProvider namespace="/requests">
          {children}
        </SocketProvider>
  );
}
