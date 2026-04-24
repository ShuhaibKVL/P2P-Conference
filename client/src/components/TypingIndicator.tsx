const TypingIndicator = () => {
    return (
        <div className="px-4 pb-3">
            <div className="inline-flex items-center gap-1 bg-slate-800 px-4 py-2 rounded-2xl">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                <span
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                ></span>
            </div>
        </div>
    );
};

export default TypingIndicator;