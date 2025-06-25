"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            // Base toast (info, neutral)
            "group toast flex items-center gap-4 rounded-lg border border-brand-200 dark:border-brand-900 bg-brand-50 dark:bg-brand-900 text-brand-900 dark:text-brand-50 px-5 py-4 min-h-[56px] max-w-[420px] font-medium",
          success:
            // Success toast: fondo verde claro, borde verde, texto verde oscuro
            "group toast flex items-center gap-4 rounded-lg border border-brand-200 dark:border-brand-700 bg-brand-100 dark:bg-brand-900 text-brand-900 dark:text-brand-100 px-5 py-4 min-h-[56px] max-w-[420px] font-medium",
          error:
            // Error toast: fondo blanco, borde y texto rojo, sin gradiente ni sombra
            "group toast flex items-center gap-4 rounded-lg border border-destructive bg-white dark:bg-brand-900 text-destructive dark:text-destructive-foreground px-5 py-4 min-h-[56px] max-w-[420px] font-medium",
          description: "text-brand-700 dark:text-brand-200 text-sm mt-1",
          actionButton:
            "bg-brand-600 text-white rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-brand-700 transition border border-brand-600/80",
          cancelButton:
            "bg-brand-100 text-brand-900 dark:bg-brand-800 dark:text-brand-100 rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-brand-200 dark:hover:bg-brand-700 transition border border-brand-200 dark:border-brand-800",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
