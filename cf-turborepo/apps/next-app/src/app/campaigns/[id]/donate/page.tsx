'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { DonationWidget } from '@/components/payment';
import { GET_CAMPAIGN } from '@/graphql/queries/admin';
import Link from 'next/link';

export default function CampaignDonatePage() {
  const params = useParams();
  const campaignId = params.id as string;
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, loading: queryLoading, error: queryError } = useQuery(GET_CAMPAIGN, {
    variables: { id: campaignId },
    skip: !campaignId,
  });

  useEffect(() => {
    if (queryLoading) {
      setLoading(true);
    } else if (queryError) {
      setLoading(false);
      setError('Не успяхме да заредим информация за кампанията.');
    } else if (data?.getCampaign) {
      setLoading(false);
      setCampaign(data.getCampaign);
    }
  }, [data, queryLoading, queryError]);

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="p-6 bg-red-50 rounded-lg text-center">
        <p className="text-red-700 mb-4">{error || 'Кампанията не беше намерена.'}</p>
        <Link href="/campaigns" className="text-primary hover:underline">
          Назад към всички кампании
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              Цел: {campaign.goal.toLocaleString()} лв.
            </div>
            <div className="text-sm text-gray-500">
              Събрани: {campaign.currentAmount.toLocaleString()} лв.
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, (campaign.currentAmount / campaign.goal) * 100)}%` }} 
            />
          </div>
        </div>

        <DonationWidget 
          campaignId={campaignId}
          campaignTitle={campaign.title}
          onSuccess={(paymentIntentId) => {
            console.log('Успешно дарение за кампания:', paymentIntentId);
          }}
        />
      </div>
    </div>
  );
} 