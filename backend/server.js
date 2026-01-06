require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Cho phép parse JSON body

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  gender: { type: String, default: 'unknown'},
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'No token provided' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ 
        success: false,
        error: 'Invalid or expired token' 
      });
    }
    
    // Kiểm tra userId trong token khớp với request (nếu có)
    if (req.params.userId && decoded.userId !== req.params.userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access to this resource'
      });
    }

    req.user = decoded;
    next();
  });
};
  
// Thêm route này trước các route khác
app.get('/api/validate-token', authenticateToken, (req, res) => {
  res.json({ 
    success: true,
    user: req.user 
  });
});
app.get('/api/conversations/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Unauthorized' }); // UserId mismatch
    }
    const conversations = await Conversation.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, password, gender } = req.body;
    
    // Thêm kiểm tra user tồn tại
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      gender
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      success: true, 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        gender: user.gender 
      } 
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: 'Failed to register user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        username: user.username,
        gender: user.gender
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});


// Define Conversation Schema
const conversationSchema = new mongoose.Schema({
  userId: String,
  messages: [{
    sender: String,
    text: String,
    timestamp: Date
  }],
  tone: String,
  language: String,
  platform: String,
  createdAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Save conversation to MongoDB
const saveConversation = async (userId, messages, tone, language, platform) => {
  try {
    const conversation = new Conversation({
      userId,
      messages,
      tone,
      language,
      platform
    });
    await conversation.save();
    return conversation._id;
  } catch (error) {
    console.error('Error saving conversation:', error);
    return null;
  }
};

// Get user's conversations
app.get('/api/conversations/:userId', authenticateToken, async (req, res) => {
  try {
    // Middleware đã kiểm tra quyền truy cập
    const conversations = await Conversation.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();
      
    res.json({ 
      success: true, 
      conversations 
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch conversations' 
    });
  }
});
app.get('/api/validate-token', authenticateToken, (req, res) => {
  try {
    // Nếu middleware authenticateToken pass thì token hợp lệ
    res.json({ 
      success: true,
      user: req.user,
      token: req.headers.authorization.split(' ')[1] // Trả về token hiện tại
    });
  } catch (error) {
    console.error('Error validating token:', error);
    res.status(500).json({
      success: false,
      error: 'Token validation failed'
    });
  }
});

// Get single conversation
app.get('/api/conversation/:id', authenticateToken, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id).lean();
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Kiểm tra quyền truy cập
    if (conversation.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    res.json({ success: true, conversation });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// API endpoint to generate message suggestions
app.post('/api/generate-suggestion', authenticateToken, async (req, res) => {
  try {
    const { conversationHistory, tone, language, gender, platform, conversationId } = req.body;
    const userId = req.user.userId; // Lấy userId từ token

    if (!conversationHistory || !tone || !gender) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const lastUserMessage = conversationHistory
      .filter(msg => msg.startsWith('user:'))
      .pop()
      ?.replace('user:', '')
      .trim();

    // gender = giới tính của ĐỐI PHƯƠNG trong đoạn chat
const senderGender =
  gender === 'male'
    ? 'nam'
    : gender === 'female'
    ? 'nữ'
    : 'không xác định';

// Vai trò của BẠN khi trả lời (xưng hô trung lập, không đoán giới tính bạn)
const userRole = 'bạn';

// Prompt rõ ràng, không đánh tráo vai
const prompt = `
Bạn là một trợ lý gợi ý trả lời tin nhắn.

Ngữ cảnh:
- Bạn đang đóng vai là ${userRole}, người NHẬN tin nhắn
- Tin nhắn được gửi từ một người ${senderGender}
- Văn phong mong muốn: ${tone}
- Ngôn ngữ: ${language}

Tin nhắn nhận được:
"${lastUserMessage}"

Yêu cầu:
1. Đưa ra các gợi ý trả lời phù hợp với nội dung tin nhắn
2. Giữ đúng ngôn ngữ ${language} và văn phong ${tone}
3. Đóng vai ${userRole} để trả lời (không nhầm vai người gửi)
4. Mỗi gợi ý là một câu hoàn chỉnh, tự nhiên
5. Đưa ra 5 gợi ý, đánh số theo thứ tự (1. → 5.)

Gợi ý trả lời:
`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        params: {
          key: process.env.GOOGLE_AI_API_KEY
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const responseText = response.data.candidates[0].content.parts[0].text;

    const suggestions = responseText
      .split('\n')
      .filter(line => line.match(/^\d\./))
      .map(line => line.replace(/^\d\.\s*/, '').trim())
      .filter(s => s.length > 0 && !s.includes('Tin nhắn nhận được'));

    const messages = conversationHistory.map(msg => {
      const [sender, text] = msg.split(':');
      return {
        sender: sender.trim(),
        text: text.trim(),
        timestamp: new Date()
      };
    });

    let newConversationId = conversationId;

    if (conversationId) {
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        const newMessages = suggestions.map(text => ({
          sender: 'assistant',
          text,
          timestamp: new Date()
        }));
        conversation.messages.push(...newMessages);
        await conversation.save();
      } else {
        return res.status(404).json({ success: false, error: 'Conversation not found' });
      }
    } else {
      newConversationId = await saveConversation(
        userId,
        [...messages, ...suggestions.map(text => ({
          sender: 'assistant',
          text,
          timestamp: new Date()
        }))],
        tone,
        language,
        platform
      );
    }

    res.json({
      success: true,
      suggestions,
      conversationId: newConversationId,
      fullResponse: responseText
    });
  } catch (error) {
    console.error('Error generating suggestion:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate suggestions',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} using Google AI REST API`);
});