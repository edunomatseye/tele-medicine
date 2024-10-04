import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VideoConsultation() {
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinRoom = () => {
    // In a real application, you would implement the video call functionality here
    // For this example, we'll just simulate joining a room
    if (roomId) {
      setIsJoined(true);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Video Consultation</CardTitle>
          <CardDescription>Enter a room ID to start or join a video consultation.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isJoined ? (
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <Button onClick={handleJoinRoom}>Join Room</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg font-semibold">You are now in Room: {roomId}</p>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Video call would appear here</p>
              </div>
              <Button onClick={() => setIsJoined(false)} variant="outline">Leave Room</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}