const Divider = () => {
  return (
    <div className="h-6 border-y relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #e4e4e7 0 1px, transparent 1px 10px)",
          opacity: 1,
        }}
      />
    </div>
  );
};

export { Divider };
