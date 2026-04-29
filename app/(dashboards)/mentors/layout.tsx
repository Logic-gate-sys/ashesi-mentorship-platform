import { SocketProvider } from "#/libs_schemas/context/socket-context";

export default function MentorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SocketProvider namespace="/requests">
      {children}
    </SocketProvider>
  );
}
