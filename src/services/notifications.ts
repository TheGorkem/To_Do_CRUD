import type { Todo } from "@/interfaces/todo";

const canUseNotifications = () =>
  typeof window !== "undefined" && "Notification" in window;

export const getNotificationPermission = (): NotificationPermission => {
  if (!canUseNotifications()) return "denied";
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!canUseNotifications()) return "denied";
  return Notification.requestPermission();
};

export const sendReminderNotification = (todo: Todo): boolean => {
  if (!canUseNotifications()) return false;
  if (Notification.permission !== "granted") return false;

  const title = "Gorev hatirlatici";
  const body = todo.description
    ? `${todo.title} - ${todo.description}`
    : todo.title;

  new Notification(title, { body });
  return true;
};
