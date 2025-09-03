export const Message = ({ isOwn }: { isOwn: boolean }) => {
    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                isOwn 
                    ? 'bg-indigo-500 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
            }`}>
                <p className="text-sm">Привет! Как дела? Давно не общались, как успехи?</p>
                <span className={`text-xs mt-1 block text-right ${
                    isOwn ? 'text-indigo-200' : 'text-gray-400'
                }`}>
                    12:30
                </span>
            </div>
        </div>
    )
}
