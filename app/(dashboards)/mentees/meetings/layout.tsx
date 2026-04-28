import { SocketProvider } from "#/libs_schemas/context/socket-context";

export default function MeetingsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SocketProvider namespace="/sessions">
      {children}
    </SocketProvider>
  );
}
