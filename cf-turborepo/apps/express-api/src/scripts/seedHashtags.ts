import mongoose from 'mongoose';
import { HashtagService } from '../services/hashtag.service';

const hashtagsByCategory = {
  campaign: [
    // General campaign tags
    'support', 'donate', 'charity', 'help', 'together', 'volunteer',
    'fundraising', 'noblecause', 'socialresponsibility', 'communitysupport',
    
    // Cystic Fibrosis specific
    'cysticfibrosis', '65roses', 'breathetogether', 'raredisease', 'geneticdisease',
    'treatment', 'therapy', 'rehabilitation', 'lunghealth', 'qualityoflife',
    'accessibletreatment', 'innovativetherapy', 'genetherapy', 'physiotherapy',
    'breathingexercises', 'inhalation', 'medicalequipment', 'medicalsupplies',
    
    // Financial aspects
    'emergencyhelp', 'financialsupport', 'medicalexpenses', 'equipmentpurchase',
    'fundraiser', 'donationaccount', 'transparency', 'accountability'
  ],

  news: [
    // News and events
    'news', 'current', 'event', 'conference', 'seminar', 'training',
    'medicalnews', 'healthcare', 'research', 'medicaldiscoveries',
    'clinicaltrials', 'healthpolicy', 'patientrights', 'healthinsurance',
    'europeanstandards', 'worldday', 'awarenesscampaign', 'medicalforum',
    
    // Specialized news
    'newtreatment', 'clinicalresults', 'medicalachievements', 'scientificpublications',
    'internationalnews', 'europeanpractices', 'healthinnovations', 'patientstories'
  ],

  blog: [
    // Blog posts
    'blog', 'article', 'healthblog', 'personalexperience', 'shared', 'advice',
    'healthyliving', 'balancednutrition', 'sports', 'activelife',
    'psychologicalsupport', 'emotionalhealth', 'stressmanagement', 'motivation',
    'inspiration', 'overcoming', 'selfhelp', 'lifelessons', 'healthyhabits',
    
    // Specialized topics
    'breathinggymnastics', 'dailycare', 'hygiene', 'prevention',
    'sportsactivity', 'balancedroutine', 'healthysleep', 'stresscontrol'
  ],

  recipe: [
    // Recipes and nutrition
    'recipe', 'healthyeating', 'diet', 'cooking', 'culinary', 'food',
    'highcalorie', 'proteinrich', 'vitaminrich', 'glutenfree', 'lactosefree',
    'vegan', 'vegetarian', 'lowcarb', 'homemade', 'quickrecipe',
    'healthydesserts', 'proteinsnacks', 'energybars', 'smoothie',
    
    // Specific diets
    'highenergy', 'fatrich', 'pancreaticenzymes', 'specialdiet',
    'supplements', 'vitamink', 'calcium', 'iron', 'zinc'
  ],

  story: [
    // Stories and experiences
    'story', 'sharedexperience', 'personalstory', 'success', 'struggle', 'hope',
    'patientstory', 'childstory', 'parentexperience', 'familysupport',
    'diagnosis', 'treatment', 'recovery', 'progress', 'challenges',
    'achievements', 'inspiringstory', 'lifelessons', 'strength',
    
    // Specific stories
    'childrenstories', 'youthstories', 'adultpatients', 'familystories',
    'schoollife', 'work', 'hobby', 'sports', 'travel', 'sociallife'
  ],

  initiative: [
    // Initiatives and projects
    'initiative', 'project', 'cause', 'communityactivity', 'volunteering',
    'socialprogram', 'educationalinitiative', 'sportsinitiative',
    'youthactivity', 'supportgroups', 'communityevents', 'charity',
    'socialintegration', 'awarenesscampaign', 'advocacy',
    
    // Specific initiatives
    'sportsday', 'arttherapy', 'musictherapy', 'educationalmeetings',
    'parentgroups', 'youthcamps', 'creativeworkshops'
  ],

  store: [
    // Store and products
    'store', 'products', 'medicalsupplies', 'assistivedevices',
    'inhalers', 'nebulizers', 'physiotherapydevices', 'sportsequipment',
    'supplements', 'vitamins', 'proteins', 'books', 'educationalmaterials',
    
    // Specific products
    'breathingdevices', 'sportsgear', 'hygienematerials', 'disinfectants',
    'masks', 'filters', 'cleaningsupplies', 'antibacterial'
  ],

  event: [
    // Events
    'event', 'conference', 'seminar', 'workshop', 'training', 'meeting',
    'charityevent', 'sportsevent', 'concert', 'exhibition',
    'infoday', 'discussion', 'roundtable', 'forum', 'festival',
    
    // Specific events
    'parentmeeting', 'youthmeeting', 'doctorsconference', 'patientforum',
    'onlineseminar', 'hybridevent', 'internationalmeeting'
  ],

  conference: [
    // Conferences
    'medicalconference', 'scientificconference', 'internationalcongress',
    'symposium', 'plenarysession', 'workshop', 'presentation', 'discussionpanel',
    'roundtable', 'expertmeeting', 'scientificevent', 'medicalforum',
    
    // Specific topics
    'newtherapies', 'clinicalstudies', 'scientificresults', 'medicalinnovations',
    'patientcare', 'multidisciplinaryapproach', 'internationalexperience'
  ],

  content: [
    // Content
    'article', 'publication', 'news', 'interview', 'report', 'analysis',
    'expertopinion', 'research', 'study', 'review', 'guide', 'advice',
    'educationalcontent', 'informationmaterials', 'video', 'podcast',
    
    // Specific content
    'scientificarticle', 'patientinformation', 'parentguide', 'medicaladvice',
    'practicalguidelines', 'healthrecommendations', 'bestpractices'
  ],

  chat: [
    // Chat and communication
    'chat', 'conversation', 'consultation', 'support', 'advice', 'sharing',
    'groupchat', 'privateconsultation', 'expertadvice', 'psychologicalsupport',
    'parentchat', 'youthchat', 'mutualhelp', 'onlinesupport',
    
    // Specific topics
    'medicalquestions', 'dailycare', 'emotionalsupport', 'socialconnections',
    'sharedexperience', 'mutualaid', 'supportgroups'
  ]
};

async function seedHashtags() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cf-association');
    
    console.log('Started seeding hashtags...');
    
    // Add hashtags for each category
    for (const [category, hashtags] of Object.entries(hashtagsByCategory)) {
      console.log(`Adding hashtags for category: ${category}`);
      
      for (const tag of hashtags) {
        try {
          await HashtagService.createOrUpdateHashtag(tag, category);
          console.log(`Added hashtag: ${tag}`);
        } catch (error) {
          console.error(`Error adding hashtag ${tag}:`, error);
        }
      }
    }
    
    console.log('Finished seeding hashtags!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding hashtags:', error);
    process.exit(1);
  }
}

seedHashtags(); 