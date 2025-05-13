const PrimaryButton = ({ title, color, bgColor, onClick }) => {
  const textColorClass =
    color === "brokenWhite" ? "text-pine" : "text-brokenWhite";

  return (
    <button
      onClick={onClick}
      style={{backgroundColor: bgColor || undefined,}}
      className={`${!bgColor ? `bg-${color}` : ""} w-full px-12 py-3 mt-8 backdrop-blur-sm border-[1px] border-brokenWhite ${textColorClass} rounded-lg hover:text-brokenWhite hover:bg-violet-800 duration-300 font-medium`}
    >
      {title}
    </button>
  );
};

export default PrimaryButton;
