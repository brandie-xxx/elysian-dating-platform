import ChatMessage from '../ChatMessage';
import { ThemeProvider } from '../ThemeProvider';
import profileImage from '@assets/generated_images/diverse_dating_profile_photos_10e01b24.png';

export default function ChatMessageExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background space-y-4">
        {/* todo: remove mock functionality */}
        <ChatMessage
          id="1"
          content="Hey there! I saw you love hiking too. Have you been to the Golden Gate trails?"
          timestamp={new Date(Date.now() - 1000 * 60 * 30)}
          isOwn={false}
          senderName="Alex"
          senderPhoto={profileImage}
        />
        
        <ChatMessage
          id="2"
          content="Yes! I was just there last weekend. The views were absolutely breathtaking. Would love to go again sometime!"
          timestamp={new Date(Date.now() - 1000 * 60 * 15)}
          isOwn={true}
        />
        
        <ChatMessage
          id="3"
          content="That sounds perfect! I know some great spots off the beaten path. Maybe we could plan a hiking date? ⛰️"
          timestamp={new Date(Date.now() - 1000 * 60 * 5)}
          isOwn={false}
          senderName="Alex"
          senderPhoto={profileImage}
        />
      </div>
    </ThemeProvider>
  );
}