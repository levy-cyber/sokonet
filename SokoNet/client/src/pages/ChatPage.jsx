const conversations = [
  { id: 'c-001', name: 'Vendor support', lastMessage: 'Payment cleared for order #4802.', time: '2 min ago' },
  { id: 'c-002', name: 'Product inquiry', lastMessage: 'Can this be delivered tomorrow?', time: '14 min ago' },
  { id: 'c-003', name: 'Escrow review', lastMessage: 'Need approval for release.', time: '1 hr ago' },
];

export default function ChatPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
      <div className="card-glass p-6 shadow-soft">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Chat</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Conversation inbox</h1>
          <p className="mt-2 text-slate-400">Connect with vendors, buyers, and support teams instantly.</p>
        </div>
        <div className="mt-6 space-y-3">
          {conversations.map((chat) => (
            <div key={chat.id} className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-white">{chat.name}</h2>
                <span className="text-xs text-slate-500">{chat.time}</span>
              </div>
              <p className="mt-2 text-slate-400">{chat.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-glass p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-500">Live chat</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Vendor support channel</h2>
          </div>
          <button className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-600">Start new chat</button>
        </div>
        <div className="mt-6 h-[420px] rounded-[32px] border border-slate-800/80 bg-slate-900/70 p-5">
          <p className="text-slate-400">Select a conversation to view messages in the chat window.</p>
        </div>
      </div>
    </div>
  );
}
