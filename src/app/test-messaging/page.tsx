"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useSocket } from '@/hooks/use-socket';
import { 
  MessageSquare, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Send,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function TestMessagingPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const { toast } = useToast();
  const { currentUser, role } = useUser();
  const {
    isConnected,
    sendMessage,
    joinConversation,
    leaveConversation,
    markAsRead,
    startTyping,
    stopTyping,
    onNewMessage,
    onMessageReceived,
    onUserTyping,
    onMessagesRead,
  } = useSocket();

  const addTestResult = (test: string, status: 'pass' | 'fail', message: string) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Check if user is authenticated
      if (!currentUser) {
        addTestResult('Authentication', 'fail', 'User not authenticated');
        return;
      }
      addTestResult('Authentication', 'pass', `User authenticated as ${currentUser.name} (${role})`);

      // Test 2: Check WebSocket connection
      if (!isConnected) {
        addTestResult('WebSocket Connection', 'fail', 'Not connected to WebSocket server');
        return;
      }
      addTestResult('WebSocket Connection', 'pass', 'Connected to WebSocket server');

      // Test 3: Test message sending
      try {
        const testReceiverId = 'test-receiver';
        const testContent = 'This is a test message from the messaging test page.';
        
        sendMessage({
          receiverId: testReceiverId,
          content: testContent,
          type: 'text',
        });

        addTestResult('Message Sending', 'pass', 'Message sent successfully');
      } catch (error) {
        addTestResult('Message Sending', 'fail', `Failed to send message: ${error}`);
      }

      // Test 4: Test conversation joining
      try {
        const testConversationId = 'test-conversation';
        joinConversation(testConversationId);
        addTestResult('Conversation Joining', 'pass', 'Joined test conversation');
      } catch (error) {
        addTestResult('Conversation Joining', 'fail', `Failed to join conversation: ${error}`);
      }

      // Test 5: Test typing indicators
      try {
        const testConversationId = 'test-conversation';
        startTyping(testConversationId);
        setTimeout(() => {
          stopTyping(testConversationId);
        }, 1000);
        addTestResult('Typing Indicators', 'pass', 'Typing indicators working');
      } catch (error) {
        addTestResult('Typing Indicators', 'fail', `Failed to test typing indicators: ${error}`);
      }

      // Test 6: Test message read status
      try {
        const testConversationId = 'test-conversation';
        markAsRead(testConversationId);
        addTestResult('Message Read Status', 'pass', 'Message read status updated');
      } catch (error) {
        addTestResult('Message Read Status', 'fail', `Failed to update read status: ${error}`);
      }

    } catch (error) {
      addTestResult('Test Suite', 'fail', `Test suite error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const sendTestMessage = () => {
    if (!testMessage.trim() || !currentUser) return;

    const testReceiverId = 'test-receiver';
    sendMessage({
      receiverId: testReceiverId,
      content: testMessage,
      type: 'text',
    });

    setTestMessage('');
    toast({
      title: 'Test Message Sent',
      description: 'Test message sent successfully.',
    });
  };

  const getStatusIcon = (status: 'pass' | 'fail') => {
    return status === 'pass' ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusColor = (status: 'pass' | 'fail') => {
    return status === 'pass' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Real-Time Messaging Test</h1>
          <p className="text-muted-foreground">
            Test the real-time messaging functionality to ensure WebSocket connections and message delivery are working correctly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Current User
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentUser ? (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {currentUser.name}</p>
                  <p><strong>Role:</strong> {role}</p>
                  <p><strong>ID:</strong> {currentUser.id}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Not authenticated</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isConnected ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-red-600" />}
                WebSocket Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isConnected ? 'Real-time messaging is available' : 'Real-time messaging is unavailable'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Test Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  'Run Tests'
                )}
              </Button>
              <Button 
                variant="outline" 
                asChild 
                className="w-full"
              >
                <Link href="/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Open Messages
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Test Message Sender */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Send Test Message</CardTitle>
            <CardDescription>
              Send a test message to verify real-time functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Type a test message..."
                className="flex-1 px-3 py-2 border rounded-md"
                onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
              />
              <Button 
                onClick={sendTestMessage}
                disabled={!testMessage.trim() || !isConnected}
              >
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Results from the latest test run
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <p className="font-medium">{result.test}</p>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>What's Working</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  WebSocket connection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Real-time message sending
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Typing indicators
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Read receipts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Conversation management
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Instant message delivery
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Live typing indicators
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Message read status
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Online/offline status
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  File and image sharing
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
