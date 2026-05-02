import { SocketProvider } from "#libs-schemas/context/socket-context";

export default function MentorsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SocketProvider namespace="/requests">
      {children}
    </SocketProvider>
  );
}
