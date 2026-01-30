// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Loader2, Send, Trash2 } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';

// interface AgentInputFormProps {
//     onRun: (input: string) => void;
//     isLoading: boolean;
//     maxLength?: number;
// }

// export function AgentInputForm({ onRun, isLoading, maxLength = 5000 }: AgentInputFormProps) {
//     const [input, setInput] = useState('');

//     const handleSubmit = (e?: React.FormEvent) => {
//         e?.preventDefault();
//         if (!input.trim() || isLoading) return;
//         onRun(input);
//     };

//     const handleKeyDown = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter' && e.ctrlKey) {
//             handleSubmit();
//         }
//     };

//     return (
//         <Card className="border-t-4 border-t-primary">
//             <CardContent className="pt-6 space-y-4">
//                 <div className="relative">
//                     <Textarea
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         onKeyDown={handleKeyDown}
//                         placeholder="Enter your query or task for this agent..."
//                         className="min-h-[120px] resize-y pr-2 pb-6"
//                         maxLength={maxLength}
//                         disabled={isLoading}
//                     />
//                     <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
//                         {input.length} / {maxLength}
//                     </div>
//                 </div>

//                 <div className="flex justify-between items-center">
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => setInput('')}
//                         disabled={!input || isLoading}
//                         className="text-muted-foreground hover:text-destructive"
//                     >
//                         <Trash2 className="w-4 h-4 mr-2" /> Clear
//                     </Button>

//                     <Button
//                         onClick={() => handleSubmit()}
//                         disabled={!input.trim() || isLoading}
//                         className="min-w-[120px]"
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running...
//                             </>
//                         ) : (
//                             <>
//                                 <Send className="w-4 h-4 mr-2" /> Run Agent
//                             </>
//                         )}
//                     </Button>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }

// src/components/agent/AgentInputForm.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { InputParam } from '@/types/agent';

interface AgentInputFormProps {
  inputParams: InputParam[];
  onRun: (formData: Record<string, any>) => void;
  isLoading: boolean;
}

export function AgentInputForm({ inputParams, onRun, isLoading }: AgentInputFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    // Initialize form with empty values
    const initial: Record<string, any> = {};
    inputParams.forEach(param => {
      initial[param.key] = param.type === 'number' ? 0 : '';
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    inputParams.forEach(param => {
      if (param.is_required) {
        const value = formData[param.key];
        if (value === '' || value === null || value === undefined) {
          newErrors[param.key] = `${param.name} is required`;
        }
      }

      // Type-specific validation
      if (param.type === 'number' && formData[param.key] !== '') {
        const num = Number(formData[param.key]);
        if (isNaN(num)) {
          newErrors[param.key] = `${param.name} must be a valid number`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Convert form data to proper types
    const processedData: Record<string, any> = {};
    inputParams.forEach(param => {
      let value = formData[param.key];
      
      // Type conversion
      if (param.type === 'number' && value !== '') {
        value = Number(value);
      } else if (param.type === 'boolean') {
        value = Boolean(value);
      }
      
      processedData[param.key] = value;
    });

    onRun(processedData);
  };

  const handleClear = () => {
    const cleared: Record<string, any> = {};
    inputParams.forEach(param => {
      cleared[param.key] = param.type === 'number' ? 0 : '';
    });
    setFormData(cleared);
    setErrors({});
  };

  const renderField = (param: InputParam) => {
    const value = formData[param.key];
    const error = errors[param.key];

    switch (param.type) {
      case 'number':
        return (
          <div key={param.key} className="space-y-2">
            <Label htmlFor={param.key}>
              {param.name}
              {param.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={param.key}
              type="number"
              value={value}
              onChange={(e) => handleChange(param.key, e.target.value)}
              placeholder={param.title}
              className={error ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'boolean':
        return (
          <div key={param.key} className="flex items-center space-x-2">
            <input
              id={param.key}
              type="checkbox"
              checked={value}
              onChange={(e) => handleChange(param.key, e.target.checked)}
              className="w-4 h-4"
              disabled={isLoading}
            />
            <Label htmlFor={param.key} className="cursor-pointer">
              {param.name}
              {param.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        );

      case 'select':
        return (
          <div key={param.key} className="space-y-2">
            <Label htmlFor={param.key}>
              {param.name}
              {param.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <select
              id={param.key}
              value={value}
              onChange={(e) => handleChange(param.key, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isLoading}
            >
              <option value="">Select {param.name}</option>
              {param.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'string':
      default:
        return (
          <div key={param.key} className="space-y-2">
            <Label htmlFor={param.key}>
              {param.name}
              {param.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={param.key}
              type="text"
              value={value}
              onChange={(e) => handleChange(param.key, e.target.value)}
              placeholder={param.title}
              className={error ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Input</CardTitle>
        <CardDescription>
          Fill in the required information to run the agent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {inputParams.map(param => renderField(param))}

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Agent...
                </>
              ) : (
                'Run Agent'
              )}
            </Button>

            <Button 
              type="button" 
              variant="outline"
              onClick={handleClear}
              disabled={isLoading}
            >
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
