import Link from "next/link";

interface CsButtonProps {
  className?: string;
  children: React.ReactNode;
  type?: "link" | "button";
  href?: string;
  rounded?: boolean;
  filled?: boolean;
}

const CsButton = ({
  className,
  children,
  type = "button",
  href,
  rounded = true,
  filled = false,
}: CsButtonProps) => {
  const classNames = [
    "border-2",
    "border-gray-500",
    "hover:border-cs-primary",
    "px-6",
    "py-2",
    "text-center",
    "text-white",
    "font-medium",
  ];

  if (rounded) {
    classNames.push("rounded-3xl");
  }
  if (filled) {
    classNames.push("bg-primary");
  }
  if (className) {
    className.split(" ").forEach((el) => classNames.push(el));
  }
  const classNameString = classNames.join(" ");
  return (
    <>
      {(type === "button" || typeof href !== "string") && (
        <button className={classNameString}>{children}</button>
      )}
      {type === "link" && typeof href === "string" && (
        <Link className={classNameString} href={href}>
          {children}
        </Link>
      )}
    </>
  );
};

export default CsButton;
