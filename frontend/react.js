// src/App.js
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  TextField, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box,
  CircularProgress,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';

function App() {
  const [conversation, setConversation] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [platform, setPlatform] = useState('facebook');
  const [tone, setTone] = useState('friendly');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const updatedConversation = [...conversation, { sender: 'user', text: newMessage }];
      setConversation(updatedConversation);
      setNewMessage('');
    }
  };

  const handleGetSuggestions = async () => {
    if (conversation.length === 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationHistory: conversation.map(msg => `${msg.sender}: ${msg.text}`),
          platform,
          tone
        }),
      });
      
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSuggestion = (suggestion) => {
    setNewMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Messaging Assistant
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Conversation
          </Typography>
          <Box sx={{ height: '300px', overflowY: 'auto', mb: 2, p: 2, backgroundColor: '#f5f5f5' }}>
            <List>
              {conversation.map((msg, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={msg.text} 
                    secondary={msg.sender} 
                    sx={{ 
                      textAlign: msg.sender === 'user' ? 'right' : 'left',
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                value={platform}
                label="Platform"
                onChange={(e) => setPlatform(e.target.value)}
              >
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="zalo">Zalo</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Tone</InputLabel>
              <Select
                value={tone}
                label="Tone"
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="friendly">Friendly</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="funny">Funny</MenuItem>
              </Select>
            </FormControl>

            <Button 
              variant="contained" 
              onClick={handleGetSuggestions}
              disabled={conversation.length === 0 || isLoading}
              startIcon={<RefreshIcon />}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Get Suggestions'}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
            />
            <IconButton 
              color="primary" 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="large"
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>

        {suggestions.length > 0 && (
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Suggested Responses
            </Typography>
            <List>
              {suggestions.map((suggestion, index) => (
                <ListItem 
                  key={index} 
                  button 
                  onClick={() => handleUseSuggestion(suggestion)}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: '#f0f0f0',
                      cursor: 'pointer'
                    } 
                  }}
                >
                  <ListItemText primary={suggestion} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Container>
    </div>
  );
}

export default App;