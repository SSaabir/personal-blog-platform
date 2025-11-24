import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Admin from '../models/Admin.js';

dotenv.config();

const users = [
  {
    username: 'techguru',
    email: 'techguru@example.com',
    password: 'Password123',
    bio: 'Software engineer passionate about clean code and scalable systems. Love discussing tech trends and best practices.',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    username: 'foodie_jane',
    email: 'jane.food@example.com',
    password: 'Password123',
    bio: 'Food blogger exploring cuisines from around the world. Vegan recipes are my specialty!',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    username: 'fitnessfanatic',
    email: 'fitness@example.com',
    password: 'Password123',
    bio: 'Personal trainer and nutrition coach. Helping people transform their lives one workout at a time.',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    username: 'traveler_mike',
    email: 'mike.travels@example.com',
    password: 'Password123',
    bio: 'Digital nomad sharing stories from 50+ countries. Currently exploring Southeast Asia.',
    avatar: 'https://i.pravatar.cc/150?img=8'
  },
  {
    username: 'bookworm_sarah',
    email: 'sarah.books@example.com',
    password: 'Password123',
    bio: 'Literary critic and avid reader. Always happy to discuss plot twists and character development.',
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  {
    username: 'politico_observer',
    email: 'observer@example.com',
    password: 'Password123',
    bio: 'Political analyst providing unbiased commentary on current events and policy changes.',
    avatar: 'https://i.pravatar.cc/150?img=15'
  }
];

const posts = [
  // TechGuru's posts
  {
    title: 'Why TypeScript is Overrated: A Developer\'s Honest Take',
    content: `I know this is going to be controversial, but hear me out. After working with TypeScript for 3 years, I'm convinced it's become a religion rather than a practical tool.

Don't get me wrong - type safety is great. But the amount of boilerplate, the constant fighting with the compiler, and the false sense of security it provides makes me question if it's worth it.

JavaScript with good testing practices and proper documentation can be just as maintainable. The TypeScript community has become cult-like, dismissing any criticism as "you just don't understand types."

What are your thoughts? Am I crazy for preferring vanilla JS for most projects?`,
    author: 'techguru',
    tags: ['javascript', 'typescript', 'programming', 'controversial'],
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'
  },
  {
    title: 'Building Scalable Microservices: Best Practices for 2025',
    content: `Microservices architecture has evolved significantly. Here are the key patterns I've found essential:

1. **Event-Driven Architecture**: Use message queues for async communication
2. **API Gateway Pattern**: Single entry point for all client requests
3. **Circuit Breaker**: Prevent cascading failures
4. **Service Mesh**: Handle service-to-service communication
5. **Observability**: Comprehensive logging, monitoring, and tracing

The key is not to over-engineer. Start with a monolith and split when you actually need to scale specific components.`,
    author: 'techguru',
    tags: ['microservices', 'architecture', 'backend', 'scalability'],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'
  },
  {
    title: 'The Death of Senior Developers: Why AI Will Replace Us',
    content: `Unpopular opinion: GitHub Copilot and ChatGPT are just the beginning. Within 5 years, most senior developer positions will be obsolete.

I've been using AI coding assistants extensively, and they're already writing better code than many mid-level developers I've worked with. The trend is clear:

- AI can debug faster
- AI knows more patterns and libraries
- AI doesn't get tired or make careless mistakes
- AI costs less than a developer salary

The only developers who will survive are those who can manage AI teams and understand business requirements. Pure coding skills? Dead in 5 years.

Prove me wrong.`,
    author: 'techguru',
    tags: ['ai', 'future', 'careers', 'controversial', 'technology'],
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'
  },

  // Foodie Jane's posts
  {
    title: 'Why Veganism Isn\'t Just a Diet - It\'s a Moral Imperative',
    content: `I'm going to say it: if you care about animals, the environment, and your health, but you're still eating meat, you're a hypocrite.

The data is clear:
- Animal agriculture produces more greenhouse gases than all transportation combined
- Factory farming is literal torture
- Plant-based diets reverse heart disease

"But I buy local/organic meat" - you're still paying for death. There's no ethical way to kill a being that wants to live.

I know this is harsh, but someone needs to say it. The cognitive dissonance is real, and future generations will look back at meat-eaters the way we look at slaveholders.

Change my mind.`,
    author: 'foodie_jane',
    tags: ['vegan', 'ethics', 'environment', 'controversial', 'health'],
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800'
  },
  {
    title: '10 Easy Vegan Recipes for Beginners',
    content: `Transitioning to a plant-based diet doesn't have to be hard! Here are my favorite simple recipes:

1. **Chickpea Curry** - Coconut milk, chickpeas, spinach, spices
2. **Buddha Bowl** - Quinoa, roasted veggies, tahini dressing
3. **Lentil Soup** - Hearty, protein-packed, and delicious
4. **Veggie Stir-Fry** - Quick weeknight dinner
5. **Overnight Oats** - Perfect breakfast prep

Each recipe takes under 30 minutes and uses accessible ingredients. I'll share detailed instructions in upcoming posts!`,
    author: 'foodie_jane',
    tags: ['vegan', 'recipes', 'cooking', 'healthy', 'food'],
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
  },
  {
    title: 'Restaurant Review: Green Leaf Cafe',
    content: `Just visited the new vegan spot downtown and I'm impressed! The impossible burger actually tastes better than beef, and their cashew mac and cheese is incredible.

Prices are reasonable ($12-18 per entree), portions are generous, and the atmosphere is cozy. They also have great options for gluten-free folks.

Highly recommend the chocolate avocado mousse for dessert - you won't believe it's plant-based!`,
    author: 'foodie_jane',
    tags: ['vegan', 'restaurant', 'review', 'food'],
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'
  },

  // Fitness Fanatic's posts
  {
    title: 'Stop Body Positivity - Obesity is NOT Healthy',
    content: `I'm going to get canceled for this, but I don't care. The "body positivity" movement has gone too far.

Being obese is not healthy. Full stop. It increases your risk of:
- Heart disease
- Diabetes
- Cancer
- Joint problems
- Early death

Telling people to "love their body at any size" is literally encouraging them to die early. That's not compassionate - it's cruel.

We can be kind to people while still acknowledging medical facts. You can love someone and still want them to be healthy. 

Body positivity should be about accepting things you can't change (height, bone structure, skin), not celebrating preventable diseases.

Yes, shame is bad. But so is lying to people about their health.`,
    author: 'fitnessfanatic',
    tags: ['fitness', 'health', 'controversial', 'obesity', 'wellness'],
    coverImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800'
  },
  {
    title: 'My 90-Day Transformation: From Couch to Marathon',
    content: `Three months ago, I couldn't run a mile. Today, I completed my first marathon in 4:15!

Here's what worked:
- Started with Couch to 5K program
- Built mileage gradually (10% per week)
- Cross-trained with strength work
- Proper nutrition and sleep
- Found a running group for accountability

The mental barriers were harder than the physical ones. Your body can do so much more than your mind thinks. Just start!`,
    author: 'fitnessfanatic',
    tags: ['fitness', 'running', 'motivation', 'health', 'transformation'],
    coverImage: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800'
  },
  {
    title: 'Best Home Workout Equipment Under $200',
    content: `You don't need a fancy gym membership! Here's my essential home gym setup:

- Resistance bands ($20) - Versatile for all muscle groups
- Adjustable dumbbells ($150) - Space-saving and effective
- Yoga mat ($25) - For stretching and bodyweight work
- Pull-up bar ($30) - Best bang for your buck

Total: $225, but you can skip the dumbbells initially and just use bands. I've built significant muscle with just these tools.`,
    author: 'fitnessfanatic',
    tags: ['fitness', 'home-workout', 'equipment', 'budget'],
    coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'
  },

  // Traveler Mike's posts
  {
    title: 'Why I Refuse to Visit America Anymore',
    content: `After traveling to 50+ countries, the USA is the only place I actively avoid now. Here's why:

1. **Healthcare costs** - Got food poisoning in Thailand, full hospital treatment = $50. Same thing in the US would bankrupt me.

2. **Gun violence** - I've felt safer in "dangerous" countries like Colombia than in American cities.

3. **Tipping culture** - Everywhere else pays workers properly. Why should I subsidize employers?

4. **Airport security theater** - TSA is the most inefficient, invasive system I've encountered.

5. **Car dependency** - No walkable cities, terrible public transit.

The "greatest country on earth" narrative is propaganda. Most Americans haven't traveled enough to realize how far behind they are.

Come at me, patriots.`,
    author: 'traveler_mike',
    tags: ['travel', 'usa', 'controversial', 'politics', 'culture'],
    coverImage: 'https://images.unsplash.com/photo-1564585217132-4f37249d3a8c?w=800'
  },
  {
    title: 'Digital Nomad Guide: Best Cities in Southeast Asia',
    content: `After 2 years in SEA, here are my top picks for remote workers:

**Chiang Mai, Thailand** - $800/month, great cafes, strong expat community
**Da Nang, Vietnam** - Beach city, $700/month, amazing food
**Ubud, Bali** - Cultural hub, $900/month, yoga and wellness focused
**Penang, Malaysia** - Underrated gem, $600/month, diverse food scene

All have reliable internet, affordable CoL, and great weather. Chiang Mai is best for first-timers.`,
    author: 'traveler_mike',
    tags: ['travel', 'digital-nomad', 'southeast-asia', 'remote-work'],
    coverImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800'
  },
  {
    title: 'Travel Photography Tips: Capturing Authentic Moments',
    content: `Forget the touristy shots. Here's how to take memorable travel photos:

1. Wake up early - Golden hour light is magical
2. Talk to locals - Best photos come from genuine interactions
3. Shoot in RAW - More editing flexibility
4. Use leading lines - Guide viewer's eye through the frame
5. Include people - Adds scale and emotion

My favorite lens for travel is a 35mm prime - forces you to move and think about composition.`,
    author: 'traveler_mike',
    tags: ['travel', 'photography', 'tips', 'creativity'],
    coverImage: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800'
  },

  // Bookworm Sarah's posts
  {
    title: 'Modern Literature is Trash: We Need to Admit It',
    content: `Hot take: 99% of books published today are forgettable garbage, and the publishing industry is to blame.

Compare any bestseller from 2024 to classics like Dostoevsky, Tolstoy, or even Hemingway. There's no comparison. Modern books are:

- Formulaic plot structures designed by marketing teams
- Shallow characters with no depth
- Written at a 6th-grade reading level for mass appeal
- More focused on "representation" than actual storytelling

BookTok has made it worse - people read 100 books a year but can't analyze a single one. Quantity over quality.

The last truly great American novel was probably published in the 1990s. Everything since is just commercial content.

Tell me I'm wrong. I dare you.`,
    author: 'bookworm_sarah',
    tags: ['books', 'literature', 'controversial', 'reading', 'criticism'],
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'
  },
  {
    title: 'Book Review: "The Midnight Library" by Matt Haig',
    content: `A beautiful exploration of regret, choice, and what makes life worth living.

The premise is simple but profound: Nora finds herself in a library between life and death, where each book lets her live a different version of her life based on different choices.

Haig's writing is accessible without being simplistic. The philosophy hits deep without being preachy. Perfect for anyone struggling with "what if" thoughts.

Rating: 4.5/5 stars. Highly recommend for fans of magical realism and philosophical fiction.`,
    author: 'bookworm_sarah',
    tags: ['books', 'review', 'fiction', 'reading'],
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'
  },
  {
    title: 'My Reading Challenge: 52 Books in 52 Weeks',
    content: `Halfway through my year-long reading challenge! Here are some insights:

**What I've learned:**
- Audiobooks during commute = game changer
- Quality matters more than quantity
- Diversifying genres prevents burnout
- Book clubs keep you accountable

**Top 5 so far:**
1. Tomorrow, and Tomorrow, and Tomorrow
2. Demon Copperhead
3. The Ocean at the End of the Lane
4. Mexican Gothic
5. Project Hail Mary

Current count: 26 books. On track! What are you reading?`,
    author: 'bookworm_sarah',
    tags: ['books', 'reading', 'challenge', 'recommendations'],
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800'
  },

  // Politico Observer's posts
  {
    title: 'Democracy is Dying and Nobody Seems to Care',
    content: `We're witnessing the slow collapse of democratic institutions worldwide, and everyone's too busy scrolling TikTok to notice.

**The evidence:**
- Rising authoritarianism in 73 countries
- Declining trust in elections and media
- Polarization making compromise impossible
- Social media destroying shared reality
- Young people don't even value democracy anymore

In 20 years, our kids will ask "how did you let this happen?" and we'll have no good answer. We saw it coming and did nothing.

The time to act is now. Get involved locally. Vote in EVERY election. Support independent journalism. Talk to people who disagree with you.

Or don't, and watch everything burn. Your choice.`,
    author: 'politico_observer',
    tags: ['politics', 'democracy', 'controversial', 'society', 'activism'],
    coverImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800'
  },
  {
    title: 'Understanding the 2025 Climate Policy Debate',
    content: `Breaking down the major climate proposals and what they actually mean:

**Carbon Tax Approach:**
- Pros: Market-based, economically efficient
- Cons: Regressive, politically unpopular

**Green New Deal 2.0:**
- Pros: Comprehensive, job creation
- Cons: Expensive, implementation challenges

**Technology Investment Strategy:**
- Pros: Innovation-focused, bipartisan support
- Cons: Slower timeline, uncertain outcomes

The reality? We probably need all three. Climate change won't be solved by a single policy. Nuance matters.`,
    author: 'politico_observer',
    tags: ['politics', 'climate', 'policy', 'environment', 'analysis'],
    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800'
  },
  {
    title: 'The Real Reason Behind the Housing Crisis',
    content: `It's not just supply and demand. The housing crisis is a result of:

1. **Zoning laws** - Single-family zoning restricts density
2. **Investment firms** - Buying homes as assets, not housing
3. **NIMBYism** - Locals blocking new construction
4. **Stagnant wages** - Income hasn't kept pace with costs
5. **Tax policy** - Incentives favor investors over first-time buyers

Solutions exist: upzone cities, tax vacant properties, build public housing, increase wages. But powerful interests benefit from the status quo.

This isn't partisan - it's about who has the courage to challenge real estate lobbies.`,
    author: 'politico_observer',
    tags: ['politics', 'housing', 'economics', 'policy', 'crisis'],
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
  },

  // Additional balanced posts
  {
    title: 'Getting Started with Node.js: A Beginner\'s Guide',
    content: `Node.js is a powerful runtime for building server-side applications with JavaScript. Here's what you need to know:

**What is Node.js?**
- JavaScript runtime built on Chrome's V8 engine
- Event-driven, non-blocking I/O model
- Perfect for building scalable network applications

**First Steps:**
1. Install Node.js from nodejs.org
2. Learn npm (Node Package Manager)
3. Understand async/await and promises
4. Build a simple Express server

**Resources:**
- Official docs: nodejs.org/docs
- freeCodeCamp tutorials
- The Net Ninja YouTube channel

Happy coding!`,
    author: 'techguru',
    tags: ['nodejs', 'javascript', 'tutorial', 'programming', 'beginners'],
    coverImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800'
  },
  {
    title: 'Mediterranean Diet: Why It Works',
    content: `The Mediterranean diet consistently ranks as one of the healthiest eating patterns. Here's why:

**Key Components:**
- Olive oil as primary fat source
- Lots of vegetables, fruits, whole grains
- Fish and seafood twice weekly
- Moderate wine consumption
- Limited red meat

**Benefits:**
- Reduced heart disease risk
- Better cognitive function
- Anti-inflammatory effects
- Sustainable and enjoyable

It's not a "diet" - it's a lifestyle. No counting calories, just eating real, whole foods.`,
    author: 'foodie_jane',
    tags: ['health', 'diet', 'mediterranean', 'nutrition', 'wellness'],
    coverImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800'
  },
  {
    title: 'Budget Travel Hacks: How I Travel for $30/Day',
    content: `You don't need to be rich to see the world! Here are my money-saving strategies:

**Accommodation:**
- Hostels ($10-15/night)
- Couchsurfing (free)
- Work exchanges (free + experience)

**Food:**
- Cook your own meals
- Street food is cheap and delicious
- Eat where locals eat

**Transportation:**
- Buses over planes
- Walk whenever possible
- Rent bikes

**Activities:**
- Free walking tours
- Nature is free
- Local festivals and markets

I've traveled through Europe, Asia, and South America on a shoestring budget. It's totally doable!`,
    author: 'traveler_mike',
    tags: ['travel', 'budget', 'tips', 'backpacking', 'money'],
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'
  },
  {
    title: 'Building a Reading Habit: Practical Tips',
    content: `Struggling to read more? Here's what actually works:

**Start Small:**
- 10 pages a day beats binge reading
- Set a timer for 15 minutes
- Pick easy, enjoyable books first

**Remove Friction:**
- Keep a book visible
- Replace phone scrolling with reading
- Join a book club for accountability

**Track Progress:**
- Use Goodreads or a journal
- Celebrate milestones
- Don't force books you hate

Reading should be enjoyable, not a chore. Find what works for you!`,
    author: 'bookworm_sarah',
    tags: ['books', 'reading', 'habits', 'productivity', 'tips'],
    coverImage: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800'
  },
  {
    title: 'Strength Training for Beginners: The Basics',
    content: `New to lifting? Here's everything you need to know:

**The Big 5 Exercises:**
1. Squats - King of leg exercises
2. Deadlifts - Full body power
3. Bench Press - Upper body strength
4. Rows - Back development
5. Overhead Press - Shoulders

**Programming:**
- Start with 3 days/week
- Focus on form over weight
- Progressive overload is key
- Rest and recovery matter

**Nutrition:**
- Eat enough protein (0.8g per lb bodyweight)
- Slight calorie surplus to build muscle
- Stay hydrated

Consistency beats perfection. Just show up!`,
    author: 'fitnessfanatic',
    tags: ['fitness', 'strength-training', 'beginners', 'workout', 'health'],
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'
  },
  {
    title: 'Voter Turnout: Why Local Elections Matter More',
    content: `Everyone focuses on presidential elections, but local races have more impact on your daily life:

**What local officials control:**
- School funding and curriculum
- Police and public safety
- Zoning and development
- Parks and infrastructure
- Local taxes

**The problem:**
- Presidential elections: 60% turnout
- Local elections: Often under 20%
- Special interests dominate when people don't vote

**Take action:**
- Research your local candidates
- Vote in every election
- Attend city council meetings
- Contact your representatives

Change starts local. Get involved!`,
    author: 'politico_observer',
    tags: ['politics', 'voting', 'local-government', 'civic-duty', 'activism'],
    coverImage: 'https://images.unsplash.com/photo-1495566065170-a40fa54fc537?w=800'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Admin.deleteMany({});
    console.log('Cleared existing data');

    // Create admin account
    console.log('\nCreating admin account...');
    const adminPassword = await bcrypt.hash('Admin@123456', 10);
    const admin = await Admin.create({
      username: 'superadmin',
      email: 'admin@blogspace.com',
      password: adminPassword,
      role: 'super-admin',
      permissions: {
        canManageUsers: true,
        canManagePosts: true,
        canManageAdmins: true,
        canViewAnalytics: true
      },
      isActive: true
    });
    console.log(`✅ Created admin: ${admin.email}`);

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create posts
    const createdPosts = [];
    for (const postData of posts) {
      const author = createdUsers.find(u => u.username === postData.author);
      if (author) {
        const post = await Post.create({
          ...postData,
          author: author._id
        });
        createdPosts.push(post);
        console.log(`Created post: ${post.title}`);
      }
    }

    // Create some comments for engagement
    const commentTexts = [
      'Great post! Really insightful perspective.',
      'I completely disagree with this take.',
      'This changed my mind on the topic.',
      'Can you elaborate more on this point?',
      'Thanks for sharing your experience!',
      'Interesting read, though I have some concerns.',
      'This is exactly what I needed to hear today.',
      'Well researched and well written!',
      'I\'m not sure I agree, but I respect your opinion.',
      'Bookmarking this for later reference.',
      'Have you considered the counterargument?',
      'This resonates with my own experience.',
      'Could you provide some sources?',
      'Amazing insights! Shared with my network.',
      'I think you\'re missing a key point here.'
    ];

    // Add comments to each post (comments are embedded in Post model)
    for (const post of createdPosts) {
      const numComments = Math.floor(Math.random() * 4) + 2; // 2-5 comments
      const comments = [];
      
      for (let i = 0; i < numComments; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomComment = commentTexts[Math.floor(Math.random() * commentTexts.length)];
        
        comments.push({
          user: randomUser._id,
          text: randomComment,
          createdAt: new Date()
        });
      }
      
      post.comments = comments;
      await post.save();
      console.log(`Added ${numComments} comments to: ${post.title}`);
    }

    // Add some saved posts for users
    for (const user of createdUsers) {
      const randomPosts = createdPosts
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 5) + 1);
      
      user.savedPosts = randomPosts.map(p => p._id);
      await user.save();
      console.log(`Added ${user.savedPosts.length} saved posts for ${user.username}`);
    }

    console.log('\n=== Seed completed successfully! ===');
    console.log(`Created 1 admin account`);
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${createdPosts.length} posts`);
    console.log('\n=== Admin Credentials ===');
    console.log('Email: admin@blogspace.com');
    console.log('Password: Admin@123456');
    console.log('\n=== User Credentials ===');
    console.log('Email: [username]@example.com (e.g., techguru@example.com)');
    console.log('Password: Password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
