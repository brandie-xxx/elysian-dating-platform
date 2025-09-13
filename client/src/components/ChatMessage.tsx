import { formatDistanceToNow } from "date-fns";

interface ChatMessageProps {
  id: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  senderName?: string;
  senderPhoto?: string;
}

export default function ChatMessage({ 
  id, content, timestamp, isOwn, senderName, senderPhoto 
}: ChatMessageProps) {
  
  return (
    <div 
      className={`flex items-end space-x-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
      data-testid={`message-${id}`}
    >
      {!isOwn && senderPhoto && (
        <img
          src={senderPhoto}
          alt={senderName}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          data-testid={`sender-photo-${id}`}
        />
      )}
      
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted text-foreground rounded-bl-sm'
          }`}
          data-testid={`message-bubble-${id}`}
        >
          <p className="text-sm">{content}</p>
        </div>
        
        <p 
          className={`text-xs text-muted-foreground mt-1 ${isOwn ? 'text-right' : 'text-left'}`}
          data-testid={`message-time-${id}`}
        >
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}