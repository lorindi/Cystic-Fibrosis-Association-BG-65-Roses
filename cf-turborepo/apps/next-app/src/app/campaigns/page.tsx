'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useCampaignSections } from './hooks/useCampaignSections';
import CampaignSection from './components/CampaignSection';
import CampaignHero from './components/CampaignHero';
import CategoryCards from './components/CategoryCards';
import TestimonialsSection from './components/TestimonialsSection';
import { testimonials } from './data/mockData';

export default function CampaignsPage() {
  const { isAuthenticated, user } = useAuth();
  const { sections } = useCampaignSections();

  return (
    <div className="container mx-auto px-4 py-8 ">
      <CampaignHero />
      
      {/* Първата секция от кампании - Активни кампании */}
      {sections.length > 0 && (
        <CampaignSection section={sections[0]} />
      )}
      
      {/* Категории кампании */}
      <CategoryCards 
        title="Категории кампании" 
        subtitle="Разгледайте кампаниите по вид"
      />
      
      {/* Втората секция от кампании - Най-популярни */}
      {sections.length > 1 && (
        <CampaignSection section={sections[1]} />
      )}
      
      {/* Секция с отзиви */}
      <TestimonialsSection testimonials={testimonials} />
      
      {/* Третата секция от кампании - Най-успешни */}
      {sections.length > 2 && (
        <CampaignSection section={sections[2]} />
      )}
    </div>
  );
}
