'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_CAMPAIGN } from '../graphql/queries';
import Image from 'next/image';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { Campaign } from '@/graphql/generated/graphql';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Users, Heart, Gift, Info, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function CampaignPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data, loading, error } = useQuery(GET_CAMPAIGN, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });
  
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('description');
  
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (error) return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Грешка при зареждането на кампанията: {error.message}
      </div>
    </div>
  );
  
  if (!data?.getCampaign) return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded">
        Кампанията не е намерена
      </div>
    </div>
  );
  
  const campaign = data.getCampaign as Campaign;
  
  // Форматиране на сумите
  const formattedGoal = new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'BGN',
    minimumFractionDigits: 0,
  }).format(campaign.goal);

  const formattedCurrentAmount = new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'BGN',
    minimumFractionDigits: 0,
  }).format(campaign.currentAmount);
  
  const closeGallery = () => setSelectedImage(null);
  
  return (
    <>
      {/* Full screen image gallery */}
      <AnimatePresence>
        {selectedImage !== null && campaign.images && campaign.images.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={closeGallery}
          >
            <div className="relative w-full max-w-4xl">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative aspect-video"
              >
                <Image 
                  src={campaign.images[selectedImage]} 
                  alt={campaign.title} 
                  fill
                  className="object-contain" 
                />
              </motion.div>
              
              <div className="absolute top-4 right-4">
                <button 
                  onClick={closeGallery}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {campaign.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(index);
                    }}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all",
                      selectedImage === index ? "bg-white" : "bg-white/50 hover:bg-white/70"
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/campaigns/all" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Всички кампании</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column - Campaign details */}
          <div className="lg:col-span-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
              
              {campaign.hashtags && campaign.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {campaign.hashtags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Status badge */}
              <div className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                campaign.isActive 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              )}>
                <span className={cn(
                  "w-2 h-2 rounded-full mr-2",
                  campaign.isActive ? "bg-green-500" : "bg-gray-500"
                )}></span>
                <span>
                  {campaign.isActive ? 'Активна' : 'Завършена'}
                </span>
              </div>
            </div>
            
            {/* Main campaign image */}
            {campaign.images && campaign.images.length > 0 && (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6">
                <Image
                  src={campaign.images[0]}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 right-4">
                  <button 
                    onClick={() => setSelectedImage(0)}
                    className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Tabs for different content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="description" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                  <Info className="w-4 h-4 mr-2" />
                  Описание
                </TabsTrigger>
                <TabsTrigger value="gallery" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Галерия
                </TabsTrigger>
                <TabsTrigger value="events" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                  <Calendar className="w-4 h-4 mr-2" />
                  Събития
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-6 bg-white rounded-xl shadow-sm">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{campaign.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="gallery">
                {campaign.images && campaign.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {campaign.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="aspect-square relative rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => setSelectedImage(index)}
                      >
                        <Image
                          src={image}
                          alt={`${campaign.title} image ${index + 1}`}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        {campaign.imagesCaptions && campaign.imagesCaptions[index] && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                            <p className="text-white text-sm">{campaign.imagesCaptions[index]}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-white rounded-xl shadow-sm text-center text-gray-500">
                    Няма добавени изображения към тази кампания
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="events">
                {campaign.events && campaign.events.length > 0 ? (
                  <div className="space-y-4">
                    {campaign.events.map((event) => (
                      <div key={event.id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <Calendar className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{formatDate(event.date)}</span>
                              <span className="mx-2">•</span>
                              <span>{event.location}</span>
                            </div>
                            <p className="text-gray-700">{event.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-white rounded-xl shadow-sm text-center text-gray-500">
                    Няма добавени събития към тази кампания
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {/* Donations section */}
            {campaign.donations && campaign.donations.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Дарения</h2>
                <div className="space-y-4">
                  {campaign.donations.slice(0, 5).map((donation) => (
                    <div key={donation.id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          {donation.user.profile?.avatar ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden relative">
                              <Image 
                                src={donation.user.profile.avatar} 
                                alt={donation.user.name} 
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {donation.user.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{donation.user.name}</h3>
                            <span className="text-green-600 font-semibold">
                              {new Intl.NumberFormat('bg-BG', {
                                style: 'currency',
                                currency: 'BGN',
                                minimumFractionDigits: 0,
                              }).format(donation.amount)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mb-1">
                            {formatDate(donation.date)}
                          </div>
                          {donation.comment && (
                            <p className="text-gray-700 mt-1">{donation.comment}</p>
                          )}
                          {donation.rating && (
                            <div className="flex items-center mt-2">
                              {Array.from({ length: 5 }, (_, i) => (
                                <svg 
                                  key={i}
                                  className={`w-4 h-4 ${i < donation.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {campaign.donations.length > 5 && (
                    <div className="text-center">
                      <Button variant="outline">
                        Вижте всички {campaign.donations.length} дарения
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Right column - Campaign stats & donate */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              {/* Progress stats */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500 text-sm">Събрани</span>
                    <span className="font-semibold text-sm">{Math.round(campaign.percentCompleted)}% от целта</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${Math.min(campaign.percentCompleted, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xl font-bold">{formattedCurrentAmount}</span>
                    <span className="text-gray-500">от {formattedGoal}</span>
                  </div>
                </div>
                
                <div className="my-6 border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Users className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-xl font-bold">{campaign.participantsCount}</div>
                      <div className="text-xs text-gray-500">участници</div>
                    </div>
                    
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Gift className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-xl font-bold">{campaign.donations?.length || 0}</div>
                      <div className="text-xs text-gray-500">дарения</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Heart className="w-4 h-4 mr-2" />
                    Дари сега
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Стани участник
                  </Button>
                </div>
              </div>
              
              {/* Campaign info */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="font-semibold mb-4">Информация за кампанията</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Начало</div>
                      <div>{formatDate(campaign.startDate)}</div>
                    </div>
                  </div>
                  
                  {campaign.endDate && (
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Край</div>
                        <div>{formatDate(campaign.endDate)}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Организатор</div>
                      <div className="flex items-center">
                        {campaign.createdBy.profile?.avatar ? (
                          <div className="w-6 h-6 rounded-full overflow-hidden relative mr-2">
                            <Image 
                              src={campaign.createdBy.profile.avatar} 
                              alt={campaign.createdBy.name} 
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            <span className="text-blue-600 text-xs font-semibold">
                              {campaign.createdBy.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span>{campaign.createdBy.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  {campaign.totalRating !== undefined && campaign.ratingCount && campaign.ratingCount > 0 && (
                    <div className="flex items-start">
                      <Heart className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Рейтинг</div>
                        <div className="flex items-center">
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <svg 
                                key={i}
                                className={`w-4 h-4 ${i < Math.round(campaign.totalRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-gray-600">
                            ({campaign.ratingCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Share */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold mb-4">Сподели</h3>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon" className="w-12 h-12 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Button>
                  
                  <Button variant="outline" size="icon" className="w-12 h-12 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </Button>
                  
                  <Button variant="outline" size="icon" className="w-12 h-12 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                    </svg>
                  </Button>
                  
                  <Button variant="outline" size="icon" className="w-12 h-12 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z"/>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 