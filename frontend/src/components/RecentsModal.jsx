// The "Recents" popup that shows calculation history.
// Matches the design: title with a clock, "Clear all", and each row
// shows "expression=result" with an X to delete it.

export default function RecentsModal({ history, onClose, onDelete, onClearAll }) {
  return (
    // Dark overlay behind the popup. Clicking it closes the modal.
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-24"
      onClick={onClose}
    >
      {/* Stop clicks inside the card from closing the modal */}
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🕘</span>
            <h3 className="text-lg font-semibold">Recents</h3>
          </div>
          <button
            onClick={onClearAll}
            className="text-sm text-gray-500 hover:text-red-500 disabled:opacity-40"
            disabled={history.length === 0}
          >
            Clear all
          </button>
        </div>

        {/* List */}
        {history.length === 0 ? (
          <p className="py-6 text-center text-gray-400">No recent calculations.</p>
        ) : (
          <ul className="max-h-80 space-y-1 overflow-y-auto">
            {history.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="font-mono text-gray-800 dark:text-gray-100">
                  {item.expression}={item.result}
                </span>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label="Delete"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
