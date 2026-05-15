export function Logo({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path
          d="M4 6.5C4 5.12 5.12 4 6.5 4h7C14.88 4 16 5.12 16 6.5V11c0 1.38-1.12 2.5-2.5 2.5H10l-2.5 2.5v-2.5H6.5C5.12 13.5 4 12.38 4 11V6.5Z"
          fill={color}
          opacity="0.55"
        />
        <path
          d="M8 11.5C8 10.12 9.12 9 10.5 9H17.5C18.88 9 20 10.12 20 11.5V16c0 1.38-1.12 2.5-2.5 2.5H14l-2.5 2.5V18.5h-1c-1.38 0-2.5-1.12-2.5-2.5v-4.5Z"
          fill={color}
        />
        <path
          d="M11.5 13.4l1.7 1.7 3.3-3.5"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display font-bold text-[1.05rem] tracking-tight lowercase" style={{ color }}>
        aihrly
      </span>
    </div>
  );
}
