import React, { useState, useRef, useEffect } from 'react';
import { 
  IconButton,
  Container,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Drawer,
  Divider,
  Checkbox
} from '@mui/material';
import {
  Send as SendIcon,
  Refresh as RefreshIcon,
  Menu as MenuIcon,
  ContentCopy as CopyIcon,
  History as HistoryIcon,
  Check as CheckIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion'; // Thêm Framer Motion để tạo animation
import logo from './assets/images/Logo(1).png';
import './App.css';

function App() {
  const [conversation, setConversation] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [platform, setPlatform] = useState('facebook');
  const [tone, setTone] = useState('friendly');
  const [language, setLanguage] = useState('Vietnamese');
  const [gender, setGender] = useState('unknown')
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [userId, setUserId] = useState('test-user-id'); // Thay bằng userId thực tế từ hệ thống xác thực
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState(null);
  const [user, setUser] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  // Mock data for conversation history (in a real app, this would come from an API)
  const AuthForm = ({ mode, onSubmit, error, switchMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('unknown');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, password, gender });
  };

  // Animation variants cho hiệu ứng chuyển động
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
      <Container maxWidth="xs" style={{ marginTop: '3%' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center"
        >
          <Paper 
            elevation={6} 
            sx={{ 
              p: 6, // Tăng padding để rộng rãi hơn
              borderRadius: 3, 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              width: '100%', // Đảm bảo Paper chiếm toàn bộ chiều rộng container
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                className="font-bold text-gray-800"
                sx={{ 
                  background: 'linear-gradient(to right, #3b82f6, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
              <Typography>
                <img src={logo} alt="ReplyAI Logo" 
                    style={{ 
                      width: '130px', // Điều chỉnh theo nhu cầu
                      height: 'auto', // Giữ tỉ lệ
                      marginLeft: '10px' // Căn chỉnh nếu cần
                    }} 
                />
              </Typography>
                {mode === 'login' ? 'Welcome back' : 'Create Account'}
              </Typography>
              <Typography variant="body2" className="text-gray-500 mt-2">
                {mode === 'login' ? 'Sign in to continue' : 'Join us today'}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6"> {/* Tăng khoảng cách giữa các item */}
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#3b82f6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                }}
                className="bg-gray-50"
                style={{ marginBottom: '15px' }} // Tăng khoảng cách
                InputProps={{ style: { padding: '10px' } }} // Tăng padding bên trong input
              />

              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#3b82f6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                    },
                  },
                }}
                className="bg-gray-50"
                style={{ marginBottom: '15px' }}
                InputProps={{ style: { padding: '10px' } }} // Tăng padding bên trong input
              />

              {mode === 'register' && (
                <FormControl fullWidth variant="outlined">
                  <InputLabel sx={{ color: '#6b7280' }}>Gender</InputLabel>
                  <Select
                    value={gender}
                    label="Gender"
                    onChange={(e) => setGender(e.target.value)}
                    sx={{
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3b82f6',
                      },
                    }}
                    className="bg-gray-50"
                    style={{ marginBottom: '15px' }}
                    MenuProps={{ 
                      PaperProps: { style: { maxHeight: 200 } } // Giới hạn chiều cao dropdown
                    }}
                  >
                    <MenuItem value="unknown">Not Specified</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
              )}
              {mode === 'login' && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                    size="small"
                  />
                  <Typography variant="body2" color="textSecondary">
                    Remember me
                  </Typography>
                </Box>
              )}

              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    py: 2, // Tăng chiều cao nút
                    borderRadius: 2,
                    background: 'linear-gradient(to right, #3b82f6, #a855f7)',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    '&:hover': {
                      background: 'linear-gradient(to right, #2563eb, #9333ea)',
                    },
                  }}
                >
                  {mode === 'login' ? 'Sign In' : 'Sign Up'}
                </Button>
              </motion.div>

              <Typography variant="body2" align="center" className="text-gray-600">
                {mode === 'login' ? (
                  <>
                    Don’t have an account?{' '}
                    <Button
                      onClick={() => switchMode('register')}
                      className="text-blue-500 hover:text-blue-600"
                      sx={{ textTransform: 'none' }}
                    >
                      Sign up
                    </Button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <Button
                      onClick={() => switchMode('login')}
                      className="text-blue-500 hover:text-blue-600"
                      sx={{ textTransform: 'none' }}
                    >
                      Sign in
                    </Button>
                  </>
                )}
              </Typography>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </div>
  );
};
  // Định nghĩa fetchConversations ngoài useEffect
  const handleAuth = async (credentials) => {
  try {
    const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
    const response = await fetch(`http://localhost:5000${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    // Kiểm tra token có tồn tại không
    if (!data.token || !data.user) {
      throw new Error('Invalid server response - missing token or user data');
    }

    // Lưu token và user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Nếu là login và có chọn remember me, lưu vào localStorage
    if (authMode === 'login' && credentials.rememberMe) {
      localStorage.setItem('rememberedUsername', credentials.username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }
    
    // Cập nhật state
    setIsAuthenticated(true);
    setUser(data.user);
    setUserId(data.user.id);
    setGender(data.user.gender || 'unknown');
    setAuthError(null);
    
    // Fetch conversations với delay ngắn để đảm bảo state được cập nhật
    setTimeout(async () => {
      try {
        await fetchConversations();
      } catch (fetchError) {
        console.error('Error fetching conversations after login:', fetchError);
        setError('Failed to load conversations');
      }
    }, 100);
  } catch (error) {
    console.error('Authentication error:', error);
    setAuthError(error.message);
    handleLogout();
  }
};

  // Handle logout
const handleLogout = () => {
  // Xóa tất cả dữ liệu liên quan đến auth
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('currentConversationId');
  
  // Reset state
  setIsAuthenticated(false);
  setUser(null);
  setUserId(null);
  setConversation([]);
  setConversations([]);
  setAuthMode('login');
  setError(null);
};

  // Switch between login/register
  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setAuthError(null);
  };

  // Check authentication on mount
useEffect(() => {
  const initializeAuth = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    
    // Nếu có remembered username, điền vào form đăng nhập
    if (rememberedUsername && !token) {
      setAuthMode('login');
      // Bạn cần thêm logic để cập nhật username trong AuthForm
      // Có thể cần refactor AuthForm thành component riêng để quản lý state tốt hơn
    }
    
    if (token && userData) {
      try {
        // Thêm timeout để tránh blocking UI
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const validationResponse = await fetch('http://localhost:5000/api/validate-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (validationResponse.ok) {
          const user = JSON.parse(userData);
          setIsAuthenticated(true);
          setUser(user);
          setUserId(user.id);
          setGender(user.gender || 'unknown');
          
          // Load conversations sau khi xác thực thành công
          await fetchConversations();
        } else {
          console.log('Token validation failed, logging out');
          handleLogout();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleLogout();
      }
    }
  };

  initializeAuth();
}, []);

  // Fetch conversations
  const fetchConversations = async () => {
  try {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      throw new Error('No authentication data found');
    }

    const user = JSON.parse(userData);
    const response = await fetch(`http://localhost:5000/api/conversations/${user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('Conversations response:', response); // Debug log

    if (response.status === 401 || response.status === 403) {
      // Token không hợp lệ, đăng xuất
      handleLogout();
      throw new Error('Session expired, please login again');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch conversations');
    }

    const data = await response.json();
    const formattedConversations = data.conversations.map((conv) => ({
      id: conv._id,
      title: conv.messages[0]?.text.slice(0, 20) || 'Untitled',
      preview: conv.messages[conv.messages.length - 1]?.text.slice(0, 30) || '...',
      timestamp: new Date(conv.createdAt),
      messages: conv.messages,
      tone: conv.tone,
      language: conv.language,
      platform: conv.platform,
    }));

    setConversations(formattedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    setError(error.message);
    if (error.message.includes('Session expired')) {
      handleLogout();
    }
  }
};

  const handleSendMessage = async () => {
  if (newMessage.trim()) {
    setIsLoading(true); // Bật trạng thái loading
    setError(null);
    
    try {
      const newMsg = {
        sender: 'user',
        text: newMessage,
        timestamp: new Date(),
      };
      
      // Tạm thời không cập nhật state ngay mà chờ phản hồi từ server
      setNewMessage('');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('http://localhost:5000/api/generate-suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Thêm token vào header
        },
        body: JSON.stringify({
          conversationHistory: [...conversation, newMsg].map(msg => `${msg.sender}: ${msg.text}`),
          platform,
          tone,
          language,
          gender,
          userId,
          conversationId: currentConversationId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Cập nhật state từ phản hồi server
        const updatedMessages = data.suggestions.map(suggestion => ({
          sender: 'assistant',
          text: suggestion,
          timestamp: new Date(),
          isSuggestion: true,
        }));
        
        setConversation([...conversation, newMsg, ...updatedMessages]);
        setSuggestions(data.suggestions);
        
        // Cập nhật conversationId nếu là cuộc trò chuyện mới
        if (!currentConversationId && data.conversationId) {
          setCurrentConversationId(data.conversationId);
        }
        
        // Làm mới danh sách cuộc trò chuyện
        await fetchConversations();
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      // Rollback - thêm lại tin nhắn nếu gửi thất bại
      setConversation([...conversation, {
        sender: 'user',
        text: newMessage,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }
};

  const handleGetSuggestions = async () => {
  try {
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please start a conversation first');
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/generate-suggestion`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationHistory: conversation.map(
            (msg) => `${msg.sender}: ${msg.text}`
          ),
          platform,
          tone,
          language,
          gender,
          conversationId: currentConversationId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get suggestions');
    }

    const suggestionMessages = data.suggestions.map((suggestion, index) => ({
      sender: 'assistant',
      text: suggestion,
      timestamp: new Date(),
      isSuggestion: true,
      isNewSuggestionGroup: index === 0,
    }));

    setConversation((prev) => [...prev, ...suggestionMessages]);
    setSuggestions(data.suggestions);

    await fetchConversations();
  } catch (error) {
    console.error(error);
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

  
  const loadConversation = async (conversationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`http://localhost:5000/api/conversation/${conversationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to load conversation');
    }
    
    const data = await response.json();
      if (data.success) {
        const conversationToLoad = data.conversation;
        
        // Đảm bảo mỗi tin nhắn assistant có suggestions đều được đánh dấu là isSuggestion
        const messages = conversationToLoad.messages.map(msg => {
          if (msg.sender === 'assistant' && (msg.isSuggestion || msg.suggestions)) {
            return {
              ...msg,
              text: msg.suggestions ? msg.suggestions.join('\n') : msg.text,
              isSuggestion: true // Đảm bảo luôn có flag này
            };
          }
          return msg;
        });
  
        setConversation(messages);
        setTone(conversationToLoad.tone);
        setLanguage(conversationToLoad.language);
        setPlatform(conversationToLoad.platform);
        setCurrentConversationId(conversationId);
        
        // Cập nhật suggestions từ tin nhắn cuối cùng nếu là suggestion
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.isSuggestion) {
          setSuggestions(lastMessage.text.split('\n'));
        } else {
          setSuggestions([]);
        }
      } else {
        setError('Failed to load conversation');
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      setError('Failed to load conversation');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = () => {
    setConversation([]);
    setSuggestions([]);
    setCurrentConversationId(null);
    setTone('friendly');
    setLanguage('Vietnamese');
    setPlatform('facebook');
  };

  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  const copyToClipboard = async (text) => {
    if (!isBrowser) {
      setError('Copy not supported in this environment');
      return false;
    }

    try {
      // Modern clipboard API (works on HTTPS)
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers or HTTP
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        
        const result = document.execCommand('copy');
        document.body.removeChild(textarea);
        return result;
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  };

  
  const formatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) return ''; // Xử lý khi date không hợp lệ
    return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const handleCopyClick = async (text) => {
    const success = await copyToClipboard(text);
    if (success) {
      setSuccess('Copied to clipboard!');
    } else {
      setError('Failed to copy text');
    }
  };
  // Nếu chưa đăng nhập, hiển thị form đăng nhập/đăng ký
  if (!isAuthenticated) {
    return (
      <AuthForm
        mode={authMode}
        onSubmit={handleAuth}
        error={authError}
        switchMode={switchAuthMode}
      />
    );
  }
  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
    <div
      className="chat-container"
      style={{
        marginLeft: drawerOpen ? '300px' : '0',
        transition: 'margin-left 0.3s ease',
        width: drawerOpen ? 'calc(100% - 300px)' : '100%',
      }}
    >
      {/* Sidebar/Drawer */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 300,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 300,
            boxSizing: 'border-box',
            borderRight: 'none',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            position: 'fixed',
            height: '100%',
            zIndex: 1200,
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{
              background: 'linear-gradient(to right, #3b82f6, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            Chat History
          </Typography>
        </Box>
        <Divider sx={{ borderColor: '#e5e7eb' }} />
        <List sx={{ overflowY: 'auto', flexGrow: 1, p: 1 }}>
          {conversations.map((conv) => (
            <ListItem
              key={conv.id}
              button
              onClick={() => loadConversation(conv.id)}
              selected={currentConversationId === conv.id}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&.Mui-selected': {
                  background: 'linear-gradient(to right, #e3f2fd, #f3e8ff)',
                },
                '&.Mui-selected:hover': {
                  background: 'linear-gradient(to right, #bbdefb, #e9d5ff)',
                },
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              <ListItemText
                primary={conv.title}
                primaryTypographyProps={{ fontWeight: 'medium', color: '#1f2937' }}
                secondary={
                  <>
                    <span style={{ display: 'block', color: '#6b7280' }}>{conv.preview}</span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {formatDate(conv.timestamp)} • {conv.tone}
                    </span>
                  </>
                }
                secondaryTypographyProps={{ component: 'div' }}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ borderColor: '#e5e7eb' }} />
        <Box sx={{ p: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleClearConversation}
            sx={{
              textTransform: 'none',
              background: 'linear-gradient(to right, #3b82f6, #a855f7)',
              borderRadius: 2,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(to right, #2563eb, #9333ea)',
              },
            }}
          >
            New Conversation
          </Button>
        </Box>
      </Drawer>

      {/* Header */}
      <div className="chat-header sticky top-0 z-10 bg-white/90 backdrop-blur-lg shadow-md">
        <div className="logo-container flex items-center">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <MenuIcon sx={{ color: '#3b82f6' }} />
          </IconButton>
          <div>
            <div>
</div>
          </div>
          <Typography
            variant="h6"
            component="div"
            sx={{
              background: 'linear-gradient(to right, #3b82f6, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            ReplyAI
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <PersonIcon sx={{ mr: 1, color: '#3b82f6' }} />
              <Typography variant="body2" sx={{ color: '#1f2937' }}>
                {user.username}
              </Typography>
            </Box>
          )}
          <Button
            variant="outlined"
            onClick={handleLogout}
            size="small"
            sx={{
              color: '#3b82f6',
              borderColor: '#3b82f6',
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#eff6ff',
                borderColor: '#2563eb',
              },
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Message List */}
      <div className="message-list p-6 overflow-y-auto h-[calc(100vh-200px)] bg-gray-50/50">
        {conversation.map((msg, index) => (
          <React.Fragment key={`${msg.sender}-${msg.timestamp}-${index}`}>
            {msg.isNewSuggestionGroup && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  my: 3,
                  px: 2,
                }}
              >
                <Divider
                  sx={{
                    flex: 1,
                    borderColor: '#d1d5db',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    mx: 2,
                    color: '#6b7280',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    backgroundColor: '#f7f7f8',
                    px: 1,
                    borderRadius: '4px',
                  }}
                >
                  New Chat
                </Typography>
                <Divider
                  sx={{
                    flex: 1,
                    borderColor: '#d1d5db',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                  }}
                />
              </Box>
            )}
            <div
        className={`message ${msg.sender === 'user' ? 'user-message' : 'assistant-message'}`}
      >
        <div className="message-sender">
          {msg.sender === 'assistant' ? 'ReplyAI' : 'You'} • {formatDate(msg.timestamp)}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '4px 0',
            gap: '8px',
          }}
        >
          <div style={{ flex: 1 }} className="message-content">
            {msg.text}
          </div>
          {msg.sender === 'assistant' && (
            <IconButton
              size="small"
              onClick={() => handleCopyClick(msg.text)}
              style={{ color: '#3b82f6' }}
              aria-label="copy"
            >
              <CopyIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>
    </React.Fragment>
  ))}

        {isLoading && (
          <div className="loading-indicator flex justify-center my-4">
            <CircularProgress size={24} sx={{ color: '#3b82f6' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-container p-6 bg-white/90 backdrop-blur-lg shadow-md">
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ color: '#6b7280' }}>Gender</InputLabel>
            <Select
              value={gender}
              label="Gender"
              onChange={(e) => setGender(e.target.value)}
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                },
              }}
            >
              <MenuItem value="unknown">Không xác định</MenuItem>
              <MenuItem value="male">Nam</MenuItem>
              <MenuItem value="female">Nữ</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ color: '#6b7280' }}>Tone</InputLabel>
            <Select
              value={tone}
              label="Tone"
              onChange={(e) => setTone(e.target.value)}
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                },
              }}
            >
              <MenuItem value="friendly">Thân thiện</MenuItem>
              <MenuItem value="professional">Chuyên nghiệp</MenuItem>
              <MenuItem value="casual">Thường ngày</MenuItem>
              <MenuItem value="funny">Hài hước</MenuItem>
              <MenuItem value="formal">Trang trọng</MenuItem>
              <MenuItem value="flirty">Tán tỉnh nhẹ nhàng</MenuItem>
              <MenuItem value="romantic">Lãng mạn</MenuItem>
              <MenuItem value="playful">Đùa vui</MenuItem>
              <MenuItem value="mysterious">Bí ẩn</MenuItem>
              <MenuItem value="sweet">Ngọt ngào</MenuItem>
              <MenuItem value="passionate">Nồng nhiệt</MenuItem>
              <MenuItem value="caring">Quan tâm</MenuItem>
              <MenuItem value="teasing">Trêu ghẹo</MenuItem>
              <MenuItem value="poetic">Thơ mộng</MenuItem>
              <MenuItem value="gentleman">Lịch lãm</MenuItem>
              <MenuItem value="shy">E ngại</MenuItem>
              <MenuItem value="bold">Bạo dạn</MenuItem>
              <MenuItem value="first-meet">Lần đầu gặp</MenuItem>
              <MenuItem value="long-term">Quen biết lâu</MenuItem>
              <MenuItem value="apologetic">Hối lỗi</MenuItem>
              <MenuItem value="reconcile">Làm lành</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ color: '#6b7280' }}>Language</InputLabel>
            <Select
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                },
              }}
            >
              <MenuItem value="Vietnamese">Tiếng Việt</MenuItem>
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Chinese">中文 (Chinese)</MenuItem>
              <MenuItem value="Cantonese">廣東話 (Cantonese)</MenuItem>
              <MenuItem value="Japanese">日本語 (Japanese)</MenuItem>
              <MenuItem value="Korean">한국어 (Korean)</MenuItem>
              <MenuItem value="Thai">ไทย (Thai)</MenuItem>
              <MenuItem value="French">Français (French)</MenuItem>
              <MenuItem value="Spanish">Español (Spanish)</MenuItem>
              <MenuItem value="German">Deutsch (German)</MenuItem>
              <MenuItem value="Italian">Italiano (Italian)</MenuItem>
              <MenuItem value="Russian">Русский (Russian)</MenuItem>
              <MenuItem value="Portuguese">Português (Portuguese)</MenuItem>
              <MenuItem value="Hindi">हिन्दी (Hindi)</MenuItem>
              <MenuItem value="Arabic">العربية (Arabic)</MenuItem>
              <MenuItem value="Indonesian">Bahasa Indonesia</MenuItem>
              <MenuItem value="Malay">Bahasa Melayu</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleGetSuggestions}
            disabled={conversation.length === 0 || isLoading}
            startIcon={<RefreshIcon />}
            sx={{
              mb: 1,
              background: 'linear-gradient(to right, #3b82f6, #a855f7)',
              borderRadius: 2,
              textTransform: 'none',
              px: 4,
              '&:hover': {
                background: 'linear-gradient(to right, #2563eb, #9333ea)',
              },
              '&:disabled': {
                background: '#d1d5db',
              },
            }}
          >
            Get Suggestions
          </Button>
        </Box>

        <Box className="input-box flex gap-3 items-center">
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message ReplyAI..."
            className="text-field bg-gray-50"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#3b82f6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6',
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            startIcon={<SendIcon />}
            sx={{
              background: 'linear-gradient(to right, #3b82f6, #a855f7)',
              borderRadius: 2,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(to right, #2563eb, #9333ea)',
              },
              '&:disabled': {
                background: '#d1d5db',
              },
            }}
          >
            Send
          </Button>
        </Box>
      </div>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          severity="error"
          sx={{ width: '100%', borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
      >
        <Alert
          severity="success"
          sx={{ width: '100%', borderRadius: 2 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      </Snackbar>
    </div>
  </div>
);
}

export default App;