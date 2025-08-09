export default function ChatHeader({
  targetUser,
  isBlocked,
  handleBlockToggle,
  autoDeleteEnabled,
  setAutoDeleteEnabled,
  hasAccess,
  setAlertMessage,
  onBack, // callback to handle back navigation
}) {
  return (
    <div className="chat-header">
      <button className="back-btn" onClick={onBack}>←</button>

      <span className="chat-username">{targetUser?.name || "Chat"}</span>

      <button className="block-btn" onClick={handleBlockToggle}>
        {isBlocked ? "Unblock" : "Block"}
      </button>

      {/*<div
        className={`toggle-switch ${autoDeleteEnabled ? "on" : "off"}`}
        onClick={() => {
          if (hasAccess) {
            setAutoDeleteEnabled(!autoDeleteEnabled);
          } else {
            setAlertMessage({
              text: "⚠️ Pay $1 to disable self-destruct mode.",
              buttons: ["pay", "close"],
            });
          }
        }}
      >
        <div className="toggle-thumb" />
      </div>*/}
    </div>
  );
}
