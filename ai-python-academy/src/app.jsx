import React, { useState, useEffect } from 'react';
import { Play, Send, Book, Code, Trophy, Target, Sparkles, Brain, CheckCircle, XCircle, Lightbulb, BarChart3, Rocket, MessageSquare } from 'lucide-react';

const PythonLearningPlatform = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [aiMentorOpen, setAiMentorOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [studentProfile, setStudentProfile] = useState({
    name: 'Learner',
    level: 'Beginner',
    completed: 0,
    totalLessons: 48,
    streak: 0,
    interests: [],
    weakAreas: [],
    projects: []
  });
  const [showHint, setShowHint] = useState(false);
  const [exerciseResult, setExerciseResult] = useState(null);

  const phases = [
    {
      id: 1,
      title: 'Python Basics',
      icon: <Book className="w-5 h-5" />,
      lessons: [
        { title: 'Variables & Data Types', completed: false, type: 'interactive' },
        { title: 'String Manipulation', completed: false, type: 'exercise' },
        { title: 'Numbers & Operations', completed: false, type: 'project' },
        { title: 'Input & Output', completed: false, type: 'quiz' }
      ]
    },
    {
      id: 2,
      title: 'Control Flow',
      icon: <Target className="w-5 h-5" />,
      lessons: [
        { title: 'If/Else Statements', completed: false, type: 'interactive' },
        { title: 'Loops & Iteration', completed: false, type: 'exercise' },
        { title: 'Logic Puzzles', completed: false, type: 'project' },
        { title: 'Game Development Basics', completed: false, type: 'project' }
      ]
    },
    {
      id: 3,
      title: 'Data Structures',
      icon: <Code className="w-5 h-5" />,
      lessons: [
        { title: 'Lists & Tuples', completed: false, type: 'interactive' },
        { title: 'Dictionaries & Sets', completed: false, type: 'exercise' },
        { title: 'Data Processing', completed: false, type: 'project' },
        { title: 'Real Dataset Analysis', completed: false, type: 'project' }
      ]
    },
    {
      id: 4,
      title: 'Functions & Modules',
      icon: <Sparkles className="w-5 h-5" />,
      lessons: [
        { title: 'Creating Functions', completed: false, type: 'interactive' },
        { title: 'API Integration', completed: false, type: 'exercise' },
        { title: 'Build Your API App', completed: false, type: 'project' },
        { title: 'Module Organization', completed: false, type: 'exercise' }
      ]
    },
    {
      id: 5,
      title: 'Advanced Concepts',
      icon: <Brain className="w-5 h-5" />,
      lessons: [
        { title: 'OOP Fundamentals', completed: false, type: 'interactive' },
        { title: 'File Handling', completed: false, type: 'exercise' },
        { title: 'Error Handling', completed: false, type: 'interactive' },
        { title: 'Advanced Project', completed: false, type: 'project' }
      ]
    },
    {
      id: 6,
      title: 'Specialization',
      icon: <Rocket className="w-5 h-5" />,
      lessons: [
        { title: 'Career Track Selection', completed: false, type: 'interactive' },
        { title: 'Specialized Skills', completed: false, type: 'exercise' },
        { title: 'Portfolio Project', completed: false, type: 'project' },
        { title: 'Interview Prep', completed: false, type: 'quiz' }
      ]
    }
  ];

  const currentLessonContent = {
    title: phases[currentPhase - 1]?.lessons[currentLesson]?.title || 'Welcome',
    description: 'Learn Python interactively with AI-powered guidance',
    exercise: `# Exercise: Create a greeting function
# The AI will guide you through building your first Python function

def greet(name):
    # TODO: Return a personalized greeting
    pass

# Test your function
print(greet("World"))`,
    expectedOutput: 'Hello, World!',
    hints: [
      "Start by using the 'return' keyword",
      "Use string formatting with f-strings: f'Hello, {name}!'",
      "Remember to include proper indentation inside the function"
    ]
  };

  const runCode = () => {
    try {
      const result = simulatePythonExecution(code);
      setOutput(result);
      checkExercise(result);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setExerciseResult('error');
    }
  };

  const simulatePythonExecution = (code) => {
    if (code.includes('def greet') && code.includes('return')) {
      if (code.includes("f'Hello, {name}'") || code.includes('f"Hello, {name}"')) {
        return 'Hello, World!';
      }
      return 'Hello World';
    }
    return 'Run your code to see output';
  };

  const checkExercise = (result) => {
    if (result === currentLessonContent.expectedOutput) {
      setExerciseResult('success');
      generateAIFeedback('success');
    } else if (result.includes('Hello')) {
      setExerciseResult('partial');
      generateAIFeedback('partial');
    } else {
      setExerciseResult('error');
      generateAIFeedback('error');
    }
  };

  const generateAIFeedback = (type) => {
    const feedback = {
      success: {
        message: "🎉 Excellent work! Your function works perfectly!",
        detail: "You've successfully created a function that takes a parameter and returns a formatted string. This is a fundamental skill in Python.",
        next: "Ready to move on to the next challenge?"
      },
      partial: {
        message: "Good progress! You're almost there.",
        detail: "Your function returns a greeting, but check the format. The expected output should include a comma after 'Hello'.",
        hint: "Try using f'Hello, {name}!' instead"
      },
      error: {
        message: "Let's debug this together!",
        detail: "It looks like your function isn't returning the greeting yet. Remember to use the 'return' keyword.",
        hint: "Click the hint button for a step-by-step guide"
      }
    };

    const fb = feedback[type];
    setChatMessages(prev => [...prev, {
      type: 'ai',
      content: fb.message,
      detail: fb.detail,
      hint: fb.hint
    }]);
  };

  const sendMessage = () => {
    if (!userMessage.trim()) return;
    
    setChatMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      setChatMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
    }, 1000);
    
    setUserMessage('');
  };

  const generateAIResponse = (message) => {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('function') || lowerMsg.includes('def')) {
      return "Great question! In Python, functions are defined using the 'def' keyword, followed by the function name and parameters in parentheses. The function body is indented. Would you like me to show you an example?";
    }
    if (lowerMsg.includes('help') || lowerMsg.includes('stuck')) {
      return "I'm here to help! Let's break down this exercise step by step. First, make sure your function has a 'return' statement. What part is confusing you?";
    }
    if (lowerMsg.includes('hint')) {
      return `Here's a hint: ${currentLessonContent.hints[0]}. Try implementing this and let me know how it goes!`;
    }
    return "I'm analyzing your question. In a full implementation, I'd provide personalized guidance based on your code and learning history. What specific aspect would you like help with?";
  };

  const getNextHint = () => {
    const hintIndex = chatMessages.filter(m => m.type === 'ai' && m.content.includes('hint')).length;
    if (hintIndex < currentLessonContent.hints.length) {
      setChatMessages(prev => [...prev, {
        type: 'ai',
        content: `Hint ${hintIndex + 1}: ${currentLessonContent.hints[hintIndex]}`
      }]);
    }
    setShowHint(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <header className="bg-black/30 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Python Academy</h1>
              <p className="text-xs text-purple-300">Powered by LLM Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{studentProfile.name}</p>
              <p className="text-xs text-purple-300">{studentProfile.level}</p>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/20 px-3 py-2 rounded-lg">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold">{studentProfile.completed}/{studentProfile.totalLessons}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Learning Path
            </h2>
            <div className="space-y-3">
              {phases.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setCurrentPhase(phase.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    currentPhase === phase.id
                      ? 'bg-purple-500/30 border border-purple-400'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {phase.icon}
                    <span className="font-medium text-sm">Phase {phase.id}</span>
                  </div>
                  <p className="text-xs text-purple-200">{phase.title}</p>
                  <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${(phase.lessons.filter(l => l.completed).length / phase.lessons.length) * 100}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20">
            <h3 className="font-bold mb-3 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              AI Insights
            </h3>
            <div className="space-y-2 text-xs">
              <p className="text-purple-200">• Strong in: Variables, Strings</p>
              <p className="text-purple-200">• Practice more: Loop logic</p>
              <p className="text-purple-200">• Suggested: Data structures deep dive</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{currentLessonContent.title}</h2>
                <p className="text-purple-200">{currentLessonContent.description}</p>
              </div>
              <button
                onClick={() => setAiMentorOpen(!aiMentorOpen)}
                className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">AI Mentor</span>
              </button>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {phases[currentPhase - 1]?.lessons.map((lesson, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentLesson(idx)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    currentLesson === idx
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {lesson.completed && <CheckCircle className="w-3 h-3 inline mr-1" />}
                  Lesson {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-purple-500/20 overflow-hidden">
            <div className="bg-black/30 px-4 py-2 flex items-center justify-between border-b border-purple-500/20">
              <span className="text-sm font-medium">Code Editor</span>
              <div className="flex gap-2">
                <button
                  onClick={getNextHint}
                  className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 rounded text-sm flex items-center gap-1 transition-all"
                >
                  <Lightbulb className="w-3 h-3" />
                  Hint
                </button>
                <button
                  onClick={runCode}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm flex items-center gap-1 transition-all"
                >
                  <Play className="w-3 h-3" />
                  Run
                </button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={currentLessonContent.exercise}
              className="w-full h-64 bg-slate-900 text-white font-mono text-sm p-4 focus:outline-none resize-none"
              spellCheck="false"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20">
              <h3 className="font-bold mb-2 text-sm">Output</h3>
              <div className="bg-slate-900 rounded p-3 font-mono text-sm min-h-24">
                {output || 'No output yet. Run your code!'}
              </div>
            </div>

            {exerciseResult && (
              <div className={`backdrop-blur-lg rounded-xl p-4 border ${
                exerciseResult === 'success' ? 'bg-green-500/20 border-green-500/30' :
                exerciseResult === 'partial' ? 'bg-yellow-500/20 border-yellow-500/30' :
                'bg-red-500/20 border-red-500/30'
              }`}>
                <h3 className="font-bold mb-2 text-sm flex items-center gap-2">
                  {exerciseResult === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  AI Feedback
                </h3>
                <p className="text-sm">
                  {exerciseResult === 'success' && "Perfect! Your solution is correct."}
                  {exerciseResult === 'partial' && "Good effort! Check the output format."}
                  {exerciseResult === 'error' && "Let's debug this together."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {aiMentorOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-purple-500/30">
            <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold">AI Mentor</h3>
              </div>
              <button
                onClick={() => setAiMentorOpen(false)}
                className="text-purple-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center text-purple-300 py-8">
                  <Brain className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                  <p>Hi! I'm your AI mentor. Ask me anything about the lesson!</p>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.type === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-purple-100'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    {msg.detail && <p className="text-xs mt-2 opacity-80">{msg.detail}</p>}
                    {msg.hint && <p className="text-xs mt-2 text-yellow-300">{msg.hint}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-purple-500/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask your AI mentor..."
                  className="flex-1 bg-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-purple-500 hover:bg-purple-600 p-2 rounded-lg transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PythonLearningPlatform;