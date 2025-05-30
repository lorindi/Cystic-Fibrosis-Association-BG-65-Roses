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
  Date: { input: string; output: string; }
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

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
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
  donations: Array<CampaignDonation>;
  donationsCount: Scalars['Int']['output'];
  endDate?: Maybe<Scalars['Date']['output']>;
  events: Array<CampaignEvent>;
  goal: Scalars['Float']['output'];
  hashtags: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  images?: Maybe<Array<Scalars['String']['output']>>;
  imagesCaptions?: Maybe<Array<Scalars['String']['output']>>;
  isActive: Scalars['Boolean']['output'];
  participants: Array<User>;
  participantsCount: Scalars['Int']['output'];
  pendingParticipants: Array<User>;
  pendingParticipantsCount: Scalars['Int']['output'];
  percentCompleted: Scalars['Float']['output'];
  ratingCount?: Maybe<Scalars['Int']['output']>;
  remainingAmount: Scalars['Float']['output'];
  startDate: Scalars['Date']['output'];
  title: Scalars['String']['output'];
  totalRating?: Maybe<Scalars['Float']['output']>;
  uniqueDonorsCount: Scalars['Int']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type CampaignDonation = {
  __typename?: 'CampaignDonation';
  amount: Scalars['Float']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  date: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  rating?: Maybe<Scalars['Int']['output']>;
  user: User;
};

export type CampaignDonationInput = {
  amount: Scalars['Float']['input'];
  campaignId: Scalars['ID']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
};

export type CampaignEvent = {
  __typename?: 'CampaignEvent';
  date: Scalars['Date']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  imageCaption?: Maybe<Scalars['String']['output']>;
  location: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type CampaignEventInput = {
  date: Scalars['Date']['input'];
  description: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  imageCaption?: InputMaybe<Scalars['String']['input']>;
  location: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CampaignFilterInput = {
  hasEvents?: InputMaybe<Scalars['Boolean']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  maxGoal?: InputMaybe<Scalars['Float']['input']>;
  minGoal?: InputMaybe<Scalars['Float']['input']>;
  minRating?: InputMaybe<Scalars['Float']['input']>;
  sortBy?: InputMaybe<CampaignSortOption>;
};

export type CampaignInput = {
  description: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['Date']['input']>;
  events?: InputMaybe<Array<CampaignEventInput>>;
  goal: Scalars['Float']['input'];
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  imagesCaptions?: InputMaybe<Array<Scalars['String']['input']>>;
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

export type CampaignSortOption =
  | 'HIGHEST_GOAL'
  | 'HIGHEST_RATED'
  | 'LEAST_FUNDED'
  | 'LOWEST_GOAL'
  | 'MOST_FUNDED'
  | 'NEWEST'
  | 'OLDEST';

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

export type CreatePaymentIntentInput = {
  amount: Scalars['Float']['input'];
  campaignId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  initiativeId?: InputMaybe<Scalars['ID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  savePaymentMethod?: InputMaybe<Scalars['Boolean']['input']>;
  type: PaymentType;
};

export type CustomerPaymentMethodInput = {
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  paymentMethodId: Scalars['String']['input'];
};

export type DeactivateAccountInput = {
  feedback?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
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

export type Hashtag = {
  __typename?: 'Hashtag';
  categories: Array<Scalars['String']['output']>;
  count: Scalars['Int']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type HashtagPaginatedResponse = {
  __typename?: 'HashtagPaginatedResponse';
  hasNextPage: Scalars['Boolean']['output'];
  hashtags: Array<Hashtag>;
  totalCount: Scalars['Int']['output'];
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

export type LoginHistory = {
  __typename?: 'LoginHistory';
  id: Scalars['ID']['output'];
  ip: Scalars['String']['output'];
  loggedInAt: Scalars['Date']['output'];
  status: Scalars['String']['output'];
  userAgent: Scalars['String']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCampaignComment: Campaign;
  addCampaignEvent: CampaignEvent;
  addComment: Comment;
  addConferenceSession: ConferenceSession;
  addHashtagsToCampaign: Campaign;
  addInitiativeItem: InitiativeItem;
  addUserToGroup: User;
  approveBlogPost: BlogPost;
  approveCampaignParticipant: Campaign;
  approveInitiativeParticipant: Scalars['Boolean']['output'];
  approveRecipe: Recipe;
  approveStory: Story;
  confirmPayment: Payment;
  createBlogPost: BlogPost;
  createCampaign: Campaign;
  createConference: Conference;
  createDonation: Donation;
  createEvent: Event;
  createHashtag: Hashtag;
  createInitiative: Initiative;
  createNews: News;
  createPaymentIntent: PaymentIntent;
  createRecipe: Recipe;
  createSetupIntent: SetupIntent;
  createStoreItem: StoreItem;
  createStory: Story;
  deactivateAccount: Scalars['Boolean']['output'];
  deleteBlogPost: Scalars['Boolean']['output'];
  deleteCampaign: Scalars['Boolean']['output'];
  deleteCampaignComment: Campaign;
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
  invalidateAllTokens?: Maybe<Scalars['Boolean']['output']>;
  invalidateToken?: Maybe<Scalars['Boolean']['output']>;
  joinCampaign: Campaign;
  joinConference: Conference;
  joinEvent: Event;
  joinInitiative: Scalars['Boolean']['output'];
  leaveCampaign: Campaign;
  leaveConference: Conference;
  leaveEvent: Event;
  leaveInitiative: Scalars['Boolean']['output'];
  login: AuthResponse;
  logout: Scalars['Boolean']['output'];
  reactivateAccount: Scalars['Boolean']['output'];
  refreshToken?: Maybe<AuthPayload>;
  refundPayment: Payment;
  register: AuthResponse;
  rejectCampaignParticipant: Campaign;
  rejectInitiativeParticipant: Scalars['Boolean']['output'];
  removeHashtagFromCategory: Scalars['Boolean']['output'];
  removeHashtagsFromCampaign: Campaign;
  removePaymentMethod: Scalars['Boolean']['output'];
  removeUserFromGroup: User;
  resendVerificationEmail: Scalars['Boolean']['output'];
  savePaymentMethod: Scalars['Boolean']['output'];
  sendChatMessage: ChatMessage;
  setDefaultPaymentMethod: Scalars['Boolean']['output'];
  setUserRole: User;
  updateBlogPost: BlogPost;
  updateCampaign: Campaign;
  updateCampaignComment: Campaign;
  updateCampaignEvent: CampaignEvent;
  updateCampaignImages: Campaign;
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


export type MutationAddCampaignCommentArgs = {
  campaignId: Scalars['ID']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
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


export type MutationAddHashtagsToCampaignArgs = {
  campaignId: Scalars['ID']['input'];
  hashtagIds: Array<Scalars['ID']['input']>;
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


export type MutationConfirmPaymentArgs = {
  paymentIntentId: Scalars['String']['input'];
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


export type MutationCreateHashtagArgs = {
  category: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationCreateInitiativeArgs = {
  input: InitiativeInput;
};


export type MutationCreateNewsArgs = {
  input: NewsInput;
};


export type MutationCreatePaymentIntentArgs = {
  input: CreatePaymentIntentInput;
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


export type MutationDeactivateAccountArgs = {
  input?: InputMaybe<DeactivateAccountInput>;
};


export type MutationDeleteBlogPostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCampaignArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCampaignCommentArgs = {
  campaignId: Scalars['ID']['input'];
  commentId: Scalars['ID']['input'];
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


export type MutationReactivateAccountArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationRefundPaymentArgs = {
  paymentIntentId: Scalars['String']['input'];
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


export type MutationRemoveHashtagFromCategoryArgs = {
  category: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationRemoveHashtagsFromCampaignArgs = {
  campaignId: Scalars['ID']['input'];
  hashtagIds: Array<Scalars['ID']['input']>;
};


export type MutationRemovePaymentMethodArgs = {
  paymentMethodId: Scalars['String']['input'];
};


export type MutationRemoveUserFromGroupArgs = {
  group: UserGroup;
  userId: Scalars['ID']['input'];
};


export type MutationSavePaymentMethodArgs = {
  paymentMethodId: Scalars['String']['input'];
};


export type MutationSendChatMessageArgs = {
  input: ChatMessageInput;
};


export type MutationSetDefaultPaymentMethodArgs = {
  paymentMethodId: Scalars['String']['input'];
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


export type MutationUpdateCampaignCommentArgs = {
  campaignId: Scalars['ID']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  commentId: Scalars['ID']['input'];
  rating?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateCampaignEventArgs = {
  eventId: Scalars['ID']['input'];
  input: CampaignEventInput;
};


export type MutationUpdateCampaignImagesArgs = {
  id: Scalars['ID']['input'];
  images: Array<Scalars['String']['input']>;
  imagesCaptions?: InputMaybe<Array<Scalars['String']['input']>>;
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

export type PaginatedPayments = {
  __typename?: 'PaginatedPayments';
  hasMore: Scalars['Boolean']['output'];
  payments: Array<Payment>;
  totalCount: Scalars['Int']['output'];
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  hasMore: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
  users: Array<User>;
};

export type Payment = {
  __typename?: 'Payment';
  _id: Scalars['ID']['output'];
  amount: Scalars['Float']['output'];
  campaign?: Maybe<Campaign>;
  createdAt: Scalars['Date']['output'];
  currency: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  donor?: Maybe<Donor>;
  initiative?: Maybe<Initiative>;
  items?: Maybe<Array<Maybe<StoreItem>>>;
  status: PaymentStatus;
  stripePaymentIntentId: Scalars['String']['output'];
  type: PaymentType;
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<User>;
};

export type PaymentIntent = {
  __typename?: 'PaymentIntent';
  amount: Scalars['Float']['output'];
  clientSecret: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  paymentIntentId: Scalars['String']['output'];
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  brand: Scalars['String']['output'];
  expMonth: Scalars['Int']['output'];
  expYear: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  isDefault: Scalars['Boolean']['output'];
  last4: Scalars['String']['output'];
};

export type PaymentStatus =
  | 'canceled'
  | 'failed'
  | 'pending'
  | 'refunded'
  | 'succeeded';

export type PaymentType =
  | 'campaign_donation'
  | 'initiative_donation'
  | 'other_donation'
  | 'store_purchase';

export type ProcessPaymentInput = {
  paymentIntentId: Scalars['String']['input'];
  paymentMethodId?: InputMaybe<Scalars['String']['input']>;
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
  getAllHashtags: HashtagPaginatedResponse;
  getBlogPost?: Maybe<BlogPost>;
  getBlogPosts?: Maybe<Array<BlogPost>>;
  getCampaign?: Maybe<Campaign>;
  getCampaignDonations?: Maybe<Array<CampaignDonation>>;
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
  getFilteredCampaigns?: Maybe<Array<Campaign>>;
  getHashtagsByCategory: Array<Hashtag>;
  getInitiative: Initiative;
  getInitiatives: Array<Initiative>;
  getLoginHistory: Array<LoginHistory>;
  getNews?: Maybe<Array<News>>;
  getNewsItem?: Maybe<News>;
  getPaginatedUsers: PaginatedUsers;
  getPayment?: Maybe<Payment>;
  getPaymentMethods: Array<PaymentMethod>;
  getPayments: PaginatedPayments;
  getPendingCampaignRequests?: Maybe<Array<Campaign>>;
  getPendingInitiativeRequests: Array<User>;
  getRecipe?: Maybe<Recipe>;
  getRecipes?: Maybe<Array<Recipe>>;
  getStoreItem?: Maybe<StoreItem>;
  getStoreItems?: Maybe<Array<StoreItem>>;
  getStories?: Maybe<Array<Story>>;
  getStory?: Maybe<Story>;
  getTrendingHashtags: Array<Hashtag>;
  getUser?: Maybe<User>;
  getUserCampaignStatus?: Maybe<Array<UserCampaignStatus>>;
  getUserCampaigns?: Maybe<Array<Campaign>>;
  getUserInitiatives: Array<Initiative>;
  getUserPayments: PaginatedPayments;
  getUserSessions: Array<UserSession>;
  getUsers?: Maybe<Array<User>>;
  getUsersByGroup?: Maybe<Array<User>>;
  getUsersByRole?: Maybe<Array<User>>;
  searchByTag: TaggedContent;
  searchHashtags: Array<Hashtag>;
};


export type QueryAskAiArgs = {
  query: Scalars['String']['input'];
};


export type QueryGetAllHashtagsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryGetCampaignDonationsArgs = {
  campaignId: Scalars['ID']['input'];
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


export type QueryGetFilteredCampaignsArgs = {
  filter?: InputMaybe<CampaignFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetHashtagsByCategoryArgs = {
  category: Scalars['String']['input'];
};


export type QueryGetInitiativeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetInitiativesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetLoginHistoryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryGetPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPaymentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryGetTrendingHashtagsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryGetUserPaymentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
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


export type QuerySearchByTagArgs = {
  categories?: InputMaybe<Array<Scalars['String']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  tag: Scalars['String']['input'];
};


export type QuerySearchHashtagsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  query: Scalars['String']['input'];
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

export type SetupIntent = {
  __typename?: 'SetupIntent';
  clientSecret: Scalars['String']['output'];
  setupIntentId: Scalars['String']['output'];
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

export type TaggedContent = {
  __typename?: 'TaggedContent';
  items: Array<TaggedContentItem>;
  totalCount: Scalars['Int']['output'];
};

export type TaggedContentItem = {
  __typename?: 'TaggedContentItem';
  createdAt: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  hashtags: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['Date']['output'];
  deactivatedAt?: Maybe<Scalars['Date']['output']>;
  email: Scalars['String']['output'];
  groups?: Maybe<Array<UserGroup>>;
  isActive: Scalars['Boolean']['output'];
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

export type UserSession = {
  __typename?: 'UserSession';
  createdAt: Scalars['Date']['output'];
  expiresAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  ip: Scalars['String']['output'];
  userAgent: Scalars['String']['output'];
};

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

export type UserFieldsFragment = { __typename?: 'User', _id: string, name: string, email: string, role: UserRole, groups?: Array<UserGroup> | null, isEmailVerified: boolean, createdAt: string };

export type UserBasicFieldsFragment = { __typename?: 'User', _id: string, name: string, email: string, isEmailVerified: boolean };

export type UserProfileFieldsFragment = { __typename?: 'UserProfile', avatar?: string | null, bio?: string | null, birthDate?: string | null, diagnosed?: boolean | null, diagnosisYear?: number | null, childName?: string | null, companyName?: string | null, address?: { __typename?: 'Address', city: string, postalCode?: string | null, street?: string | null } | null, contact?: { __typename?: 'Contact', phone?: string | null, alternativeEmail?: string | null, emergencyContact?: { __typename?: 'EmergencyContact', name: string, phone: string, relation: string } | null } | null };

export type UserDetailedFieldsFragment = { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean };

export type RegisterMutationMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutationMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', _id: string, name: string, email: string, role: UserRole, groups?: Array<UserGroup> | null, isEmailVerified: boolean, createdAt: string } } };

export type LogoutMutationMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutationMutation = { __typename?: 'Mutation', logout: boolean };

export type UpdateUserMutationMutationVariables = Exact<{
  input: ProfileUpdateInput;
}>;


export type UpdateUserMutationMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'User', _id: string, name: string, email: string, role: UserRole, groups?: Array<UserGroup> | null, isEmailVerified: boolean, createdAt: string } };

export type SetUserRoleMutationMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  role: UserRole;
}>;


export type SetUserRoleMutationMutation = { __typename?: 'Mutation', setUserRole: { __typename?: 'User', _id: string, name: string, email: string, role: UserRole, groups?: Array<UserGroup> | null, isEmailVerified: boolean, createdAt: string } };

export type AddUserToGroupMutationMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  group: UserGroup;
}>;


export type AddUserToGroupMutationMutation = { __typename?: 'Mutation', addUserToGroup: { __typename?: 'User', _id: string, name: string, email: string, role: UserRole, groups?: Array<UserGroup> | null, isEmailVerified: boolean, createdAt: string } };

export type RemoveUserFromGroupMutationMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  group: UserGroup;
}>;


export type RemoveUserFromGroupMutationMutation = { __typename?: 'Mutation', removeUserFromGroup: { __typename?: 'User', _id: string, name: string, email: string, role: UserRole, groups?: Array<UserGroup> | null, isEmailVerified: boolean, createdAt: string } };

export type LoginMutationMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutationMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean } } };

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'VerificationResponse', success: boolean, message: string, token?: string | null, user?: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean } | null } };

export type ResendVerificationEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendVerificationEmailMutation = { __typename?: 'Mutation', resendVerificationEmail: boolean };

export type GoogleAuthMutationVariables = Exact<{
  input: GoogleAuthInput;
}>;


export type GoogleAuthMutation = { __typename?: 'Mutation', googleAuth: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean } } };

export type UpdateProfileMutationVariables = Exact<{
  input: ProfileUpdateInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean, profile?: { __typename?: 'UserProfile', avatar?: string | null, bio?: string | null, birthDate?: string | null, diagnosed?: boolean | null, diagnosisYear?: number | null, childName?: string | null, companyName?: string | null, address?: { __typename?: 'Address', city: string, postalCode?: string | null, street?: string | null } | null, contact?: { __typename?: 'Contact', phone?: string | null, alternativeEmail?: string | null, emergencyContact?: { __typename?: 'EmergencyContact', name: string, phone: string, relation: string } | null } | null } | null } };

export type RefreshTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken?: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean } } | null };

export type InvalidateTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type InvalidateTokenMutation = { __typename?: 'Mutation', invalidateToken?: boolean | null };

export type InvalidateAllTokensMutationVariables = Exact<{ [key: string]: never; }>;


export type InvalidateAllTokensMutation = { __typename?: 'Mutation', invalidateAllTokens?: boolean | null };

export type GetUserSessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserSessionsQuery = { __typename?: 'Query', getUserSessions: Array<{ __typename?: 'UserSession', id: string, ip: string, userAgent: string, createdAt: string, expiresAt: string }> };

export type GetLoginHistoryQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetLoginHistoryQuery = { __typename?: 'Query', getLoginHistory: Array<{ __typename?: 'LoginHistory', id: string, ip: string, userAgent: string, status: string, loggedInAt: string }> };

export type DeactivateAccountMutationVariables = Exact<{
  input?: InputMaybe<DeactivateAccountInput>;
}>;


export type DeactivateAccountMutation = { __typename?: 'Mutation', deactivateAccount: boolean };

export type ReactivateAccountMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type ReactivateAccountMutation = { __typename?: 'Mutation', reactivateAccount: boolean };

export type UserOperationsFieldsFragment = { __typename?: 'User', _id: string, name: string, email: string, role: UserRole, groups?: Array<UserGroup> | null, isEmailVerified: boolean, isActive: boolean, createdAt: string };

export type UserOperationsBasicFieldsFragment = { __typename?: 'User', _id: string, name: string, email: string, isEmailVerified: boolean };

export type UserOperationsProfileFieldsFragment = { __typename?: 'UserProfile', avatar?: string | null, bio?: string | null, birthDate?: string | null, diagnosed?: boolean | null, diagnosisYear?: number | null, childName?: string | null, companyName?: string | null, address?: { __typename?: 'Address', city: string, postalCode?: string | null, street?: string | null } | null, contact?: { __typename?: 'Contact', phone?: string | null, alternativeEmail?: string | null, emergencyContact?: { __typename?: 'EmergencyContact', name: string, phone: string, relation: string } | null } | null };

export type UserOperationsDetailedFieldsFragment = { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser?: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean } | null };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getUsers?: Array<{ __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean }> | null };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean } | null };

export type GetUsersByRoleQueryVariables = Exact<{
  role: UserRole;
}>;


export type GetUsersByRoleQuery = { __typename?: 'Query', getUsersByRole?: Array<{ __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean }> | null };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', _id: string, name: string, email: string, role: UserRole, groups?: Array<UserGroup> | null, isEmailVerified: boolean, isActive: boolean, createdAt: string } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type UpdateUserMutationVariables = Exact<{
  input: ProfileUpdateInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'User', _id: string, name: string, email: string, role: UserRole, groups?: Array<UserGroup> | null, isEmailVerified: boolean, isActive: boolean, createdAt: string } };

export type SetUserRoleMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  role: UserRole;
}>;


export type SetUserRoleMutation = { __typename?: 'Mutation', setUserRole: { __typename?: 'User', _id: string, name: string, email: string, role: UserRole, groups?: Array<UserGroup> | null, isEmailVerified: boolean, isActive: boolean, createdAt: string } };

export type AddUserToGroupMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  group: UserGroup;
}>;


export type AddUserToGroupMutation = { __typename?: 'Mutation', addUserToGroup: { __typename?: 'User', _id: string, name: string, email: string, role: UserRole, groups?: Array<UserGroup> | null, isEmailVerified: boolean, isActive: boolean, createdAt: string } };

export type RemoveUserFromGroupMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  group: UserGroup;
}>;


export type RemoveUserFromGroupMutation = { __typename?: 'Mutation', removeUserFromGroup: { __typename?: 'User', _id: string, name: string, email: string, role: UserRole, groups?: Array<UserGroup> | null, isEmailVerified: boolean, isActive: boolean, createdAt: string } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', token: string, user: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean } } };

export type GetPaginatedUsersQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetPaginatedUsersQuery = { __typename?: 'Query', getPaginatedUsers: { __typename?: 'PaginatedUsers', totalCount: number, hasMore: boolean, users: Array<{ __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean }> } };

export type GetUsersByGroupQueryVariables = Exact<{
  group: UserGroup;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetUsersByGroupQuery = { __typename?: 'Query', getUsersByGroup?: Array<{ __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean }> | null };

export type GetUsersForAdminQueryVariables = Exact<{
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetUsersForAdminQuery = { __typename?: 'Query', getUsers?: Array<{ __typename?: 'User', _id: string, name: string, email: string, role: UserRole, groups?: Array<UserGroup> | null, isEmailVerified: boolean, isActive: boolean, deactivatedAt?: string | null, createdAt: string, updatedAt: string, profile?: { __typename?: 'UserProfile', avatar?: string | null } | null }> | null };

export type GetCampaignsQueryVariables = Exact<{
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetCampaignsQuery = { __typename?: 'Query', getCampaigns?: Array<{ __typename?: 'Campaign', id: string, title: string, description: string, goal: number, currentAmount: number, startDate: string, endDate?: string | null, images?: Array<string> | null, imagesCaptions?: Array<string> | null, participantsCount: number, pendingParticipantsCount: number, events: Array<{ __typename?: 'CampaignEvent', id: string, title: string, description: string, date: string, location: string, image?: string | null, imageCaption?: string | null }> }> | null };

export type GetCampaignQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCampaignQuery = { __typename?: 'Query', getCampaign?: { __typename?: 'Campaign', id: string, title: string, description: string, goal: number, currentAmount: number, startDate: string, endDate?: string | null, images?: Array<string> | null, imagesCaptions?: Array<string> | null, participantsCount: number, pendingParticipantsCount: number, events: Array<{ __typename?: 'CampaignEvent', id: string, title: string, description: string, date: string, location: string, image?: string | null, imageCaption?: string | null }> } | null };

export type GetEventsQueryVariables = Exact<{
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetEventsQuery = { __typename?: 'Query', getEvents?: Array<{ __typename?: 'Event', id: string, title: string, description: string, date: string, location: string, createdAt: string, participants: Array<{ __typename?: 'User', _id: string, name: string }> }> | null };

export type GetDonationsQueryVariables = Exact<{
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetDonationsQuery = { __typename?: 'Query', getDonors?: Array<{ __typename?: 'Donor', id: string, name: string, totalDonations: number, donations: Array<{ __typename?: 'Donation', id: string, amount: number, date: string, campaign?: { __typename?: 'Campaign', id: string, title: string } | null }> }> | null };

export type GetCampaignDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCampaignDetailsQuery = { __typename?: 'Query', getCampaign?: { __typename?: 'Campaign', id: string, title: string, description: string, goal: number, currentAmount: number, endDate?: string | null, images?: Array<string> | null, donationsCount: number, uniqueDonorsCount: number, totalRating?: number | null, ratingCount?: number | null, percentCompleted: number, remainingAmount: number, createdAt: string, createdBy: { __typename?: 'User', _id: string, name: string }, donations: Array<{ __typename?: 'CampaignDonation', id: string, amount: number, comment?: string | null, rating?: number | null, date: string, user: { __typename?: 'User', _id: string, name: string, profile?: { __typename?: 'UserProfile', avatar?: string | null } | null } }> } | null };

export type AddCampaignCommentMutationVariables = Exact<{
  campaignId: Scalars['ID']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AddCampaignCommentMutation = { __typename?: 'Mutation', addCampaignComment: { __typename?: 'Campaign', id: string, title: string, description: string, goal: number, currentAmount: number, endDate?: string | null, images?: Array<string> | null, donationsCount: number, uniqueDonorsCount: number, totalRating?: number | null, ratingCount?: number | null, percentCompleted: number, remainingAmount: number, createdAt: string, createdBy: { __typename?: 'User', _id: string, name: string }, donations: Array<{ __typename?: 'CampaignDonation', id: string, amount: number, comment?: string | null, rating?: number | null, date: string, user: { __typename?: 'User', _id: string, name: string, profile?: { __typename?: 'UserProfile', avatar?: string | null } | null } }> } };

export type CreatePaymentIntentMutationVariables = Exact<{
  input: CreatePaymentIntentInput;
}>;


export type CreatePaymentIntentMutation = { __typename?: 'Mutation', createPaymentIntent: { __typename?: 'PaymentIntent', clientSecret: string, paymentIntentId: string, amount: number, currency: string } };

export type ConfirmPaymentMutationVariables = Exact<{
  paymentIntentId: Scalars['String']['input'];
}>;


export type ConfirmPaymentMutation = { __typename?: 'Mutation', confirmPayment: { __typename?: 'Payment', _id: string, stripePaymentIntentId: string, amount: number, status: PaymentStatus, type: PaymentType, user?: { __typename?: 'User', _id: string, name: string } | null, campaign?: { __typename?: 'Campaign', id: string, title: string } | null } };

export type GetPaymentMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPaymentMethodsQuery = { __typename?: 'Query', getPaymentMethods: Array<{ __typename?: 'PaymentMethod', id: string, brand: string, last4: string, expMonth: number, expYear: number, isDefault: boolean }> };

export type SavePaymentMethodMutationVariables = Exact<{
  paymentMethodId: Scalars['String']['input'];
}>;


export type SavePaymentMethodMutation = { __typename?: 'Mutation', savePaymentMethod: boolean };

export type RemovePaymentMethodMutationVariables = Exact<{
  paymentMethodId: Scalars['String']['input'];
}>;


export type RemovePaymentMethodMutation = { __typename?: 'Mutation', removePaymentMethod: boolean };

export type SetDefaultPaymentMethodMutationVariables = Exact<{
  paymentMethodId: Scalars['String']['input'];
}>;


export type SetDefaultPaymentMethodMutation = { __typename?: 'Mutation', setDefaultPaymentMethod: boolean };

export type GetCurrentUserQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQueryQuery = { __typename?: 'Query', getCurrentUser?: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean } | null };

export type GetUsersListQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersListQueryQuery = { __typename?: 'Query', getUsers?: Array<{ __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean }> | null };

export type GetUserByIdQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserByIdQueryQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean } | null };

export type GetUsersByRoleQueryQueryVariables = Exact<{
  role: UserRole;
}>;


export type GetUsersByRoleQueryQuery = { __typename?: 'Query', getUsersByRole?: Array<{ __typename?: 'User', role: UserRole, groups?: Array<UserGroup> | null, isActive: boolean, deactivatedAt?: string | null, createdAt: string, _id: string, name: string, email: string, isEmailVerified: boolean }> | null };

export type GetUsersWithParamsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  noLimit?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetUsersWithParamsQuery = { __typename?: 'Query', getUsers?: Array<{ __typename?: 'User', _id: string, name: string, email: string, role: UserRole, groups?: Array<UserGroup> | null, isEmailVerified: boolean, isActive: boolean, deactivatedAt?: string | null, createdAt: string, updatedAt: string }> | null };

export const UserFieldsFragmentDoc = gql`
    fragment UserFields on User {
  _id
  name
  email
  role
  groups
  isEmailVerified
  createdAt
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
export const UserBasicFieldsFragmentDoc = gql`
    fragment UserBasicFields on User {
  _id
  name
  email
  isEmailVerified
}
    `;
export const UserDetailedFieldsFragmentDoc = gql`
    fragment UserDetailedFields on User {
  ...UserBasicFields
  role
  groups
  isActive
  deactivatedAt
  createdAt
}
    ${UserBasicFieldsFragmentDoc}`;
export const UserOperationsFieldsFragmentDoc = gql`
    fragment UserOperationsFields on User {
  _id
  name
  email
  role
  groups
  isEmailVerified
  isActive
  createdAt
}
    `;
export const UserOperationsProfileFieldsFragmentDoc = gql`
    fragment UserOperationsProfileFields on UserProfile {
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
export const UserOperationsBasicFieldsFragmentDoc = gql`
    fragment UserOperationsBasicFields on User {
  _id
  name
  email
  isEmailVerified
}
    `;
export const UserOperationsDetailedFieldsFragmentDoc = gql`
    fragment UserOperationsDetailedFields on User {
  ...UserOperationsBasicFields
  role
  groups
  isActive
  deactivatedAt
  createdAt
}
    ${UserOperationsBasicFieldsFragmentDoc}`;
export const RegisterMutationDocument = gql`
    mutation RegisterMutation($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      ...UserFields
    }
  }
}
    ${UserFieldsFragmentDoc}`;
export type RegisterMutationMutationFn = Apollo.MutationFunction<RegisterMutationMutation, RegisterMutationMutationVariables>;

/**
 * __useRegisterMutationMutation__
 *
 * To run a mutation, you first call `useRegisterMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutationMutation, { data, loading, error }] = useRegisterMutationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutationMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutationMutation, RegisterMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutationMutation, RegisterMutationMutationVariables>(RegisterMutationDocument, options);
      }
export type RegisterMutationMutationHookResult = ReturnType<typeof useRegisterMutationMutation>;
export type RegisterMutationMutationResult = Apollo.MutationResult<RegisterMutationMutation>;
export type RegisterMutationMutationOptions = Apollo.BaseMutationOptions<RegisterMutationMutation, RegisterMutationMutationVariables>;
export const LogoutMutationDocument = gql`
    mutation LogoutMutation {
  logout
}
    `;
export type LogoutMutationMutationFn = Apollo.MutationFunction<LogoutMutationMutation, LogoutMutationMutationVariables>;

/**
 * __useLogoutMutationMutation__
 *
 * To run a mutation, you first call `useLogoutMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutationMutation, { data, loading, error }] = useLogoutMutationMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutationMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutationMutation, LogoutMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutationMutation, LogoutMutationMutationVariables>(LogoutMutationDocument, options);
      }
export type LogoutMutationMutationHookResult = ReturnType<typeof useLogoutMutationMutation>;
export type LogoutMutationMutationResult = Apollo.MutationResult<LogoutMutationMutation>;
export type LogoutMutationMutationOptions = Apollo.BaseMutationOptions<LogoutMutationMutation, LogoutMutationMutationVariables>;
export const UpdateUserMutationDocument = gql`
    mutation UpdateUserMutation($input: ProfileUpdateInput!) {
  updateProfile(input: $input) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export type UpdateUserMutationMutationFn = Apollo.MutationFunction<UpdateUserMutationMutation, UpdateUserMutationMutationVariables>;

/**
 * __useUpdateUserMutationMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutationMutation, { data, loading, error }] = useUpdateUserMutationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutationMutation, UpdateUserMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutationMutation, UpdateUserMutationMutationVariables>(UpdateUserMutationDocument, options);
      }
export type UpdateUserMutationMutationHookResult = ReturnType<typeof useUpdateUserMutationMutation>;
export type UpdateUserMutationMutationResult = Apollo.MutationResult<UpdateUserMutationMutation>;
export type UpdateUserMutationMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutationMutation, UpdateUserMutationMutationVariables>;
export const SetUserRoleMutationDocument = gql`
    mutation SetUserRoleMutation($userId: ID!, $role: UserRole!) {
  setUserRole(userId: $userId, role: $role) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export type SetUserRoleMutationMutationFn = Apollo.MutationFunction<SetUserRoleMutationMutation, SetUserRoleMutationMutationVariables>;

/**
 * __useSetUserRoleMutationMutation__
 *
 * To run a mutation, you first call `useSetUserRoleMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetUserRoleMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setUserRoleMutationMutation, { data, loading, error }] = useSetUserRoleMutationMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useSetUserRoleMutationMutation(baseOptions?: Apollo.MutationHookOptions<SetUserRoleMutationMutation, SetUserRoleMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetUserRoleMutationMutation, SetUserRoleMutationMutationVariables>(SetUserRoleMutationDocument, options);
      }
export type SetUserRoleMutationMutationHookResult = ReturnType<typeof useSetUserRoleMutationMutation>;
export type SetUserRoleMutationMutationResult = Apollo.MutationResult<SetUserRoleMutationMutation>;
export type SetUserRoleMutationMutationOptions = Apollo.BaseMutationOptions<SetUserRoleMutationMutation, SetUserRoleMutationMutationVariables>;
export const AddUserToGroupMutationDocument = gql`
    mutation AddUserToGroupMutation($userId: ID!, $group: UserGroup!) {
  addUserToGroup(userId: $userId, group: $group) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export type AddUserToGroupMutationMutationFn = Apollo.MutationFunction<AddUserToGroupMutationMutation, AddUserToGroupMutationMutationVariables>;

/**
 * __useAddUserToGroupMutationMutation__
 *
 * To run a mutation, you first call `useAddUserToGroupMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUserToGroupMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUserToGroupMutationMutation, { data, loading, error }] = useAddUserToGroupMutationMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      group: // value for 'group'
 *   },
 * });
 */
export function useAddUserToGroupMutationMutation(baseOptions?: Apollo.MutationHookOptions<AddUserToGroupMutationMutation, AddUserToGroupMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddUserToGroupMutationMutation, AddUserToGroupMutationMutationVariables>(AddUserToGroupMutationDocument, options);
      }
export type AddUserToGroupMutationMutationHookResult = ReturnType<typeof useAddUserToGroupMutationMutation>;
export type AddUserToGroupMutationMutationResult = Apollo.MutationResult<AddUserToGroupMutationMutation>;
export type AddUserToGroupMutationMutationOptions = Apollo.BaseMutationOptions<AddUserToGroupMutationMutation, AddUserToGroupMutationMutationVariables>;
export const RemoveUserFromGroupMutationDocument = gql`
    mutation RemoveUserFromGroupMutation($userId: ID!, $group: UserGroup!) {
  removeUserFromGroup(userId: $userId, group: $group) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export type RemoveUserFromGroupMutationMutationFn = Apollo.MutationFunction<RemoveUserFromGroupMutationMutation, RemoveUserFromGroupMutationMutationVariables>;

/**
 * __useRemoveUserFromGroupMutationMutation__
 *
 * To run a mutation, you first call `useRemoveUserFromGroupMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserFromGroupMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserFromGroupMutationMutation, { data, loading, error }] = useRemoveUserFromGroupMutationMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      group: // value for 'group'
 *   },
 * });
 */
export function useRemoveUserFromGroupMutationMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUserFromGroupMutationMutation, RemoveUserFromGroupMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveUserFromGroupMutationMutation, RemoveUserFromGroupMutationMutationVariables>(RemoveUserFromGroupMutationDocument, options);
      }
export type RemoveUserFromGroupMutationMutationHookResult = ReturnType<typeof useRemoveUserFromGroupMutationMutation>;
export type RemoveUserFromGroupMutationMutationResult = Apollo.MutationResult<RemoveUserFromGroupMutationMutation>;
export type RemoveUserFromGroupMutationMutationOptions = Apollo.BaseMutationOptions<RemoveUserFromGroupMutationMutation, RemoveUserFromGroupMutationMutationVariables>;
export const LoginMutationDocument = gql`
    mutation LoginMutation($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      ...UserDetailedFields
    }
  }
}
    ${UserDetailedFieldsFragmentDoc}`;
export type LoginMutationMutationFn = Apollo.MutationFunction<LoginMutationMutation, LoginMutationMutationVariables>;

/**
 * __useLoginMutationMutation__
 *
 * To run a mutation, you first call `useLoginMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutationMutation, { data, loading, error }] = useLoginMutationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutationMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutationMutation, LoginMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutationMutation, LoginMutationMutationVariables>(LoginMutationDocument, options);
      }
export type LoginMutationMutationHookResult = ReturnType<typeof useLoginMutationMutation>;
export type LoginMutationMutationResult = Apollo.MutationResult<LoginMutationMutation>;
export type LoginMutationMutationOptions = Apollo.BaseMutationOptions<LoginMutationMutation, LoginMutationMutationVariables>;
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token) {
    success
    message
    user {
      ...UserOperationsDetailedFields
    }
    token
  }
}
    ${UserOperationsDetailedFieldsFragmentDoc}`;
export type VerifyEmailMutationFn = Apollo.MutationFunction<VerifyEmailMutation, VerifyEmailMutationVariables>;

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerifyEmailMutation(baseOptions?: Apollo.MutationHookOptions<VerifyEmailMutation, VerifyEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument, options);
      }
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>;
export type VerifyEmailMutationResult = Apollo.MutationResult<VerifyEmailMutation>;
export type VerifyEmailMutationOptions = Apollo.BaseMutationOptions<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const ResendVerificationEmailDocument = gql`
    mutation ResendVerificationEmail {
  resendVerificationEmail
}
    `;
export type ResendVerificationEmailMutationFn = Apollo.MutationFunction<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;

/**
 * __useResendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useResendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendVerificationEmailMutation, { data, loading, error }] = useResendVerificationEmailMutation({
 *   variables: {
 *   },
 * });
 */
export function useResendVerificationEmailMutation(baseOptions?: Apollo.MutationHookOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>(ResendVerificationEmailDocument, options);
      }
export type ResendVerificationEmailMutationHookResult = ReturnType<typeof useResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationResult = Apollo.MutationResult<ResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationOptions = Apollo.BaseMutationOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;
export const GoogleAuthDocument = gql`
    mutation GoogleAuth($input: GoogleAuthInput!) {
  googleAuth(input: $input) {
    token
    user {
      ...UserOperationsDetailedFields
    }
  }
}
    ${UserOperationsDetailedFieldsFragmentDoc}`;
export type GoogleAuthMutationFn = Apollo.MutationFunction<GoogleAuthMutation, GoogleAuthMutationVariables>;

/**
 * __useGoogleAuthMutation__
 *
 * To run a mutation, you first call `useGoogleAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGoogleAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [googleAuthMutation, { data, loading, error }] = useGoogleAuthMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGoogleAuthMutation(baseOptions?: Apollo.MutationHookOptions<GoogleAuthMutation, GoogleAuthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GoogleAuthMutation, GoogleAuthMutationVariables>(GoogleAuthDocument, options);
      }
export type GoogleAuthMutationHookResult = ReturnType<typeof useGoogleAuthMutation>;
export type GoogleAuthMutationResult = Apollo.MutationResult<GoogleAuthMutation>;
export type GoogleAuthMutationOptions = Apollo.BaseMutationOptions<GoogleAuthMutation, GoogleAuthMutationVariables>;
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($input: ProfileUpdateInput!) {
  updateProfile(input: $input) {
    ...UserOperationsDetailedFields
    profile {
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
  }
}
    ${UserOperationsDetailedFieldsFragmentDoc}`;
export type UpdateProfileMutationFn = Apollo.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const RefreshTokenDocument = gql`
    mutation RefreshToken {
  refreshToken {
    token
    user {
      ...UserOperationsDetailedFields
    }
  }
}
    ${UserOperationsDetailedFieldsFragmentDoc}`;
export type RefreshTokenMutationFn = Apollo.MutationFunction<RefreshTokenMutation, RefreshTokenMutationVariables>;

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokenMutation, { data, loading, error }] = useRefreshTokenMutation({
 *   variables: {
 *   },
 * });
 */
export function useRefreshTokenMutation(baseOptions?: Apollo.MutationHookOptions<RefreshTokenMutation, RefreshTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument, options);
      }
export type RefreshTokenMutationHookResult = ReturnType<typeof useRefreshTokenMutation>;
export type RefreshTokenMutationResult = Apollo.MutationResult<RefreshTokenMutation>;
export type RefreshTokenMutationOptions = Apollo.BaseMutationOptions<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const InvalidateTokenDocument = gql`
    mutation InvalidateToken {
  invalidateToken
}
    `;
export type InvalidateTokenMutationFn = Apollo.MutationFunction<InvalidateTokenMutation, InvalidateTokenMutationVariables>;

/**
 * __useInvalidateTokenMutation__
 *
 * To run a mutation, you first call `useInvalidateTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInvalidateTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [invalidateTokenMutation, { data, loading, error }] = useInvalidateTokenMutation({
 *   variables: {
 *   },
 * });
 */
export function useInvalidateTokenMutation(baseOptions?: Apollo.MutationHookOptions<InvalidateTokenMutation, InvalidateTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InvalidateTokenMutation, InvalidateTokenMutationVariables>(InvalidateTokenDocument, options);
      }
export type InvalidateTokenMutationHookResult = ReturnType<typeof useInvalidateTokenMutation>;
export type InvalidateTokenMutationResult = Apollo.MutationResult<InvalidateTokenMutation>;
export type InvalidateTokenMutationOptions = Apollo.BaseMutationOptions<InvalidateTokenMutation, InvalidateTokenMutationVariables>;
export const InvalidateAllTokensDocument = gql`
    mutation InvalidateAllTokens {
  invalidateAllTokens
}
    `;
export type InvalidateAllTokensMutationFn = Apollo.MutationFunction<InvalidateAllTokensMutation, InvalidateAllTokensMutationVariables>;

/**
 * __useInvalidateAllTokensMutation__
 *
 * To run a mutation, you first call `useInvalidateAllTokensMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInvalidateAllTokensMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [invalidateAllTokensMutation, { data, loading, error }] = useInvalidateAllTokensMutation({
 *   variables: {
 *   },
 * });
 */
export function useInvalidateAllTokensMutation(baseOptions?: Apollo.MutationHookOptions<InvalidateAllTokensMutation, InvalidateAllTokensMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InvalidateAllTokensMutation, InvalidateAllTokensMutationVariables>(InvalidateAllTokensDocument, options);
      }
export type InvalidateAllTokensMutationHookResult = ReturnType<typeof useInvalidateAllTokensMutation>;
export type InvalidateAllTokensMutationResult = Apollo.MutationResult<InvalidateAllTokensMutation>;
export type InvalidateAllTokensMutationOptions = Apollo.BaseMutationOptions<InvalidateAllTokensMutation, InvalidateAllTokensMutationVariables>;
export const GetUserSessionsDocument = gql`
    query GetUserSessions {
  getUserSessions {
    id
    ip
    userAgent
    createdAt
    expiresAt
  }
}
    `;

/**
 * __useGetUserSessionsQuery__
 *
 * To run a query within a React component, call `useGetUserSessionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserSessionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserSessionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserSessionsQuery(baseOptions?: Apollo.QueryHookOptions<GetUserSessionsQuery, GetUserSessionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserSessionsQuery, GetUserSessionsQueryVariables>(GetUserSessionsDocument, options);
      }
export function useGetUserSessionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserSessionsQuery, GetUserSessionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserSessionsQuery, GetUserSessionsQueryVariables>(GetUserSessionsDocument, options);
        }
export function useGetUserSessionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserSessionsQuery, GetUserSessionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserSessionsQuery, GetUserSessionsQueryVariables>(GetUserSessionsDocument, options);
        }
export type GetUserSessionsQueryHookResult = ReturnType<typeof useGetUserSessionsQuery>;
export type GetUserSessionsLazyQueryHookResult = ReturnType<typeof useGetUserSessionsLazyQuery>;
export type GetUserSessionsSuspenseQueryHookResult = ReturnType<typeof useGetUserSessionsSuspenseQuery>;
export type GetUserSessionsQueryResult = Apollo.QueryResult<GetUserSessionsQuery, GetUserSessionsQueryVariables>;
export const GetLoginHistoryDocument = gql`
    query GetLoginHistory($limit: Int) {
  getLoginHistory(limit: $limit) {
    id
    ip
    userAgent
    status
    loggedInAt
  }
}
    `;

/**
 * __useGetLoginHistoryQuery__
 *
 * To run a query within a React component, call `useGetLoginHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLoginHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLoginHistoryQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetLoginHistoryQuery(baseOptions?: Apollo.QueryHookOptions<GetLoginHistoryQuery, GetLoginHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLoginHistoryQuery, GetLoginHistoryQueryVariables>(GetLoginHistoryDocument, options);
      }
export function useGetLoginHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLoginHistoryQuery, GetLoginHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLoginHistoryQuery, GetLoginHistoryQueryVariables>(GetLoginHistoryDocument, options);
        }
export function useGetLoginHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLoginHistoryQuery, GetLoginHistoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLoginHistoryQuery, GetLoginHistoryQueryVariables>(GetLoginHistoryDocument, options);
        }
export type GetLoginHistoryQueryHookResult = ReturnType<typeof useGetLoginHistoryQuery>;
export type GetLoginHistoryLazyQueryHookResult = ReturnType<typeof useGetLoginHistoryLazyQuery>;
export type GetLoginHistorySuspenseQueryHookResult = ReturnType<typeof useGetLoginHistorySuspenseQuery>;
export type GetLoginHistoryQueryResult = Apollo.QueryResult<GetLoginHistoryQuery, GetLoginHistoryQueryVariables>;
export const DeactivateAccountDocument = gql`
    mutation DeactivateAccount($input: DeactivateAccountInput) {
  deactivateAccount(input: $input)
}
    `;
export type DeactivateAccountMutationFn = Apollo.MutationFunction<DeactivateAccountMutation, DeactivateAccountMutationVariables>;

/**
 * __useDeactivateAccountMutation__
 *
 * To run a mutation, you first call `useDeactivateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeactivateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deactivateAccountMutation, { data, loading, error }] = useDeactivateAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeactivateAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeactivateAccountMutation, DeactivateAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeactivateAccountMutation, DeactivateAccountMutationVariables>(DeactivateAccountDocument, options);
      }
export type DeactivateAccountMutationHookResult = ReturnType<typeof useDeactivateAccountMutation>;
export type DeactivateAccountMutationResult = Apollo.MutationResult<DeactivateAccountMutation>;
export type DeactivateAccountMutationOptions = Apollo.BaseMutationOptions<DeactivateAccountMutation, DeactivateAccountMutationVariables>;
export const ReactivateAccountDocument = gql`
    mutation ReactivateAccount($userId: ID!) {
  reactivateAccount(userId: $userId)
}
    `;
export type ReactivateAccountMutationFn = Apollo.MutationFunction<ReactivateAccountMutation, ReactivateAccountMutationVariables>;

/**
 * __useReactivateAccountMutation__
 *
 * To run a mutation, you first call `useReactivateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReactivateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reactivateAccountMutation, { data, loading, error }] = useReactivateAccountMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useReactivateAccountMutation(baseOptions?: Apollo.MutationHookOptions<ReactivateAccountMutation, ReactivateAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReactivateAccountMutation, ReactivateAccountMutationVariables>(ReactivateAccountDocument, options);
      }
export type ReactivateAccountMutationHookResult = ReturnType<typeof useReactivateAccountMutation>;
export type ReactivateAccountMutationResult = Apollo.MutationResult<ReactivateAccountMutation>;
export type ReactivateAccountMutationOptions = Apollo.BaseMutationOptions<ReactivateAccountMutation, ReactivateAccountMutationVariables>;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  getCurrentUser {
    ...UserOperationsDetailedFields
  }
}
    ${UserOperationsDetailedFieldsFragmentDoc}`;

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
export const GetAllUsersDocument = gql`
    query GetAllUsers {
  getUsers {
    ...UserOperationsDetailedFields
  }
}
    ${UserOperationsDetailedFieldsFragmentDoc}`;

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
      }
export function useGetAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<typeof useGetAllUsersLazyQuery>;
export type GetAllUsersSuspenseQueryHookResult = ReturnType<typeof useGetAllUsersSuspenseQuery>;
export type GetAllUsersQueryResult = Apollo.QueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($id: ID!) {
  getUser(id: $id) {
    ...UserOperationsDetailedFields
  }
}
    ${UserOperationsDetailedFieldsFragmentDoc}`;

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
    ...UserOperationsDetailedFields
  }
}
    ${UserOperationsDetailedFieldsFragmentDoc}`;

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
export const RegisterDocument = gql`
    mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      ...UserOperationsFields
    }
  }
}
    ${UserOperationsFieldsFragmentDoc}`;
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
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: ProfileUpdateInput!) {
  updateProfile(input: $input) {
    ...UserOperationsFields
  }
}
    ${UserOperationsFieldsFragmentDoc}`;
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
    ...UserOperationsFields
  }
}
    ${UserOperationsFieldsFragmentDoc}`;
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
export const AddUserToGroupDocument = gql`
    mutation AddUserToGroup($userId: ID!, $group: UserGroup!) {
  addUserToGroup(userId: $userId, group: $group) {
    ...UserOperationsFields
  }
}
    ${UserOperationsFieldsFragmentDoc}`;
export type AddUserToGroupMutationFn = Apollo.MutationFunction<AddUserToGroupMutation, AddUserToGroupMutationVariables>;

/**
 * __useAddUserToGroupMutation__
 *
 * To run a mutation, you first call `useAddUserToGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUserToGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUserToGroupMutation, { data, loading, error }] = useAddUserToGroupMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      group: // value for 'group'
 *   },
 * });
 */
export function useAddUserToGroupMutation(baseOptions?: Apollo.MutationHookOptions<AddUserToGroupMutation, AddUserToGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddUserToGroupMutation, AddUserToGroupMutationVariables>(AddUserToGroupDocument, options);
      }
export type AddUserToGroupMutationHookResult = ReturnType<typeof useAddUserToGroupMutation>;
export type AddUserToGroupMutationResult = Apollo.MutationResult<AddUserToGroupMutation>;
export type AddUserToGroupMutationOptions = Apollo.BaseMutationOptions<AddUserToGroupMutation, AddUserToGroupMutationVariables>;
export const RemoveUserFromGroupDocument = gql`
    mutation RemoveUserFromGroup($userId: ID!, $group: UserGroup!) {
  removeUserFromGroup(userId: $userId, group: $group) {
    ...UserOperationsFields
  }
}
    ${UserOperationsFieldsFragmentDoc}`;
export type RemoveUserFromGroupMutationFn = Apollo.MutationFunction<RemoveUserFromGroupMutation, RemoveUserFromGroupMutationVariables>;

/**
 * __useRemoveUserFromGroupMutation__
 *
 * To run a mutation, you first call `useRemoveUserFromGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserFromGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserFromGroupMutation, { data, loading, error }] = useRemoveUserFromGroupMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      group: // value for 'group'
 *   },
 * });
 */
export function useRemoveUserFromGroupMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUserFromGroupMutation, RemoveUserFromGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveUserFromGroupMutation, RemoveUserFromGroupMutationVariables>(RemoveUserFromGroupDocument, options);
      }
export type RemoveUserFromGroupMutationHookResult = ReturnType<typeof useRemoveUserFromGroupMutation>;
export type RemoveUserFromGroupMutationResult = Apollo.MutationResult<RemoveUserFromGroupMutation>;
export type RemoveUserFromGroupMutationOptions = Apollo.BaseMutationOptions<RemoveUserFromGroupMutation, RemoveUserFromGroupMutationVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      ...UserOperationsDetailedFields
    }
  }
}
    ${UserOperationsDetailedFieldsFragmentDoc}`;
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
export const GetPaginatedUsersDocument = gql`
    query GetPaginatedUsers($limit: Int, $offset: Int) {
  getPaginatedUsers(limit: $limit, offset: $offset) {
    users {
      ...UserOperationsDetailedFields
    }
    totalCount
    hasMore
  }
}
    ${UserOperationsDetailedFieldsFragmentDoc}`;

/**
 * __useGetPaginatedUsersQuery__
 *
 * To run a query within a React component, call `useGetPaginatedUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaginatedUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaginatedUsersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetPaginatedUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>(GetPaginatedUsersDocument, options);
      }
export function useGetPaginatedUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>(GetPaginatedUsersDocument, options);
        }
export function useGetPaginatedUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>(GetPaginatedUsersDocument, options);
        }
export type GetPaginatedUsersQueryHookResult = ReturnType<typeof useGetPaginatedUsersQuery>;
export type GetPaginatedUsersLazyQueryHookResult = ReturnType<typeof useGetPaginatedUsersLazyQuery>;
export type GetPaginatedUsersSuspenseQueryHookResult = ReturnType<typeof useGetPaginatedUsersSuspenseQuery>;
export type GetPaginatedUsersQueryResult = Apollo.QueryResult<GetPaginatedUsersQuery, GetPaginatedUsersQueryVariables>;
export const GetUsersByGroupDocument = gql`
    query GetUsersByGroup($group: UserGroup!, $limit: Int, $offset: Int) {
  getUsersByGroup(group: $group, limit: $limit, offset: $offset) {
    ...UserOperationsDetailedFields
  }
}
    ${UserOperationsDetailedFieldsFragmentDoc}`;

/**
 * __useGetUsersByGroupQuery__
 *
 * To run a query within a React component, call `useGetUsersByGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersByGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersByGroupQuery({
 *   variables: {
 *      group: // value for 'group'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetUsersByGroupQuery(baseOptions: Apollo.QueryHookOptions<GetUsersByGroupQuery, GetUsersByGroupQueryVariables> & ({ variables: GetUsersByGroupQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersByGroupQuery, GetUsersByGroupQueryVariables>(GetUsersByGroupDocument, options);
      }
export function useGetUsersByGroupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersByGroupQuery, GetUsersByGroupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersByGroupQuery, GetUsersByGroupQueryVariables>(GetUsersByGroupDocument, options);
        }
export function useGetUsersByGroupSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersByGroupQuery, GetUsersByGroupQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersByGroupQuery, GetUsersByGroupQueryVariables>(GetUsersByGroupDocument, options);
        }
export type GetUsersByGroupQueryHookResult = ReturnType<typeof useGetUsersByGroupQuery>;
export type GetUsersByGroupLazyQueryHookResult = ReturnType<typeof useGetUsersByGroupLazyQuery>;
export type GetUsersByGroupSuspenseQueryHookResult = ReturnType<typeof useGetUsersByGroupSuspenseQuery>;
export type GetUsersByGroupQueryResult = Apollo.QueryResult<GetUsersByGroupQuery, GetUsersByGroupQueryVariables>;
export const GetUsersForAdminDocument = gql`
    query GetUsersForAdmin($noLimit: Boolean) {
  getUsers(noLimit: $noLimit) {
    _id
    name
    email
    role
    groups
    isEmailVerified
    isActive
    deactivatedAt
    createdAt
    updatedAt
    profile {
      avatar
    }
  }
}
    `;

/**
 * __useGetUsersForAdminQuery__
 *
 * To run a query within a React component, call `useGetUsersForAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersForAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersForAdminQuery({
 *   variables: {
 *      noLimit: // value for 'noLimit'
 *   },
 * });
 */
export function useGetUsersForAdminQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersForAdminQuery, GetUsersForAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersForAdminQuery, GetUsersForAdminQueryVariables>(GetUsersForAdminDocument, options);
      }
export function useGetUsersForAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersForAdminQuery, GetUsersForAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersForAdminQuery, GetUsersForAdminQueryVariables>(GetUsersForAdminDocument, options);
        }
export function useGetUsersForAdminSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersForAdminQuery, GetUsersForAdminQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersForAdminQuery, GetUsersForAdminQueryVariables>(GetUsersForAdminDocument, options);
        }
export type GetUsersForAdminQueryHookResult = ReturnType<typeof useGetUsersForAdminQuery>;
export type GetUsersForAdminLazyQueryHookResult = ReturnType<typeof useGetUsersForAdminLazyQuery>;
export type GetUsersForAdminSuspenseQueryHookResult = ReturnType<typeof useGetUsersForAdminSuspenseQuery>;
export type GetUsersForAdminQueryResult = Apollo.QueryResult<GetUsersForAdminQuery, GetUsersForAdminQueryVariables>;
export const GetCampaignsDocument = gql`
    query GetCampaigns($noLimit: Boolean) {
  getCampaigns(noLimit: $noLimit) {
    id
    title
    description
    goal
    currentAmount
    startDate
    endDate
    images
    imagesCaptions
    events {
      id
      title
      description
      date
      location
      image
      imageCaption
    }
    participantsCount
    pendingParticipantsCount
  }
}
    `;

/**
 * __useGetCampaignsQuery__
 *
 * To run a query within a React component, call `useGetCampaignsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCampaignsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCampaignsQuery({
 *   variables: {
 *      noLimit: // value for 'noLimit'
 *   },
 * });
 */
export function useGetCampaignsQuery(baseOptions?: Apollo.QueryHookOptions<GetCampaignsQuery, GetCampaignsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCampaignsQuery, GetCampaignsQueryVariables>(GetCampaignsDocument, options);
      }
export function useGetCampaignsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCampaignsQuery, GetCampaignsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCampaignsQuery, GetCampaignsQueryVariables>(GetCampaignsDocument, options);
        }
export function useGetCampaignsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCampaignsQuery, GetCampaignsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCampaignsQuery, GetCampaignsQueryVariables>(GetCampaignsDocument, options);
        }
export type GetCampaignsQueryHookResult = ReturnType<typeof useGetCampaignsQuery>;
export type GetCampaignsLazyQueryHookResult = ReturnType<typeof useGetCampaignsLazyQuery>;
export type GetCampaignsSuspenseQueryHookResult = ReturnType<typeof useGetCampaignsSuspenseQuery>;
export type GetCampaignsQueryResult = Apollo.QueryResult<GetCampaignsQuery, GetCampaignsQueryVariables>;
export const GetCampaignDocument = gql`
    query GetCampaign($id: ID!) {
  getCampaign(id: $id) {
    id
    title
    description
    goal
    currentAmount
    startDate
    endDate
    images
    imagesCaptions
    events {
      id
      title
      description
      date
      location
      image
      imageCaption
    }
    participantsCount
    pendingParticipantsCount
  }
}
    `;

/**
 * __useGetCampaignQuery__
 *
 * To run a query within a React component, call `useGetCampaignQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCampaignQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCampaignQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCampaignQuery(baseOptions: Apollo.QueryHookOptions<GetCampaignQuery, GetCampaignQueryVariables> & ({ variables: GetCampaignQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCampaignQuery, GetCampaignQueryVariables>(GetCampaignDocument, options);
      }
export function useGetCampaignLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCampaignQuery, GetCampaignQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCampaignQuery, GetCampaignQueryVariables>(GetCampaignDocument, options);
        }
export function useGetCampaignSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCampaignQuery, GetCampaignQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCampaignQuery, GetCampaignQueryVariables>(GetCampaignDocument, options);
        }
export type GetCampaignQueryHookResult = ReturnType<typeof useGetCampaignQuery>;
export type GetCampaignLazyQueryHookResult = ReturnType<typeof useGetCampaignLazyQuery>;
export type GetCampaignSuspenseQueryHookResult = ReturnType<typeof useGetCampaignSuspenseQuery>;
export type GetCampaignQueryResult = Apollo.QueryResult<GetCampaignQuery, GetCampaignQueryVariables>;
export const GetEventsDocument = gql`
    query GetEvents($noLimit: Boolean) {
  getEvents(noLimit: $noLimit) {
    id
    title
    description
    date
    location
    createdAt
    participants {
      _id
      name
    }
  }
}
    `;

/**
 * __useGetEventsQuery__
 *
 * To run a query within a React component, call `useGetEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEventsQuery({
 *   variables: {
 *      noLimit: // value for 'noLimit'
 *   },
 * });
 */
export function useGetEventsQuery(baseOptions?: Apollo.QueryHookOptions<GetEventsQuery, GetEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEventsQuery, GetEventsQueryVariables>(GetEventsDocument, options);
      }
export function useGetEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEventsQuery, GetEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEventsQuery, GetEventsQueryVariables>(GetEventsDocument, options);
        }
export function useGetEventsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEventsQuery, GetEventsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEventsQuery, GetEventsQueryVariables>(GetEventsDocument, options);
        }
export type GetEventsQueryHookResult = ReturnType<typeof useGetEventsQuery>;
export type GetEventsLazyQueryHookResult = ReturnType<typeof useGetEventsLazyQuery>;
export type GetEventsSuspenseQueryHookResult = ReturnType<typeof useGetEventsSuspenseQuery>;
export type GetEventsQueryResult = Apollo.QueryResult<GetEventsQuery, GetEventsQueryVariables>;
export const GetDonationsDocument = gql`
    query GetDonations($noLimit: Boolean) {
  getDonors(noLimit: $noLimit) {
    id
    name
    totalDonations
    donations {
      id
      amount
      date
      campaign {
        id
        title
      }
    }
  }
}
    `;

/**
 * __useGetDonationsQuery__
 *
 * To run a query within a React component, call `useGetDonationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDonationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDonationsQuery({
 *   variables: {
 *      noLimit: // value for 'noLimit'
 *   },
 * });
 */
export function useGetDonationsQuery(baseOptions?: Apollo.QueryHookOptions<GetDonationsQuery, GetDonationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDonationsQuery, GetDonationsQueryVariables>(GetDonationsDocument, options);
      }
export function useGetDonationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDonationsQuery, GetDonationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDonationsQuery, GetDonationsQueryVariables>(GetDonationsDocument, options);
        }
export function useGetDonationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDonationsQuery, GetDonationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDonationsQuery, GetDonationsQueryVariables>(GetDonationsDocument, options);
        }
export type GetDonationsQueryHookResult = ReturnType<typeof useGetDonationsQuery>;
export type GetDonationsLazyQueryHookResult = ReturnType<typeof useGetDonationsLazyQuery>;
export type GetDonationsSuspenseQueryHookResult = ReturnType<typeof useGetDonationsSuspenseQuery>;
export type GetDonationsQueryResult = Apollo.QueryResult<GetDonationsQuery, GetDonationsQueryVariables>;
export const GetCampaignDetailsDocument = gql`
    query GetCampaignDetails($id: ID!) {
  getCampaign(id: $id) {
    id
    title
    description
    goal
    currentAmount
    endDate
    images
    donationsCount
    uniqueDonorsCount
    totalRating
    ratingCount
    percentCompleted
    remainingAmount
    createdBy {
      _id
      name
    }
    createdAt
    donations {
      id
      user {
        _id
        name
        profile {
          avatar
        }
      }
      amount
      comment
      rating
      date
    }
  }
}
    `;

/**
 * __useGetCampaignDetailsQuery__
 *
 * To run a query within a React component, call `useGetCampaignDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCampaignDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCampaignDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCampaignDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetCampaignDetailsQuery, GetCampaignDetailsQueryVariables> & ({ variables: GetCampaignDetailsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCampaignDetailsQuery, GetCampaignDetailsQueryVariables>(GetCampaignDetailsDocument, options);
      }
export function useGetCampaignDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCampaignDetailsQuery, GetCampaignDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCampaignDetailsQuery, GetCampaignDetailsQueryVariables>(GetCampaignDetailsDocument, options);
        }
export function useGetCampaignDetailsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCampaignDetailsQuery, GetCampaignDetailsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCampaignDetailsQuery, GetCampaignDetailsQueryVariables>(GetCampaignDetailsDocument, options);
        }
export type GetCampaignDetailsQueryHookResult = ReturnType<typeof useGetCampaignDetailsQuery>;
export type GetCampaignDetailsLazyQueryHookResult = ReturnType<typeof useGetCampaignDetailsLazyQuery>;
export type GetCampaignDetailsSuspenseQueryHookResult = ReturnType<typeof useGetCampaignDetailsSuspenseQuery>;
export type GetCampaignDetailsQueryResult = Apollo.QueryResult<GetCampaignDetailsQuery, GetCampaignDetailsQueryVariables>;
export const AddCampaignCommentDocument = gql`
    mutation AddCampaignComment($campaignId: ID!, $comment: String, $rating: Int) {
  addCampaignComment(campaignId: $campaignId, comment: $comment, rating: $rating) {
    id
    title
    description
    goal
    currentAmount
    endDate
    images
    donationsCount
    uniqueDonorsCount
    totalRating
    ratingCount
    percentCompleted
    remainingAmount
    createdBy {
      _id
      name
    }
    createdAt
    donations {
      id
      user {
        _id
        name
        profile {
          avatar
        }
      }
      amount
      comment
      rating
      date
    }
  }
}
    `;
export type AddCampaignCommentMutationFn = Apollo.MutationFunction<AddCampaignCommentMutation, AddCampaignCommentMutationVariables>;

/**
 * __useAddCampaignCommentMutation__
 *
 * To run a mutation, you first call `useAddCampaignCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCampaignCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCampaignCommentMutation, { data, loading, error }] = useAddCampaignCommentMutation({
 *   variables: {
 *      campaignId: // value for 'campaignId'
 *      comment: // value for 'comment'
 *      rating: // value for 'rating'
 *   },
 * });
 */
export function useAddCampaignCommentMutation(baseOptions?: Apollo.MutationHookOptions<AddCampaignCommentMutation, AddCampaignCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCampaignCommentMutation, AddCampaignCommentMutationVariables>(AddCampaignCommentDocument, options);
      }
export type AddCampaignCommentMutationHookResult = ReturnType<typeof useAddCampaignCommentMutation>;
export type AddCampaignCommentMutationResult = Apollo.MutationResult<AddCampaignCommentMutation>;
export type AddCampaignCommentMutationOptions = Apollo.BaseMutationOptions<AddCampaignCommentMutation, AddCampaignCommentMutationVariables>;
export const CreatePaymentIntentDocument = gql`
    mutation CreatePaymentIntent($input: CreatePaymentIntentInput!) {
  createPaymentIntent(input: $input) {
    clientSecret
    paymentIntentId
    amount
    currency
  }
}
    `;
export type CreatePaymentIntentMutationFn = Apollo.MutationFunction<CreatePaymentIntentMutation, CreatePaymentIntentMutationVariables>;

/**
 * __useCreatePaymentIntentMutation__
 *
 * To run a mutation, you first call `useCreatePaymentIntentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePaymentIntentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPaymentIntentMutation, { data, loading, error }] = useCreatePaymentIntentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePaymentIntentMutation(baseOptions?: Apollo.MutationHookOptions<CreatePaymentIntentMutation, CreatePaymentIntentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePaymentIntentMutation, CreatePaymentIntentMutationVariables>(CreatePaymentIntentDocument, options);
      }
export type CreatePaymentIntentMutationHookResult = ReturnType<typeof useCreatePaymentIntentMutation>;
export type CreatePaymentIntentMutationResult = Apollo.MutationResult<CreatePaymentIntentMutation>;
export type CreatePaymentIntentMutationOptions = Apollo.BaseMutationOptions<CreatePaymentIntentMutation, CreatePaymentIntentMutationVariables>;
export const ConfirmPaymentDocument = gql`
    mutation ConfirmPayment($paymentIntentId: String!) {
  confirmPayment(paymentIntentId: $paymentIntentId) {
    _id
    stripePaymentIntentId
    amount
    status
    type
    user {
      _id
      name
    }
    campaign {
      id
      title
    }
  }
}
    `;
export type ConfirmPaymentMutationFn = Apollo.MutationFunction<ConfirmPaymentMutation, ConfirmPaymentMutationVariables>;

/**
 * __useConfirmPaymentMutation__
 *
 * To run a mutation, you first call `useConfirmPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmPaymentMutation, { data, loading, error }] = useConfirmPaymentMutation({
 *   variables: {
 *      paymentIntentId: // value for 'paymentIntentId'
 *   },
 * });
 */
export function useConfirmPaymentMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmPaymentMutation, ConfirmPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmPaymentMutation, ConfirmPaymentMutationVariables>(ConfirmPaymentDocument, options);
      }
export type ConfirmPaymentMutationHookResult = ReturnType<typeof useConfirmPaymentMutation>;
export type ConfirmPaymentMutationResult = Apollo.MutationResult<ConfirmPaymentMutation>;
export type ConfirmPaymentMutationOptions = Apollo.BaseMutationOptions<ConfirmPaymentMutation, ConfirmPaymentMutationVariables>;
export const GetPaymentMethodsDocument = gql`
    query GetPaymentMethods {
  getPaymentMethods {
    id
    brand
    last4
    expMonth
    expYear
    isDefault
  }
}
    `;

/**
 * __useGetPaymentMethodsQuery__
 *
 * To run a query within a React component, call `useGetPaymentMethodsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentMethodsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentMethodsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPaymentMethodsQuery(baseOptions?: Apollo.QueryHookOptions<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>(GetPaymentMethodsDocument, options);
      }
export function useGetPaymentMethodsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>(GetPaymentMethodsDocument, options);
        }
export function useGetPaymentMethodsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>(GetPaymentMethodsDocument, options);
        }
export type GetPaymentMethodsQueryHookResult = ReturnType<typeof useGetPaymentMethodsQuery>;
export type GetPaymentMethodsLazyQueryHookResult = ReturnType<typeof useGetPaymentMethodsLazyQuery>;
export type GetPaymentMethodsSuspenseQueryHookResult = ReturnType<typeof useGetPaymentMethodsSuspenseQuery>;
export type GetPaymentMethodsQueryResult = Apollo.QueryResult<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>;
export const SavePaymentMethodDocument = gql`
    mutation SavePaymentMethod($paymentMethodId: String!) {
  savePaymentMethod(paymentMethodId: $paymentMethodId)
}
    `;
export type SavePaymentMethodMutationFn = Apollo.MutationFunction<SavePaymentMethodMutation, SavePaymentMethodMutationVariables>;

/**
 * __useSavePaymentMethodMutation__
 *
 * To run a mutation, you first call `useSavePaymentMethodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSavePaymentMethodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [savePaymentMethodMutation, { data, loading, error }] = useSavePaymentMethodMutation({
 *   variables: {
 *      paymentMethodId: // value for 'paymentMethodId'
 *   },
 * });
 */
export function useSavePaymentMethodMutation(baseOptions?: Apollo.MutationHookOptions<SavePaymentMethodMutation, SavePaymentMethodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SavePaymentMethodMutation, SavePaymentMethodMutationVariables>(SavePaymentMethodDocument, options);
      }
export type SavePaymentMethodMutationHookResult = ReturnType<typeof useSavePaymentMethodMutation>;
export type SavePaymentMethodMutationResult = Apollo.MutationResult<SavePaymentMethodMutation>;
export type SavePaymentMethodMutationOptions = Apollo.BaseMutationOptions<SavePaymentMethodMutation, SavePaymentMethodMutationVariables>;
export const RemovePaymentMethodDocument = gql`
    mutation RemovePaymentMethod($paymentMethodId: String!) {
  removePaymentMethod(paymentMethodId: $paymentMethodId)
}
    `;
export type RemovePaymentMethodMutationFn = Apollo.MutationFunction<RemovePaymentMethodMutation, RemovePaymentMethodMutationVariables>;

/**
 * __useRemovePaymentMethodMutation__
 *
 * To run a mutation, you first call `useRemovePaymentMethodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePaymentMethodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePaymentMethodMutation, { data, loading, error }] = useRemovePaymentMethodMutation({
 *   variables: {
 *      paymentMethodId: // value for 'paymentMethodId'
 *   },
 * });
 */
export function useRemovePaymentMethodMutation(baseOptions?: Apollo.MutationHookOptions<RemovePaymentMethodMutation, RemovePaymentMethodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemovePaymentMethodMutation, RemovePaymentMethodMutationVariables>(RemovePaymentMethodDocument, options);
      }
export type RemovePaymentMethodMutationHookResult = ReturnType<typeof useRemovePaymentMethodMutation>;
export type RemovePaymentMethodMutationResult = Apollo.MutationResult<RemovePaymentMethodMutation>;
export type RemovePaymentMethodMutationOptions = Apollo.BaseMutationOptions<RemovePaymentMethodMutation, RemovePaymentMethodMutationVariables>;
export const SetDefaultPaymentMethodDocument = gql`
    mutation SetDefaultPaymentMethod($paymentMethodId: String!) {
  setDefaultPaymentMethod(paymentMethodId: $paymentMethodId)
}
    `;
export type SetDefaultPaymentMethodMutationFn = Apollo.MutationFunction<SetDefaultPaymentMethodMutation, SetDefaultPaymentMethodMutationVariables>;

/**
 * __useSetDefaultPaymentMethodMutation__
 *
 * To run a mutation, you first call `useSetDefaultPaymentMethodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetDefaultPaymentMethodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setDefaultPaymentMethodMutation, { data, loading, error }] = useSetDefaultPaymentMethodMutation({
 *   variables: {
 *      paymentMethodId: // value for 'paymentMethodId'
 *   },
 * });
 */
export function useSetDefaultPaymentMethodMutation(baseOptions?: Apollo.MutationHookOptions<SetDefaultPaymentMethodMutation, SetDefaultPaymentMethodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetDefaultPaymentMethodMutation, SetDefaultPaymentMethodMutationVariables>(SetDefaultPaymentMethodDocument, options);
      }
export type SetDefaultPaymentMethodMutationHookResult = ReturnType<typeof useSetDefaultPaymentMethodMutation>;
export type SetDefaultPaymentMethodMutationResult = Apollo.MutationResult<SetDefaultPaymentMethodMutation>;
export type SetDefaultPaymentMethodMutationOptions = Apollo.BaseMutationOptions<SetDefaultPaymentMethodMutation, SetDefaultPaymentMethodMutationVariables>;
export const GetCurrentUserQueryDocument = gql`
    query GetCurrentUserQuery {
  getCurrentUser {
    ...UserDetailedFields
  }
}
    ${UserDetailedFieldsFragmentDoc}`;

/**
 * __useGetCurrentUserQueryQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQueryQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentUserQueryQuery, GetCurrentUserQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserQueryQuery, GetCurrentUserQueryQueryVariables>(GetCurrentUserQueryDocument, options);
      }
export function useGetCurrentUserQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQueryQuery, GetCurrentUserQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserQueryQuery, GetCurrentUserQueryQueryVariables>(GetCurrentUserQueryDocument, options);
        }
export function useGetCurrentUserQuerySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrentUserQueryQuery, GetCurrentUserQueryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCurrentUserQueryQuery, GetCurrentUserQueryQueryVariables>(GetCurrentUserQueryDocument, options);
        }
export type GetCurrentUserQueryQueryHookResult = ReturnType<typeof useGetCurrentUserQueryQuery>;
export type GetCurrentUserQueryLazyQueryHookResult = ReturnType<typeof useGetCurrentUserQueryLazyQuery>;
export type GetCurrentUserQuerySuspenseQueryHookResult = ReturnType<typeof useGetCurrentUserQuerySuspenseQuery>;
export type GetCurrentUserQueryQueryResult = Apollo.QueryResult<GetCurrentUserQueryQuery, GetCurrentUserQueryQueryVariables>;
export const GetUsersListQueryDocument = gql`
    query GetUsersListQuery {
  getUsers {
    ...UserDetailedFields
  }
}
    ${UserDetailedFieldsFragmentDoc}`;

/**
 * __useGetUsersListQueryQuery__
 *
 * To run a query within a React component, call `useGetUsersListQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersListQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersListQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersListQueryQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersListQueryQuery, GetUsersListQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersListQueryQuery, GetUsersListQueryQueryVariables>(GetUsersListQueryDocument, options);
      }
export function useGetUsersListQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersListQueryQuery, GetUsersListQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersListQueryQuery, GetUsersListQueryQueryVariables>(GetUsersListQueryDocument, options);
        }
export function useGetUsersListQuerySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersListQueryQuery, GetUsersListQueryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersListQueryQuery, GetUsersListQueryQueryVariables>(GetUsersListQueryDocument, options);
        }
export type GetUsersListQueryQueryHookResult = ReturnType<typeof useGetUsersListQueryQuery>;
export type GetUsersListQueryLazyQueryHookResult = ReturnType<typeof useGetUsersListQueryLazyQuery>;
export type GetUsersListQuerySuspenseQueryHookResult = ReturnType<typeof useGetUsersListQuerySuspenseQuery>;
export type GetUsersListQueryQueryResult = Apollo.QueryResult<GetUsersListQueryQuery, GetUsersListQueryQueryVariables>;
export const GetUserByIdQueryDocument = gql`
    query GetUserByIdQuery($id: ID!) {
  getUser(id: $id) {
    ...UserDetailedFields
  }
}
    ${UserDetailedFieldsFragmentDoc}`;

/**
 * __useGetUserByIdQueryQuery__
 *
 * To run a query within a React component, call `useGetUserByIdQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByIdQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByIdQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserByIdQueryQuery(baseOptions: Apollo.QueryHookOptions<GetUserByIdQueryQuery, GetUserByIdQueryQueryVariables> & ({ variables: GetUserByIdQueryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByIdQueryQuery, GetUserByIdQueryQueryVariables>(GetUserByIdQueryDocument, options);
      }
export function useGetUserByIdQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByIdQueryQuery, GetUserByIdQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByIdQueryQuery, GetUserByIdQueryQueryVariables>(GetUserByIdQueryDocument, options);
        }
export function useGetUserByIdQuerySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserByIdQueryQuery, GetUserByIdQueryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserByIdQueryQuery, GetUserByIdQueryQueryVariables>(GetUserByIdQueryDocument, options);
        }
export type GetUserByIdQueryQueryHookResult = ReturnType<typeof useGetUserByIdQueryQuery>;
export type GetUserByIdQueryLazyQueryHookResult = ReturnType<typeof useGetUserByIdQueryLazyQuery>;
export type GetUserByIdQuerySuspenseQueryHookResult = ReturnType<typeof useGetUserByIdQuerySuspenseQuery>;
export type GetUserByIdQueryQueryResult = Apollo.QueryResult<GetUserByIdQueryQuery, GetUserByIdQueryQueryVariables>;
export const GetUsersByRoleQueryDocument = gql`
    query GetUsersByRoleQuery($role: UserRole!) {
  getUsersByRole(role: $role) {
    ...UserDetailedFields
  }
}
    ${UserDetailedFieldsFragmentDoc}`;

/**
 * __useGetUsersByRoleQueryQuery__
 *
 * To run a query within a React component, call `useGetUsersByRoleQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersByRoleQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersByRoleQueryQuery({
 *   variables: {
 *      role: // value for 'role'
 *   },
 * });
 */
export function useGetUsersByRoleQueryQuery(baseOptions: Apollo.QueryHookOptions<GetUsersByRoleQueryQuery, GetUsersByRoleQueryQueryVariables> & ({ variables: GetUsersByRoleQueryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersByRoleQueryQuery, GetUsersByRoleQueryQueryVariables>(GetUsersByRoleQueryDocument, options);
      }
export function useGetUsersByRoleQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersByRoleQueryQuery, GetUsersByRoleQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersByRoleQueryQuery, GetUsersByRoleQueryQueryVariables>(GetUsersByRoleQueryDocument, options);
        }
export function useGetUsersByRoleQuerySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersByRoleQueryQuery, GetUsersByRoleQueryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersByRoleQueryQuery, GetUsersByRoleQueryQueryVariables>(GetUsersByRoleQueryDocument, options);
        }
export type GetUsersByRoleQueryQueryHookResult = ReturnType<typeof useGetUsersByRoleQueryQuery>;
export type GetUsersByRoleQueryLazyQueryHookResult = ReturnType<typeof useGetUsersByRoleQueryLazyQuery>;
export type GetUsersByRoleQuerySuspenseQueryHookResult = ReturnType<typeof useGetUsersByRoleQuerySuspenseQuery>;
export type GetUsersByRoleQueryQueryResult = Apollo.QueryResult<GetUsersByRoleQueryQuery, GetUsersByRoleQueryQueryVariables>;
export const GetUsersWithParamsDocument = gql`
    query GetUsersWithParams($limit: Int, $offset: Int, $noLimit: Boolean) {
  getUsers(limit: $limit, offset: $offset, noLimit: $noLimit) {
    _id
    name
    email
    role
    groups
    isEmailVerified
    isActive
    deactivatedAt
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUsersWithParamsQuery__
 *
 * To run a query within a React component, call `useGetUsersWithParamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersWithParamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersWithParamsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      noLimit: // value for 'noLimit'
 *   },
 * });
 */
export function useGetUsersWithParamsQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersWithParamsQuery, GetUsersWithParamsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersWithParamsQuery, GetUsersWithParamsQueryVariables>(GetUsersWithParamsDocument, options);
      }
export function useGetUsersWithParamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersWithParamsQuery, GetUsersWithParamsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersWithParamsQuery, GetUsersWithParamsQueryVariables>(GetUsersWithParamsDocument, options);
        }
export function useGetUsersWithParamsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersWithParamsQuery, GetUsersWithParamsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersWithParamsQuery, GetUsersWithParamsQueryVariables>(GetUsersWithParamsDocument, options);
        }
export type GetUsersWithParamsQueryHookResult = ReturnType<typeof useGetUsersWithParamsQuery>;
export type GetUsersWithParamsLazyQueryHookResult = ReturnType<typeof useGetUsersWithParamsLazyQuery>;
export type GetUsersWithParamsSuspenseQueryHookResult = ReturnType<typeof useGetUsersWithParamsSuspenseQuery>;
export type GetUsersWithParamsQueryResult = Apollo.QueryResult<GetUsersWithParamsQuery, GetUsersWithParamsQueryVariables>;