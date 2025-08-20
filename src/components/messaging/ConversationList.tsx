"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { 
  MessageSquare, 
  Search, 
  Clock, 
  CheckCircle,
  Send
} from 'lucide-react';
import type { Conversation } from '@/lib/messaging-service';

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

export function ConversationList({ onSelectConversation, selectedConversationId }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/messages?userId=${currentUser?.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      } else {
        toast({
          title: 'Failed to load conversations',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      toast({
        title: 'Failed to load conversations',
        description: 'An error occurred while loading conversations.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchConversations();
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/messages?userId=${currentUser?.id}&query=${encodeURIComponent(searchQuery)}`);
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      } else {
        toast({
          title: 'Search failed',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: 'Search failed',
        description: 'An error occurred during search.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p !== currentUser?.id) || 'Unknown';
  };

  const getParticipantName = (participantId: string) => {
    // In a real app, you'd fetch user details
    const names: Record<string, string> = {
      'hirer1': 'John Smith',
      'hirer2': 'Sarah Johnson',
      'user1': 'Mike Worker',
    };
    return names[participantId] || participantId;
  };

  if (!currentUser) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You need to be logged in to view conversations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} size="sm">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Conversations List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading conversations...</span>
          </div>
        </div>
      ) : conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation);
            const participantName = getParticipantName(otherParticipant);
            const isSelected = conversation.id === selectedConversationId;

            return (
              <Card 
                key={conversation.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://placehold.co/100x100.png?text=${participantName.charAt(0)}`} />
                      <AvatarFallback>{participantName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold truncate">{participantName}</h4>
                        <div className="flex items-center gap-2">
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.updatedAt)}
                          </span>
                        </div>
                      </div>
                      
                      {conversation.lastMessage && (
                        <div className="flex items-center gap-1 mt-1">
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage.content}
                          </p>
                          <div className="flex items-center gap-1">
                            {conversation.lastMessage.status === 'read' && (
                              <CheckCircle className="h-3 w-3 text-blue-500" />
                            )}
                            {conversation.lastMessage.status === 'delivered' && (
                              <Clock className="h-3 w-3 text-gray-400" />
                            )}
                            {conversation.lastMessage.status === 'sent' && (
                              <Send className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                      )}
                      
                      {conversation.jobId && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Job #{conversation.jobId}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Conversations</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'No conversations found matching your search.' : 'You don\'t have any conversations yet.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 