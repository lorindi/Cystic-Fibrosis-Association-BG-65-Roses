'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_CAMPAIGNS } from '../graphql/queries';
import CampaignCard from '../components/CampaignCard';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import Loading from '../../../components/Loading';
import ErrorAlert from '../../../components/ErrorAlert';
import CategoryFilter from './components/CategoryFilter';
import { Campaign } from '@/graphql/generated/graphql';

// Статичен списък с всички хаштагове като отделни категории
const staticCategories = [
  // General campaign tags
  {
    id: 'support',
    title: 'Support',
    hashtags: ['support']
  },
  {
    id: 'donate',
    title: 'Donate',
    hashtags: ['donate']
  },
  {
    id: 'charity',
    title: 'Charity',
    hashtags: ['charity']
  },
  {
    id: 'help',
    title: 'Help',
    hashtags: ['help']
  },
  {
    id: 'together',
    title: 'Together',
    hashtags: ['together']
  },
  {
    id: 'volunteer',
    title: 'Volunteer',
    hashtags: ['volunteer']
  },
  {
    id: 'fundraising',
    title: 'Fundraising',
    hashtags: ['fundraising']
  },
  {
    id: 'noblecause',
    title: 'Noble Cause',
    hashtags: ['noblecause']
  },
  {
    id: 'socialresponsibility',
    title: 'Social Responsibility',
    hashtags: ['socialresponsibility']
  },
  {
    id: 'communitysupport',
    title: 'Community Support',
    hashtags: ['communitysupport']
  },
  
  // Cystic Fibrosis specific
  {
    id: 'cysticfibrosis',
    title: 'Cystic Fibrosis',
    hashtags: ['cysticfibrosis']
  },
  {
    id: '65roses',
    title: '65 Roses',
    hashtags: ['65roses']
  },
  {
    id: 'breathetogether',
    title: 'Breathe Together',
    hashtags: ['breathetogether']
  },
  {
    id: 'raredisease',
    title: 'Rare Disease',
    hashtags: ['raredisease']
  },
  {
    id: 'geneticdisease',
    title: 'Genetic Disease',
    hashtags: ['geneticdisease']
  },
  {
    id: 'treatment',
    title: 'Treatment',
    hashtags: ['treatment']
  },
  {
    id: 'therapy',
    title: 'Therapy',
    hashtags: ['therapy']
  },
  {
    id: 'rehabilitation',
    title: 'Rehabilitation',
    hashtags: ['rehabilitation']
  },
  {
    id: 'lunghealth',
    title: 'Lung Health',
    hashtags: ['lunghealth']
  },
  {
    id: 'qualityoflife',
    title: 'Quality of Life',
    hashtags: ['qualityoflife']
  },
  {
    id: 'accessibletreatment',
    title: 'Accessible Treatment',
    hashtags: ['accessibletreatment']
  },
  {
    id: 'innovativetherapy',
    title: 'Innovative Therapy',
    hashtags: ['innovativetherapy']
  },
  {
    id: 'genetherapy',
    title: 'Gene Therapy',
    hashtags: ['genetherapy']
  },
  {
    id: 'physiotherapy',
    title: 'Physiotherapy',
    hashtags: ['physiotherapy']
  },
  {
    id: 'breathingexercises',
    title: 'Breathing Exercises',
    hashtags: ['breathingexercises']
  },
  {
    id: 'inhalation',
    title: 'Inhalation',
    hashtags: ['inhalation']
  },
  {
    id: 'medicalequipment',
    title: 'Medical Equipment',
    hashtags: ['medicalequipment']
  },
  {
    id: 'medicalsupplies',
    title: 'Medical Supplies',
    hashtags: ['medicalsupplies']
  },
  
  // Financial aspects
  {
    id: 'emergencyhelp',
    title: 'Emergency Help',
    hashtags: ['emergencyhelp']
  },
  {
    id: 'financialsupport',
    title: 'Financial Support',
    hashtags: ['financialsupport']
  },
  {
    id: 'medicalexpenses',
    title: 'Medical Expenses',
    hashtags: ['medicalexpenses']
  },
  {
    id: 'equipmentpurchase',
    title: 'Equipment Purchase',
    hashtags: ['equipmentpurchase']
  },
  {
    id: 'fundraiser',
    title: 'Fundraiser',
    hashtags: ['fundraiser']
  },
  {
    id: 'donationaccount',
    title: 'Donation Account',
    hashtags: ['donationaccount']
  },
  {
    id: 'transparency',
    title: 'Transparency',
    hashtags: ['transparency']
  },
  {
    id: 'accountability',
    title: 'Accountability',
    hashtags: ['accountability']
  }
];

export default function AllCampaignsPage() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const itemsPerPage = 9;

  // Извличане на параметрите от URL-а
  useEffect(() => {
    const queryParam = searchParams.get('q');
    const categoriesParam = searchParams.get('categories');
    
    if (queryParam) {
      setSearchQuery(queryParam);
    }
    
    if (categoriesParam) {
      setSelectedCategories(categoriesParam.split(','));
    }
  }, [searchParams]);

  // Заявка за всички кампании без филтри
  const { loading, error, data } = useQuery(GET_CAMPAIGNS, {
    variables: {
      limit: 100,  // Взимаме повече кампании и филтрираме на клиента
      offset: 0
    },
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('Error fetching campaigns:', error.message);
    }
  });

  // Филтриране на кампаниите на клиента
  useEffect(() => {
    if (data?.getCampaigns) {
      let filtered = [...data.getCampaigns];
      
      // Филтриране по заглавие
      if (searchQuery) {
        filtered = filtered.filter(campaign => 
          campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Филтриране по категории/хаштагове (множествен избор)
      if (selectedCategories.length > 0) {
        // Създаваме списък от всички хаштагове от избраните категории
        const selectedHashtags: string[] = [];
        
        selectedCategories.forEach(categoryId => {
          const category = staticCategories.find(cat => cat.id === categoryId);
          if (category) {
            selectedHashtags.push(...category.hashtags);
          } else {
            // Ако категорията не е намерена, добавяме самия ID като хаштаг
            selectedHashtags.push(categoryId);
          }
        });
        
        // Филтрираме кампании, които имат поне един от избраните хаштагове
        filtered = filtered.filter(campaign => 
          campaign.hashtags?.some((tag: string) => selectedHashtags.includes(tag))
        );
      }
      
      setFilteredCampaigns(filtered);
    }
  }, [data, searchQuery, selectedCategories]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    setCurrentPage(1);
  };

  // Генериране на заглавие според избраните категории
  const getPageTitle = () => {
    if (selectedCategories.length === 0) {
      return 'All campaigns';
    } else if (selectedCategories.length === 1) {
      // Ако е избрана само една категория, показваме нейното име
      const category = staticCategories.find(cat => 
        cat.id === selectedCategories[0] || cat.hashtags.includes(selectedCategories[0])
      );
      return `${category?.title || selectedCategories[0]} campaigns`;
    } else {
      // Ако са избрани няколко категории, показваме обобщено заглавие
      return `Filtered campaigns (${selectedCategories.length} categories)`;
    }
  };

  // Прилагаме пагинация
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // При зареждане показваме спинера
  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-6 text-center">
          <ErrorAlert message="An error occurred while loading data. Please try again." />
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-center mb-6">
        <h1 className="text-3xl font-bold text-center md:text-left md:mr-6">
          {getPageTitle()}
        </h1>

        <div className="mt-4 md:mt-0 w-full md:w-auto md:max-w-md">
          <SearchBar 
            initialValue={searchQuery}
            onSearch={handleSearch}
            selectedCategory={selectedCategories.length > 0 ? selectedCategories[0] : null}
          />
        </div>
      </div>

      <div className="mb-6">
        <CategoryFilter 
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          categories={staticCategories}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCampaigns.map((campaign: Campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>

      {paginatedCampaigns.length > 0 ? (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No campaigns found</p>
        </div>
      )}
    </div>
  );
} 