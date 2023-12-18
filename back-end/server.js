import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import 'dotenv/config'

const port = 3001;
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));
console.log(process.env.SECRET);
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

app.use(passport.initialize());
app.use(passport.session())

const uri = "mongodb://localhost:27017/tripapp"

mongoose
.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("connected to MongoDB using Mongoose"))
.catch(err => console.log("Could not connect to MongoDB", err));

passport.use(new LocalStrategy(
  async(username, password, done) =>{
       const user = await User.findOne({ username: username })
       console.log(user);
      if(!user || !bcrypt.compareSync(password, user.password)){
          return done(null, false, { message: 'Incorrect username or password.' })
      }
      return done(null, user);
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
      done(null, user);
  }).catch(err => {
      done(err);
  });
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', userSchema);


const tripSchema = new mongoose.Schema({
  destination: String,
  startDate: Date,
  endDate: Date,
  description: String,
  budget: Number,
  activities: [String]
});

const Trip = mongoose.model('Trip', tripSchema);

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(`${req.method} request for ${req.url} by ${req.user.username}`);
  }
  next();
});
  
app.get('/', (req, res) =>{
  res.render('index',{user: req.user})
})
  
app.get('/register', (req, res)=>{
      res.render('register');
})

app.post('/register', async(req,res)=>{
  try{
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({username:req.body.username, password: hashedPassword});
      await newUser.save()
      res.redirect('/login');
  }catch(error){
      console.error(error, "Error has accrued while registering");
      res.redirect('/register')
  }
})

app.get('/login', (req, res)=>{
  res.render('login')
});

app.post('/login', passport.authenticate('local', {failureRedirect:'/login',failureMessage: true, successMessage:true} ), (req, res)=>{
  console.log(req.user);
  res.redirect('/' );
})

app.get('/logout', (req, res) => {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
  });
});

//trips list
app.get('/api/trips', isAuthenticated, async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json({ trips });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/trips/new', (req, res) => {
  res.render('addTrip');
});

//create new trip
app.post('/api/trips', [
  body('destination').isLength({ min: 1 }),
  body('startDate').isISO8601().toDate(),
  body('endDate').isISO8601().toDate(),
  body('description').isString(),
  body('budget').isNumeric(),
  body('activities.*').isString()
], isAuthenticated, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { destination, startDate, endDate, description, budget, activities } = req.body;
  const newTrip = new Trip({ destination, startDate, endDate, description, budget, activities });
  try {
    const savedTrip = await newTrip.save();
    res.status(201).json({ trip: savedTrip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//trip detail
app.get('/api/trips/:id', isAuthenticated, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    res.json({ trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//update trip
app.put('/api/trips/:id', [
  body('destination').isLength({ min: 1 }),
  body('startDate').isISO8601().toDate(),
  body('endDate').isISO8601().toDate(),
  body('budget').isNumeric(),
  body('activities.*').isString()
], isAuthenticated, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { destination, startDate, endDate, description, budget, activities } = req.body;
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, {
      destination,
      startDate,
      endDate,
      description,
      budget,
      activities
    }, { new: true });
    res.status(200).json({ trip: updatedTrip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//delete trip
app.delete('/api/trips/:id', isAuthenticated, async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
