const CsAvatar = ({
  label,
  className,
  size = "generic",
}: {
  label: string;
  className?: string;
  size: "generic" | "big";
}) => {
  const letter = label.slice(0, 1);
  const classes = className ?? "";
  return (
    <div
      className={`flex
        ${size === "generic" ? "h-8 w-8" : ""}
        ${size === "big" ? "h-32 w-32" : ""}
        items-center justify-center rounded-full bg-cs-red p-2 ${classes}`}
    >
      <p
        className={`font-medium leading-none text-white ${
          size === "big" ? "text-6xl" : ""
        }`}
      >
        {letter}
      </p>
    </div>
  );
};

export default CsAvatar;
