import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type AiQueryInput = {
  query: Scalars['String']['input'];
};

export type AiResponse = {
  __typename?: 'AIResponse';
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  query: Scalars['String']['output'];
  response: Scalars['String']['output'];
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  postalCode?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
};

export type AddressInput = {
  city: Scalars['String']['input'];
  postalCode?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  token: Scalars['String']['output'];
  user: User;
};

export type BlogPost = {
  __typename?: 'BlogPost';
  approved: Scalars['Boolean']['output'];
  author: User;
  comments: Array<Comment>;
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  tags: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type BlogPostInput = {
  content: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  tags: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type Campaign = {
  __typename?: 'Campaign';
  createdAt: Scalars['Date']['output'];
  createdBy: User;
  currentAmount: Scalars['Float']['output'];
  description: Scalars['String']['output'];
  endDate?: Maybe<Scalars['Date']['output']>;
  events: Array<CampaignEvent>;
  goal: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  participants: Array<User>;
  participantsCount: Scalars['Int']['output'];
  pendingParticipants: Array<User>;
  pendingParticipantsCount: Scalars['Int']['output'];
  startDate: Scalars['Date']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type CampaignEvent = {
  __typename?: 'CampaignEvent';
  date: Scalars['Date']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type CampaignEventInput = {
  date: Scalars['Date']['input'];
  description: Scalars['String']['input'];
  location: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CampaignInput = {
  description: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['Date']['input']>;
  events?: InputMaybe<Array<CampaignEventInput>>;
  goal: Scalars['Float']['input'];
  startDate: Scalars['Date']['input'];
  title: Scalars['String']['input'];
};

export type CampaignNotification = {
  __typename?: 'CampaignNotification';
  id: Scalars['ID']['output'];
  pendingParticipants: Array<User>;
  pendingParticipantsCount: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type CampaignParticipationStatus =
  | 'APPROVED'
  | 'NOT_REGISTERED'
  | 'PENDING';

export type ChatMessage = {
  __typename?: 'ChatMessage';
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  receiver?: Maybe<User>;
  roomId?: Maybe<Scalars['String']['output']>;
  sender: User;
};

export type ChatMessageInput = {
  content: Scalars['String']['input'];
  receiverId?: InputMaybe<Scalars['ID']['input']>;
  roomId?: InputMaybe<Scalars['String']['input']>;
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type CommentInput = {
  content: Scalars['String']['input'];
  postId: Scalars['ID']['input'];
};

export type Conference = {
  __typename?: 'Conference';
  agenda: Array<ConferenceSession>;
  createdAt: Scalars['Date']['output'];
  createdBy: User;
  description: Scalars['String']['output'];
  endDate: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  location: Scalars['String']['output'];
  participants: Array<User>;
  startDate: Scalars['Date']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type ConferenceInput = {
  agenda: Array<ConferenceSessionInput>;
  description: Scalars['String']['input'];
  endDate: Scalars['Date']['input'];
  location: Scalars['String']['input'];
  startDate: Scalars['Date']['input'];
  title: Scalars['String']['input'];
};

export type ConferenceSession = {
  __typename?: 'ConferenceSession';
  description: Scalars['String']['output'];
  endTime: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  speaker: Scalars['String']['output'];
  startTime: Scalars['Date']['output'];
  title: Scalars['String']['output'];
};

export type ConferenceSessionInput = {
  description: Scalars['String']['input'];
  endTime: Scalars['Date']['input'];
  speaker: Scalars['String']['input'];
  startTime: Scalars['Date']['input'];
  title: Scalars['String']['input'];
};

export type Contact = {
  __typename?: 'Contact';
  alternativeEmail?: Maybe<Scalars['String']['output']>;
  emergencyContact?: Maybe<EmergencyContact>;
  phone?: Maybe<Scalars['String']['output']>;
};

export type ContactInput = {
  alternativeEmail?: InputMaybe<Scalars['String']['input']>;
  emergencyContact?: InputMaybe<EmergencyContactInput>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type Donation = {
  __typename?: 'Donation';
  amount: Scalars['Float']['output'];
  campaign?: Maybe<Campaign>;
  date: Scalars['Date']['output'];
  donor: Donor;
  id: Scalars['ID']['output'];
  items?: Maybe<Array<StoreItem>>;
};

export type DonationInput = {
  amount: Scalars['Float']['input'];
  campaignId?: InputMaybe<Scalars['ID']['input']>;
  items?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type Donor = {
  __typename?: 'Donor';
  createdAt: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  donations: Array<Donation>;
  id: Scalars['ID']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  totalDonations: Scalars['Float']['output'];
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<User>;
  website?: Maybe<Scalars['String']['output']>;
};

export type EmergencyContact = {
  __typename?: 'EmergencyContact';
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  relation: Scalars['String']['output'];
};

export type EmergencyContactInput = {
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  relation: Scalars['String']['input'];
};

export type Event = {
  __typename?: 'Event';
  createdAt: Scalars['Date']['output'];
  createdBy: User;
  date: Scalars['Date']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location: Scalars['String']['output'];
  participants: Array<User>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type EventInput = {
  date: Scalars['Date']['input'];
  description: Scalars['String']['input'];
  location: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type GoogleAuthInput = {
  idToken: Scalars['String']['input'];
};

export type Initiative = {
  __typename?: 'Initiative';
  createdAt: Scalars['Date']['output'];
  createdBy: User;
  description: Scalars['String']['output'];
  endDate?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  items: Array<InitiativeItem>;
  participants: Array<User>;
  participantsCount: Scalars['Int']['output'];
  pendingParticipants: Array<User>;
  pendingParticipantsCount: Scalars['Int']['output'];
  startDate: Scalars['Date']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type InitiativeInput = {
  description: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['Date']['input']>;
  items: Array<InitiativeItemInput>;
  startDate: Scalars['Date']['input'];
  title: Scalars['String']['input'];
};

export type InitiativeItem = {
  __typename?: 'InitiativeItem';
  description: Scalars['String']['output'];
  distributedQuantity: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
};

export type InitiativeItemInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCampaignEvent: CampaignEvent;
  addComment: Comment;
  addConferenceSession: ConferenceSession;
  addInitiativeItem: InitiativeItem;
  addUserToGroup: User;
  approveBlogPost: BlogPost;
  approveCampaignParticipant: Campaign;
  approveInitiativeParticipant: Scalars['Boolean']['output'];
  approveRecipe: Recipe;
  approveStory: Story;
  createBlogPost: BlogPost;
  createCampaign: Campaign;
  createConference: Conference;
  createDonation: Donation;
  createEvent: Event;
  createInitiative: Initiative;
  createNews: News;
  createRecipe: Recipe;
  createStoreItem: StoreItem;
  createStory: Story;
  deleteBlogPost: Scalars['Boolean']['output'];
  deleteCampaign: Scalars['Boolean']['output'];
  deleteCampaignEvent: Scalars['Boolean']['output'];
  deleteComment: Scalars['Boolean']['output'];
  deleteConference: Scalars['Boolean']['output'];
  deleteConferenceSession: Scalars['Boolean']['output'];
  deleteEvent: Scalars['Boolean']['output'];
  deleteInitiative: Scalars['Boolean']['output'];
  deleteInitiativeItem: Scalars['Boolean']['output'];
  deleteNews: Scalars['Boolean']['output'];
  deleteRecipe: Scalars['Boolean']['output'];
  deleteStoreItem: Scalars['Boolean']['output'];
  deleteStory: Scalars['Boolean']['output'];
  googleAuth: AuthResponse;
  joinCampaign: Campaign;
  joinConference: Conference;
  joinEvent: Event;
  joinInitiative: Scalars['Boolean']['output'];
  leaveCampaign: Campaign;
  leaveConference: Conference;
  leaveEvent: Event;
  leaveInitiative: Scalars['Boolean']['output'];
  login: AuthResponse;
  register: AuthResponse;
  rejectCampaignParticipant: Campaign;
  rejectInitiativeParticipant: Scalars['Boolean']['output'];
  removeUserFromGroup: User;
  resendVerificationEmail: Scalars['Boolean']['output'];
  sendChatMessage: ChatMessage;
  setUserRole: User;
  updateBlogPost: BlogPost;
  updateCampaign: Campaign;
  updateCampaignEvent: CampaignEvent;
  updateConference: Conference;
  updateConferenceSession: ConferenceSession;
  updateEvent: Event;
  updateInitiative: Initiative;
  updateInitiativeItem: InitiativeItem;
  updateNews: News;
  updateProfile: User;
  updateRecipe: Recipe;
  updateStoreItem: StoreItem;
  updateStory: Story;
  verifyEmail: VerificationResponse;
};


export type MutationAddCampaignEventArgs = {
  campaignId: Scalars['ID']['input'];
  input: CampaignEventInput;
};


export type MutationAddCommentArgs = {
  input: CommentInput;
};


export type MutationAddConferenceSessionArgs = {
  conferenceId: Scalars['ID']['input'];
  input: ConferenceSessionInput;
};


export type MutationAddInitiativeItemArgs = {
  initiativeId: Scalars['ID']['input'];
  input: InitiativeItemInput;
};


export type MutationAddUserToGroupArgs = {
  group: UserGroup;
  userId: Scalars['ID']['input'];
};


export type MutationApproveBlogPostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApproveCampaignParticipantArgs = {
  campaignId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationApproveInitiativeParticipantArgs = {
  initiativeId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationApproveRecipeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApproveStoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateBlogPostArgs = {
  input: BlogPostInput;
};


export type MutationCreateCampaignArgs = {
  input: CampaignInput;
};


export type MutationCreateConferenceArgs = {
  input: ConferenceInput;
};


export type MutationCreateDonationArgs = {
  input: DonationInput;
};


export type MutationCreateEventArgs = {
  input: EventInput;
};


export type MutationCreateInitiativeArgs = {
  input: InitiativeInput;
};


export type MutationCreateNewsArgs = {
  input: NewsInput;
};


export type MutationCreateRecipeArgs = {
  input: RecipeInput;
};


export type MutationCreateStoreItemArgs = {
  input: StoreItemInput;
};


export type MutationCreateStoryArgs = {
  input: StoryInput;
};


export type MutationDeleteBlogPostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCampaignArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCampaignEventArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationDeleteCommentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteConferenceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteConferenceSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInitiativeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInitiativeItemArgs = {
  itemId: Scalars['ID']['input'];
};


export type MutationDeleteNewsArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRecipeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStoreItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteStoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationGoogleAuthArgs = {
  input: GoogleAuthInput;
};


export type MutationJoinCampaignArgs = {
  id: Scalars['ID']['input'];
};


export type MutationJoinConferenceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationJoinEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationJoinInitiativeArgs = {
  initiativeId: Scalars['ID']['input'];
};


export type MutationLeaveCampaignArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLeaveConferenceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLeaveEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLeaveInitiativeArgs = {
  initiativeId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRejectCampaignParticipantArgs = {
  campaignId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRejectInitiativeParticipantArgs = {
  initiativeId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRemoveUserFromGroupArgs = {
  group: UserGroup;
  userId: Scalars['ID']['input'];
};


export type MutationSendChatMessageArgs = {
  input: ChatMessageInput;
};


export type MutationSetUserRoleArgs = {
  role: UserRole;
  userId: Scalars['ID']['input'];
};


export type MutationUpdateBlogPostArgs = {
  id: Scalars['ID']['input'];
  input: BlogPostInput;
};


export type MutationUpdateCampaignArgs = {
  id: Scalars['ID']['input'];
  input: CampaignInput;
};


export type MutationUpdateCampaignEventArgs = {
  eventId: Scalars['ID']['input'];
  input: CampaignEventInput;
};


export type MutationUpdateConferenceArgs = {
  id: Scalars['ID']['input'];
  input: ConferenceInput;
};


export type MutationUpdateConferenceSessionArgs = {
  input: ConferenceSessionInput;
  sessionId: Scalars['ID']['input'];
};


export type MutationUpdateEventArgs = {
  id: Scalars['ID']['input'];
  input: EventInput;
};


export type MutationUpdateInitiativeArgs = {
  id: Scalars['ID']['input'];
  input: InitiativeInput;
};


export type MutationUpdateInitiativeItemArgs = {
  input: InitiativeItemInput;
  itemId: Scalars['ID']['input'];
};


export type MutationUpdateNewsArgs = {
  id: Scalars['ID']['input'];
  input: NewsInput;
};


export type MutationUpdateProfileArgs = {
  input: ProfileUpdateInput;
};


export type MutationUpdateRecipeArgs = {
  id: Scalars['ID']['input'];
  input: RecipeInput;
};


export type MutationUpdateStoreItemArgs = {
  id: Scalars['ID']['input'];
  input: StoreItemInput;
};


export type MutationUpdateStoryArgs = {
  id: Scalars['ID']['input'];
  input: StoryInput;
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type News = {
  __typename?: 'News';
  author: User;
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  tags: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type NewsInput = {
  content: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  tags: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type NutritionalInfo = {
  __typename?: 'NutritionalInfo';
  calories: Scalars['Float']['output'];
  carbs: Scalars['Float']['output'];
  fat: Scalars['Float']['output'];
  protein: Scalars['Float']['output'];
  vitamins?: Maybe<Array<Vitamin>>;
};

export type NutritionalInfoInput = {
  calories: Scalars['Float']['input'];
  carbs: Scalars['Float']['input'];
  fat: Scalars['Float']['input'];
  protein: Scalars['Float']['input'];
  vitamins?: InputMaybe<Array<VitaminInput>>;
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  hasMore: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
  users: Array<User>;
};

export type ProfileUpdateInput = {
  address?: InputMaybe<AddressInput>;
  avatar?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  birthDate?: InputMaybe<Scalars['Date']['input']>;
  childName?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  contact?: InputMaybe<ContactInput>;
  diagnosed?: InputMaybe<Scalars['Boolean']['input']>;
  diagnosisYear?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  askAI?: Maybe<AiResponse>;
  getBlogPost?: Maybe<BlogPost>;
  getBlogPosts?: Maybe<Array<BlogPost>>;
  getCampaign?: Maybe<Campaign>;
  getCampaignEvents?: Maybe<Array<CampaignEvent>>;
  getCampaignNotifications?: Maybe<Array<CampaignNotification>>;
  getCampaigns?: Maybe<Array<Campaign>>;
  getChatMessages?: Maybe<Array<ChatMessage>>;
  getConference?: Maybe<Conference>;
  getConferences?: Maybe<Array<Conference>>;
  getCurrentUser?: Maybe<User>;
  getDonor?: Maybe<Donor>;
  getDonors?: Maybe<Array<Donor>>;
  getEvent?: Maybe<Event>;
  getEvents?: Maybe<Array<Event>>;
  getInitiative: Initiative;
  getInitiatives: Array<Initiative>;
  getNews?: Maybe<Array<News>>;
  getNewsItem?: Maybe<News>;
  getPaginatedUsers: PaginatedUsers;
  getPendingCampaignRequests?: Maybe<Array<Campaign>>;
  getPendingInitiativeRequests: Array<User>;
  getRecipe?: Maybe<Recipe>;
  getRecipes?: Maybe<Array<Recipe>>;
  getStoreItem?: Maybe<StoreItem>;
  getStoreItems?: Maybe<Array<StoreItem>>;
  getStories?: Maybe<Array<Story>>;
  getStory?: Maybe<Story>;
  getUser?: Maybe<User>;
  getUserCampaignStatus?: Maybe<Array<UserCampaignStatus>>;
  getUserCampaigns?: Maybe<Array<Campaign>>;
  getUserInitiatives: Array<Initiative>;
  getUsers?: Maybe<Array<User>>;
  getUsersByGroup?: Maybe<Array<User>>;
  getUsersByRole?: Maybe<Array<User>>;
};


export type QueryAskAiArgs = {
  query: Scalars['String']['input'];
};


export type QueryGetBlogPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetBlogPostsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetCampaignArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCampaignEventsArgs = {
  campaignId: Scalars['ID']['input'];
};


export type QueryGetCampaignsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetChatMessagesArgs = {
  roomId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetConferenceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetConferencesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetDonorArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetDonorsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetInitiativeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetInitiativesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetNewsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetNewsItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPaginatedUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPendingCampaignRequestsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPendingInitiativeRequestsArgs = {
  initiativeId: Scalars['ID']['input'];
};


export type QueryGetRecipeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetRecipesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetStoreItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetStoreItemsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetStoriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetStoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserCampaignsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetUserInitiativesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetUsersByGroupArgs = {
  group: UserGroup;
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetUsersByRoleArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  role: UserRole;
};

export type Recipe = {
  __typename?: 'Recipe';
  approved: Scalars['Boolean']['output'];
  author: User;
  cookingTime: Scalars['Int']['output'];
  createdAt: Scalars['Date']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  ingredients: Array<Scalars['String']['output']>;
  instructions: Array<Scalars['String']['output']>;
  nutritionalInfo: NutritionalInfo;
  preparationTime: Scalars['Int']['output'];
  servings: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type RecipeInput = {
  cookingTime: Scalars['Int']['input'];
  description: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  ingredients: Array<Scalars['String']['input']>;
  instructions: Array<Scalars['String']['input']>;
  nutritionalInfo: NutritionalInfoInput;
  preparationTime: Scalars['Int']['input'];
  servings: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type StoreItem = {
  __typename?: 'StoreItem';
  available: Scalars['Boolean']['output'];
  category: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type StoreItemInput = {
  category: Scalars['String']['input'];
  description: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
};

export type Story = {
  __typename?: 'Story';
  approved: Scalars['Boolean']['output'];
  author: User;
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type StoryInput = {
  content: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  campaignParticipantPending: CampaignNotification;
  messageSent: ChatMessage;
};


export type SubscriptionMessageSentArgs = {
  roomId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  groups?: Maybe<Array<UserGroup>>;
  isEmailVerified: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  profile?: Maybe<UserProfile>;
  role: UserRole;
  updatedAt: Scalars['Date']['output'];
};

export type UserCampaignStatus = {
  __typename?: 'UserCampaignStatus';
  campaign: Campaign;
  registeredAt?: Maybe<Scalars['Date']['output']>;
  status: CampaignParticipationStatus;
};

export type UserGroup =
  | 'blog'
  | 'campaigns'
  | 'conferences'
  | 'events'
  | 'initiatives'
  | 'news'
  | 'recipes';

export type UserProfile = {
  __typename?: 'UserProfile';
  address?: Maybe<Address>;
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  birthDate?: Maybe<Scalars['Date']['output']>;
  childName?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  contact?: Maybe<Contact>;
  diagnosed?: Maybe<Scalars['Boolean']['output']>;
  diagnosisYear?: Maybe<Scalars['Int']['output']>;
};

export type UserRole =
  | 'admin'
  | 'donor'
  | 'parent'
  | 'patient';

export type VerificationResponse = {
  __typename?: 'VerificationResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Vitamin = {
  __typename?: 'Vitamin';
  amount: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  unit: Scalars['String']['output'];
};

export type VitaminInput = {
  amount: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  unit: Scalars['String']['input'];
};

export type UserBasicFieldsFragment = { __typename?: 'User', _id: string, name: string, email: string, isEmailVerified: boolean };

export type UserProfileFieldsFragment = { __typename?: 'UserProfile', avatar?: string | null, bio?: string | null, birthDate?: any | null, diagnosed?: boolean | null, diagnosisYear?: number | null, childName?: string | null, companyName?: string | null, address?: { __typename?: 'Address', city: string, postalCode?: string | null, street?: string | null } | null, contact?: { __typename?: 'Contact', phone?: string | null, alternativeEmail?: string | null, emergencyContact?: { __typename?: 'EmergencyContact', name: string, phone: string, relation: string } | null } | null };

export type UserDetailedFieldsFragment = { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, createdAt: any, updatedAt: any, _id: string, name: string, email: string, isEmailVerified: boolean, profile?: { __typename?: 'UserProfile', avatar?: string | null, bio?: string | null, birthDate?: any | null, diagnosed?: boolean | null, diagnosisYear?: number | null, childName?: string | null, companyName?: string | null, address?: { __typename?: 'Address', city: string, postalCode?: string | null, street?: string | null } | null, contact?: { __typename?: 'Contact', phone?: string | null, alternativeEmail?: string | null, emergencyContact?: { __typename?: 'EmergencyContact', name: string, phone: string, relation: string } | null } | null } | null };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, createdAt: any, updatedAt: any, _id: string, name: string, email: string, isEmailVerified: boolean, profile?: { __typename?: 'UserProfile', avatar?: string | null, bio?: string | null, birthDate?: any | null, diagnosed?: boolean | null, diagnosisYear?: number | null, childName?: string | null, companyName?: string | null, address?: { __typename?: 'Address', city: string, postalCode?: string | null, street?: string | null } | null, contact?: { __typename?: 'Contact', phone?: string | null, alternativeEmail?: string | null, emergencyContact?: { __typename?: 'EmergencyContact', name: string, phone: string, relation: string } | null } | null } | null } } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, createdAt: any, updatedAt: any, _id: string, name: string, email: string, isEmailVerified: boolean, profile?: { __typename?: 'UserProfile', avatar?: string | null, bio?: string | null, birthDate?: any | null, diagnosed?: boolean | null, diagnosisYear?: number | null, childName?: string | null, companyName?: string | null, address?: { __typename?: 'Address', city: string, postalCode?: string | null, street?: string | null } | null, contact?: { __typename?: 'Contact', phone?: string | null, alternativeEmail?: string | null, emergencyContact?: { __typename?: 'EmergencyContact', name: string, phone: string, relation: string } | null } | null } | null } } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: ProfileUpdateInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, createdAt: any, updatedAt: any, _id: string, name: string, email: string, isEmailVerified: boolean, profile?: { __typename?: 'UserProfile', avatar?: string | null, bio?: string | null, birthDate?: any | null, diagnosed?: boolean | null, diagnosisYear?: number | null, childName?: string | null, companyName?: string | null, address?: { __typename?: 'Address', city: string, postalCode?: string | null, street?: string | null } | null, contact?: { __typename?: 'Contact', phone?: string | null, alternativeEmail?: string | null, emergencyContact?: { __typename?: 'EmergencyContact', name: string, phone: string, relation: string } | null } | null } | null } };

export type SetUserRoleMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  role: UserRole;
}>;


export type SetUserRoleMutation = { __typename?: 'Mutation', setUserRole: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, createdAt: any, updatedAt: any, _id: string, name: string, email: string, isEmailVerified: boolean, profile?: { __typename?: 'UserProfile', avatar?: string | null, bio?: string | null, birthDate?: any | null, diagnosed?: boolean | null, diagnosisYear?: number | null, childName?: string | null, companyName?: string | null, address?: { __typename?: 'Address', city: string, postalCode?: string | null, street?: string | null } | null, contact?: { __typename?: 'Contact', phone?: string | null, alternativeEmail?: string | null, emergencyContact?: { __typename?: 'EmergencyContact', name: string, phone: string, relation: string } | null } | null } | null } };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers?: Array<{ __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, createdAt: any, updatedAt: any, _id: string, name: string, email: string, isEmailVerified: boolean, profile?: { __typename?: 'UserProfile', avatar?: string | null, bio?: string | null, birthDate?: any | null, diagnosed?: boolean | null, diagnosisYear?: number | null, childName?: string | null, companyName?: string | null, address?: { __typename?: 'Address', city: string, postalCode?: string | null, street?: string | null } | null, contact?: { __typename?: 'Contact', phone?: string | null, alternativeEmail?: string | null, emergencyContact?: { __typename?: 'EmergencyContact', name: string, phone: string, relation: string } | null } | null } | null }> | null };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, createdAt: any, updatedAt: any, _id: string, name: string, email: string, isEmailVerified: boolean, profile?: { __typename?: 'UserProfile', avatar?: string | null, bio?: string | null, birthDate?: any | null, diagnosed?: boolean | null, diagnosisYear?: number | null, childName?: string | null, companyName?: string | null, address?: { __typename?: 'Address', city: string, postalCode?: string | null, street?: string | null } | null, contact?: { __typename?: 'Contact', phone?: string | null, alternativeEmail?: string | null, emergencyContact?: { __typename?: 'EmergencyContact', name: string, phone: string, relation: string } | null } | null } | null } | null };

export type GetUsersByRoleQueryVariables = Exact<{
  role: UserRole;
}>;


export type GetUsersByRoleQuery = { __typename?: 'Query', getUsersByRole?: Array<{ __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, createdAt: any, updatedAt: any, _id: string, name: string, email: string, isEmailVerified: boolean, profile?: { __typename?: 'UserProfile', avatar?: string | null, bio?: string | null, birthDate?: any | null, diagnosed?: boolean | null, diagnosisYear?: number | null, childName?: string | null, companyName?: string | null, address?: { __typename?: 'Address', city: string, postalCode?: string | null, street?: string | null } | null, contact?: { __typename?: 'Contact', phone?: string | null, alternativeEmail?: string | null, emergencyContact?: { __typename?: 'EmergencyContact', name: string, phone: string, relation: string } | null } | null } | null }> | null };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser?: { __typename?: 'User', _id: string, name: string, email: string, isEmailVerified: boolean } | null };

export const UserBasicFieldsFragmentDoc = gql`
    fragment UserBasicFields on User {
  _id
  name
  email
  isEmailVerified
}
    `;
export const UserProfileFieldsFragmentDoc = gql`
    fragment UserProfileFields on UserProfile {
  avatar
  bio
  birthDate
  diagnosed
  diagnosisYear
  childName
  companyName
  address {
    city
    postalCode
    street
  }
  contact {
    phone
    alternativeEmail
    emergencyContact {
      name
      phone
      relation
    }
  }
}
    `;
export const UserDetailedFieldsFragmentDoc = gql`
    fragment UserDetailedFields on User {
  ...UserBasicFields
  role
  groups
  profile {
    ...UserProfileFields
  }
  createdAt
  updatedAt
}
    ${UserBasicFieldsFragmentDoc}
${UserProfileFieldsFragmentDoc}`;
export const RegisterDocument = gql`
    mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      ...UserDetailedFields
    }
  }
}
    ${UserDetailedFieldsFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      ...UserDetailedFields
    }
  }
}
    ${UserDetailedFieldsFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: ID!, $input: ProfileUpdateInput!) {
  updateProfile(input: $input) {
    ...UserDetailedFields
  }
}
    ${UserDetailedFieldsFragmentDoc}`;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const SetUserRoleDocument = gql`
    mutation SetUserRole($userId: ID!, $role: UserRole!) {
  setUserRole(userId: $userId, role: $role) {
    ...UserDetailedFields
  }
}
    ${UserDetailedFieldsFragmentDoc}`;
export type SetUserRoleMutationFn = Apollo.MutationFunction<SetUserRoleMutation, SetUserRoleMutationVariables>;

/**
 * __useSetUserRoleMutation__
 *
 * To run a mutation, you first call `useSetUserRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetUserRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setUserRoleMutation, { data, loading, error }] = useSetUserRoleMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useSetUserRoleMutation(baseOptions?: Apollo.MutationHookOptions<SetUserRoleMutation, SetUserRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetUserRoleMutation, SetUserRoleMutationVariables>(SetUserRoleDocument, options);
      }
export type SetUserRoleMutationHookResult = ReturnType<typeof useSetUserRoleMutation>;
export type SetUserRoleMutationResult = Apollo.MutationResult<SetUserRoleMutation>;
export type SetUserRoleMutationOptions = Apollo.BaseMutationOptions<SetUserRoleMutation, SetUserRoleMutationVariables>;
export const GetUsersDocument = gql`
    query GetUsers {
  getUsers {
    ...UserDetailedFields
  }
}
    ${UserDetailedFieldsFragmentDoc}`;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export function useGetUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersSuspenseQueryHookResult = ReturnType<typeof useGetUsersSuspenseQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($id: ID!) {
  getUser(id: $id) {
    ...UserDetailedFields
  }
}
    ${UserDetailedFieldsFragmentDoc}`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables> & ({ variables: GetUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GetUsersByRoleDocument = gql`
    query GetUsersByRole($role: UserRole!) {
  getUsersByRole(role: $role) {
    ...UserDetailedFields
  }
}
    ${UserDetailedFieldsFragmentDoc}`;

/**
 * __useGetUsersByRoleQuery__
 *
 * To run a query within a React component, call `useGetUsersByRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersByRoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersByRoleQuery({
 *   variables: {
 *      role: // value for 'role'
 *   },
 * });
 */
export function useGetUsersByRoleQuery(baseOptions: Apollo.QueryHookOptions<GetUsersByRoleQuery, GetUsersByRoleQueryVariables> & ({ variables: GetUsersByRoleQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersByRoleQuery, GetUsersByRoleQueryVariables>(GetUsersByRoleDocument, options);
      }
export function useGetUsersByRoleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersByRoleQuery, GetUsersByRoleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersByRoleQuery, GetUsersByRoleQueryVariables>(GetUsersByRoleDocument, options);
        }
export function useGetUsersByRoleSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersByRoleQuery, GetUsersByRoleQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersByRoleQuery, GetUsersByRoleQueryVariables>(GetUsersByRoleDocument, options);
        }
export type GetUsersByRoleQueryHookResult = ReturnType<typeof useGetUsersByRoleQuery>;
export type GetUsersByRoleLazyQueryHookResult = ReturnType<typeof useGetUsersByRoleLazyQuery>;
export type GetUsersByRoleSuspenseQueryHookResult = ReturnType<typeof useGetUsersByRoleSuspenseQuery>;
export type GetUsersByRoleQueryResult = Apollo.QueryResult<GetUsersByRoleQuery, GetUsersByRoleQueryVariables>;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  getCurrentUser {
    ...UserBasicFields
  }
}
    ${UserBasicFieldsFragmentDoc}`;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export function useGetCurrentUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserSuspenseQueryHookResult = ReturnType<typeof useGetCurrentUserSuspenseQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;