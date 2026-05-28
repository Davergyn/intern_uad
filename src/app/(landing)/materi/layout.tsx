import React from "react";

export { metadata } from "./metadata";

export default function MateriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
