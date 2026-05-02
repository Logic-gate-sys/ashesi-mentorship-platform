import { SocketProvider } from "#libs-schemas/context/socket-context";

export default function FeedbacksLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SocketProvider namespace="/sessions">
      {children}
    </SocketProvider>
  );
}
