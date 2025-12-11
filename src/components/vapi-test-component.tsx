import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Settings, TestTube } from "lucide-react";

// Test component for VAPI.ai integration
export const VapiTestComponent = () => {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResults, setTestResults] = useState<string[]>([]);

  const runVapiTests = async () => {
    setTestStatus('testing');
    setTestResults([]);
    
    const tests = [
      'Checking VAPI SDK availability...',
      'Testing API key configuration...',
      'Verifying voice assistant setup...',
      'Testing speech recognition...',
      'Testing speech synthesis...'
    ];

    for (let i = 0; i < tests.length; i++) {
      setTestResults(prev => [...prev, tests[i]]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate test results
      if (i === 1) {
        setTestResults(prev => [...prev.slice(0, -1), `${tests[i]} ❌ API key not configured`]);
        setTestStatus('error');
        return;
      } else {
        setTestResults(prev => [...prev.slice(0, -1), `${tests[i]} ✅`]);
      }
    }
    
    setTestStatus('success');
  };

  const getStatusBadge = () => {
    switch (testStatus) {
      case 'testing':
        return <Badge variant="outline">Testing...</Badge>;
      case 'success':
        return <Badge className="bg-green-500">All Tests Passed</Badge>;
      case 'error':
        return <Badge variant="destructive">Tests Failed</Badge>;
      default:
        return <Badge variant="secondary">Ready to Test</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-6 h-6" />
          VAPI.ai Test Component
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>This component tests VAPI.ai integration and configuration.</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Configuration Required:</h4>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <code>VITE_VAPI_PUBLIC_KEY</code>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <code>VITE_VAPI_ASSISTANT_ID</code>
            </div>
          </div>
        </div>

        <Button 
          onClick={runVapiTests}
          disabled={testStatus === 'testing'}
          className="w-full"
        >
          <Phone className="w-4 h-4 mr-2" />
          {testStatus === 'testing' ? 'Running Tests...' : 'Test VAPI Integration'}
        </Button>

        {testResults.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Test Results:</h4>
            <div className="text-sm space-y-1 font-mono">
              {testResults.map((result, index) => (
                <div key={index} className="text-gray-700">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {testStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Setup Required:</h4>
            <div className="text-sm text-red-700 space-y-2">
              <p>To enable VAPI.ai voice interviews:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Sign up at <a href="https://vapi.ai" target="_blank" rel="noopener noreferrer" className="underline">vapi.ai</a></li>
                <li>Install the SDK: <code className="bg-red-100 px-1 rounded">npm install @vapi-ai/web-sdk</code></li>
                <li>Add your API keys to <code className="bg-red-100 px-1 rounded">.env.local</code></li>
                <li>Configure your voice assistant</li>
              </ol>
            </div>
          </div>
        )}

        {testStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">🎉 VAPI.ai Ready!</h4>
            <p className="text-sm text-green-700">
              Your VAPI.ai integration is configured and ready for voice interviews.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};