import { SocketProvider } from "#libs-schemas/context/socket-context";

export default function MeetingsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SocketProvider namespace="/sessions">
      {children}
    </SocketProvider>
  );
}
