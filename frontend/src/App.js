import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { AppBar, Toolbar, Typography, Button, Box, Container, Grid, Card, CardContent, CardMedia, Fab, Paper, TextField, List, ListItem, ListItemText, Slide } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const skins = [
  { name: 'Dragon Lore', price: 1200, img: 'https://skins.example.com/dragonlore.png' },
  { name: 'Howl', price: 900, img: 'https://skins.example.com/howl.png' },
  { name: 'Fade', price: 500, img: 'https://skins.example.com/fade.png' },
];

function Navbar() {
  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          SkinMarket
        </Typography>
        <Button color="inherit">Buy</Button>
        <Button color="inherit">Sell</Button>
        <Button color="inherit">Chat</Button>
      </Toolbar>
    </AppBar>
  );
}

function Hero() {
  return (
    <Box sx={{ py: 8, textAlign: 'center', background: 'linear-gradient(90deg, #6C63FF 0%, #00BFAE 100%)', color: '#fff', borderRadius: 3, mb: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Buy & Sell Game Skins
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        The chill, modern marketplace for you and your friends.
      </Typography>
      <Button variant="contained" color="secondary" size="large" sx={{ fontWeight: 700, borderRadius: 8 }}>
        Get Started
      </Button>
    </Box>
  );
}

function BuySection() {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Buy Skins</Typography>
      <Grid container spacing={3}>
        {skins.map((skin, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardMedia component="img" height="160" image={skin.img} alt={skin.name} />
              <CardContent>
                <Typography variant="h6" fontWeight={600}>{skin.name}</Typography>
                <Typography color="secondary" fontWeight={700}>${skin.price}</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 1, borderRadius: 2 }} fullWidth>Buy</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function SellSection() {
  const [skinName, setSkinName] = useState('');
  const [skinPrice, setSkinPrice] = useState('');
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Sell a Skin</Typography>
      <Paper sx={{ p: 3, borderRadius: 3, maxWidth: 400 }}>
        <TextField label="Skin Name" fullWidth sx={{ mb: 2 }} value={skinName} onChange={e => setSkinName(e.target.value)} />
        <TextField label="Price ($)" type="number" fullWidth sx={{ mb: 2 }} value={skinPrice} onChange={e => setSkinPrice(e.target.value)} />
        <Button variant="contained" color="secondary" fullWidth sx={{ borderRadius: 2 }} disabled>List for Sale (Demo)</Button>
      </Paper>
    </Box>
  );
}

function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hey! Need help with skins? Ask me anything.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error: Could not reach backend.' }]);
    }
    setLoading(false);
  };

  return (
    <>
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper elevation={6} sx={{ position: 'fixed', bottom: 90, right: 32, width: 340, maxHeight: 500, p: 2, borderRadius: 4, zIndex: 1300, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" fontWeight={700} color="primary" sx={{ mb: 1 }}>AI Chatbot</Typography>
          <Box sx={{ flex: 1, overflowY: 'auto', mb: 1, bgcolor: '#F5F7FA', p: 1, borderRadius: 2 }}>
            <List>
              {messages.map((msg, idx) => (
                <ListItem key={idx} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <ListItemText
                    primary={msg.text}
                    sx={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}
                    primaryTypographyProps={{ color: msg.sender === 'user' ? 'primary' : 'secondary' }}
                  />
                </ListItem>
              ))}
              {loading && (
                <ListItem>
                  <ListItemText primary="Bot is typing..." sx={{ textAlign: 'left' }} primaryTypographyProps={{ color: 'secondary' }} />
                </ListItem>
              )}
            </List>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              disabled={loading}
            />
            <Button variant="contained" onClick={handleSend} disabled={loading}>Send</Button>
          </Box>
        </Paper>
      </Slide>
      <Fab color="primary" aria-label="chat" sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1301 }} onClick={() => setOpen(o => !o)}>
        <ChatIcon />
      </Fab>
    </>
  );
}

function Footer() {
  return (
    <Box sx={{ mt: 8, py: 3, textAlign: 'center', color: 'text.secondary' }}>
      <Typography variant="body2">&copy; {new Date().getFullYear()} SkinMarket. All rights reserved.</Typography>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Container maxWidth="md">
          <Hero />
          <BuySection />
          <SellSection />
        </Container>
        <Footer />
        <ChatbotWidget />
      </Box>
    </ThemeProvider>
  );
}

export default App;
