// Backend API server for HorseAI.life
// This is a simple Express server to handle API requests

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sample data
let users = [
    {
        id: 1,
        fullName: 'John Smith',
        email: 'john@example.com',
        password: 'Password123!', // In a real app, this would be hashed
        userType: 'breeder',
        farmName: 'Smith Equestrian',
        profileImage: null
    }
];

let stallions = [
    {
        id: 1,
        userId: 1,
        name: "Thunder's Legacy",
        breed: "Thoroughbred",
        age: 8,
        lineage: "Son of Triple Crown winner Gallant Thunder",
        description: "Known for speed and agility, Thunder's Legacy has produced multiple race winners.",
        price: 3500,
        status: 'active',
        image: "/api/placeholder/600/400"
    },
    {
        id: 2,
        userId: 1,
        name: "Midnight Commander",
        breed: "Arabian",
        age: 10,
        lineage: "Descended from the legendary Al-Marah bloodline",
        description: "Exceptional conformation with proven genetics for endurance and beauty.",
        price: 4200,
        status: 'active',
        image: "/api/placeholder/600/400"
    },
    {
        id: 3,
        userId: 1,
        name: "Royal Prestige",
        breed: "Andalusian",
        age: 7,
        lineage: "Direct descendant of Favorito VII",
        description: "Impressive dressage performer with excellent temperament and movement.",
        price: 5000,
        status: 'inactive',
        image: "/api/placeholder/600/400"
    }
];

let orders = [
    {
        id: 1,
        userId: 1,
        stallionId: 2,
        customerName: 'Amy Williams',
        customerEmail: 'amy@example.com',
        status: 'pending',
        total: 4200,
        date: '2025-05-14'
    },
    {
        id: 2,
        userId: 1,
        stallionId: 1,
        customerName: 'Robert Johnson',
        customerEmail: 'robert@example.com',
        status: 'completed',
        total: 3500,
        date: '2025-05-10'
    }
];

let messages = [
    {
        id: 1,
        userId: 1,
        sender: 'Amy Williams',
        senderEmail: 'amy@example.com',
        subject: 'Inquiry about Thunder\'s Legacy',
        message: 'I\'m interested in your stallion Thunder\'s Legacy. Is he still available for breeding this season? I have a mare that I believe would be a good match.',
        date: '2025-05-15',
        read: false
    },
    {
        id: 2,
        userId: 1,
        sender: 'System',
        senderEmail: 'noreply@horseai.life',
        subject: 'Profile Approval',
        message: 'Your stallion profile for Midnight Commander has been approved and is now visible to potential customers.',
        date: '2025-05-13',
        read: true
    }
];

// Authentication routes
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // In a real app, you would generate a JWT token here
        const token = 'dummy_token_' + Date.now();
        
        // Return user data without password
        const { password, ...userData } = user;
        
        res.json({
            success: true,
            token,
            user: userData
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { fullName, email, password, userType, farmName } = req.body;
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({
            success: false,
            message: 'Email already in use'
        });
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        fullName,
        email,
        password, // In a real app, this would be hashed
        userType,
        farmName,
        profileImage: null
    };
    
    // Add user to database
    users.push(newUser);
    
    // In a real app, you would generate a JWT token here
    const token = 'dummy_token_' + Date.now();
    
    // Return user data without password
    const { password: pwd, ...userData } = newUser;
    
    res.json({
        success: true,
        token,
        user: userData
    });
});

// Stallion routes
app.get('/api/stallions', (req, res) => {
    // Filter by query parameters if provided
    let filteredStallions = [...stallions];
    
    if (req.query.userId) {
        filteredStallions = filteredStallions.filter(s => s.userId === parseInt(req.query.userId));
    }
    
    if (req.query.status) {
        filteredStallions = filteredStallions.filter(s => s.status === req.query.status);
    }
    
    if (req.query.breed) {
        filteredStallions = filteredStallions.filter(s => s.breed === req.query.breed);
    }
    
    res.json({
        success: true,
        stallions: filteredStallions
    });
});

app.get('/api/stallions/:id', (req, res) => {
    const stallion = stallions.find(s => s.id === parseInt(req.params.id));
    
    if (stallion) {
        res.json({
            success: true,
            stallion
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Stallion not found'
        });
    }
});

app.post('/api/stallions', upload.single('image'), (req, res) => {
    const { name, breed, age, price, lineage, description, status, userId } = req.body;
    
    // Validate required fields
    if (!name || !breed || !age || !price || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
    }
    
    // Create new stallion
    const newStallion = {
        id: stallions.length + 1,
        userId: parseInt(userId),
        name,
        breed,
        age: parseInt(age),
        price: parseInt(price),
        lineage: lineage || '',
        description: description || '',
        status: status || 'active',
        image: req.file ? `/uploads/${req.file.filename}` : '/api/placeholder/600/400'
    };
    
    // Add stallion to database
    stallions.push(newStallion);
    
    res.json({
        success: true,
        stallion: newStallion
    });
});

app.put('/api/stallions/:id', upload.single('image'), (req, res) => {
    const stallionId = parseInt(req.params.id);
    const { name, breed, age, price, lineage, description, status } = req.body;
    
    // Find stallion
    const stallionIndex = stallions.findIndex(s => s.id === stallionId);
    
    if (stallionIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Stallion not found'
        });
    }
    
    // Update stallion
    const updatedStallion = {
        ...stallions[stallionIndex],
        name: name || stallions[stallionIndex].name,
        breed: breed || stallions[stallionIndex].breed,
        age: age ? parseInt(age) : stallions[stallionIndex].age,
        price: price ? parseInt(price) : stallions[stallionIndex].price,
        lineage: lineage !== undefined ? lineage : stallions[stallionIndex].lineage,
        description: description !== undefined ? description : stallions[stallionIndex].description,
        status: status || stallions[stallionIndex].status,
        image: req.file ? `/uploads/${req.file.filename}` : stallions[stallionIndex].image
    };
    
    // Update in database
    stallions[stallionIndex] = updatedStallion;
    
    res.json({
        success: true,
        stallion: updatedStallion
    });
});

app.delete('/api/stallions/:id', (req, res) => {
    const stallionId = parseInt(req.params.id);
    
    // Find stallion
    const stallionIndex = stallions.findIndex(s => s.id === stallionId);
    
    if (stallionIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Stallion not found'
        });
    }
    
    // Remove stallion from database
    stallions.splice(stallionIndex, 1);
    
    res.json({
        success: true,
        message: 'Stallion deleted successfully'
    });
});

// Order routes
app.get('/api/orders', (req, res) => {
    // Filter by query parameters if provided
    let filteredOrders = [...orders];
    
    if (req.query.userId) {
        filteredOrders = filteredOrders.filter(o => o.userId === parseInt(req.query.userId));
    }
    
    if (req.query.status) {
        filteredOrders = filteredOrders.filter(o => o.status === req.query.status);
    }
    
    res.json({
        success: true,
        orders: filteredOrders
    });
});

app.post('/api/orders', (req, res) => {
    const { userId, stallionId, customerName, customerEmail, total, shippingAddress } = req.body;
    
    // Validate required fields
    if (!userId || !stallionId || !customerName || !customerEmail || !total) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
    }
    
    // Create new order
    const newOrder = {
        id: orders.length + 1,
        userId: parseInt(userId),
        stallionId: parseInt(stallionId),
        customerName,
        customerEmail,
        status: 'pending',
        total: parseInt(total),
        date: new Date().toISOString().split('T')[0],
        shippingAddress: shippingAddress || {}
    };
    
    // Add order to database
    orders.push(newOrder);
    
    res.json({
        success: true,
        order: newOrder
    });
});

app.put('/api/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    
    // Find order
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }
    
    // Update order
    const updatedOrder = {
        ...orders[orderIndex],
        status: status || orders[orderIndex].status
    };
    
    // Update in database
    orders[orderIndex] = updatedOrder;
    
    res.json({
        success: true,
        order: updatedOrder
    });
});

// Message routes
app.get('/api/messages', (req, res) => {
    // Filter by query parameters if provided
    let filteredMessages = [...messages];
    
    if (req.query.userId) {
        filteredMessages = filteredMessages.filter(m => m.userId === parseInt(req.query.userId));
    }
    
    if (req.query.read !== undefined) {
        const read = req.query.read === 'true';
        filteredMessages = filteredMessages.filter(m => m.read === read);
    }
    
    res.json({
        success: true,
        messages: filteredMessages
    });
});

app.post('/api/messages', (req, res) => {
    const { userId, sender, senderEmail, subject, message } = req.body;
    
    // Validate required fields
    if (!userId || !sender || !senderEmail || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
    }
    
    // Create new message
    const newMessage = {
        id: messages.length + 1,
        userId: parseInt(userId),
        sender,
        senderEmail,
        subject,
        message,
        date: new Date().toISOString().split('T')[0],
        read: false
    };
    
    // Add message to database
    messages.push(newMessage);
    
    res.json({
        success: true,
        message: newMessage
    });
});

app.put('/api/messages/:id', (req, res) => {
    const messageId = parseInt(req.params.id);
    const { read } = req.body;
    
    // Find message
    const messageIndex = messages.findIndex(m => m.id === messageId);
    
    if (messageIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Message not found'
        });
    }
    
    // Update message
    const updatedMessage = {
        ...messages[messageIndex],
        read: read !== undefined ? read : messages[messageIndex].read
    };
    
    // Update in database
    messages[messageIndex] = updatedMessage;
    
    res.json({
        success: true,
        message: updatedMessage
    });
});

// User routes
app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    
    // Find user
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    // Return user data without password
    const { password, ...userData } = user;
    
    res.json({
        success: true,
        user: userData
    });
});

app.put('/api/users/:id', upload.single('profileImage'), (req, res) => {
    const userId = parseInt(req.params.id);
    const { fullName, farmName } = req.body;
    
    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    // Update user
    const updatedUser = {
        ...users[userIndex],
        fullName: fullName || users[userIndex].fullName,
        farmName: farmName !== undefined ? farmName : users[userIndex].farmName,
        profileImage: req.file ? `/uploads/${req.file.filename}` : users[userIndex].profileImage
    };
    
    // Update in database
    users[userIndex] = updatedUser;
    
    // Return user data without password
    const { password, ...userData } = updatedUser;
    
    res.json({
        success: true,
        user: userData
    });
});

// Dashboard stats
app.get('/api/stats/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    
    // Calculate stats
    const activeStallions = stallions.filter(s => s.userId === userId && s.status === 'active').length;
    const pendingOrders = orders.filter(o => o.userId === userId && o.status === 'pending').length;
    
    // Calculate monthly revenue
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    let monthlyRevenue = 0;
    
    orders.forEach(order => {
        const orderDate = new Date(order.date);
        
        if (order.userId === userId && 
            orderDate.getMonth() === currentMonth && 
            orderDate.getFullYear() === currentYear &&
            order.status === 'completed') {
            monthlyRevenue += order.total;
        }
    });
    
    // Random profile views (in a real app, this would be tracked)
    const profileViews = Math.floor(Math.random() * 2000) + 500;
    
    res.json({
        success: true,
        stats: {
            activeStallions,
            pendingOrders,
            monthlyRevenue,
            profileViews
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API base URL: http://localhost:${port}/api`);
});
