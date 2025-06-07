interface NotificationProps {
  message: string;
}

function Notification({ message }: NotificationProps) {
  return (
    <div className="fixed t-[50%] l-[50%] p-5 bg-primary text-white z-10 font-bold rounded-4xl">
      {message}
    </div>
  );
}

export default Notification;
