import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { CampaignEventInput } from '@/types/campaign';

// Мутация за добавяне на събитие към кампания
const ADD_CAMPAIGN_EVENT = gql`
  mutation AddCampaignEvent($campaignId: ID!, $input: CampaignEventInput!) {
    addCampaignEvent(campaignId: $campaignId, input: $input) {
      id
      title
      description
      date
      location
    }
  }
`;

// Мутация за редактиране на събитие
const UPDATE_CAMPAIGN_EVENT = gql`
  mutation UpdateCampaignEvent($campaignId: ID!, $eventId: ID!, $input: CampaignEventInput!) {
    updateCampaignEvent(eventId: $eventId, input: $input) {
      id
      title
      description
      date
      location
    }
  }
`;

// Мутация за изтриване на събитие
const DELETE_CAMPAIGN_EVENT = gql`
  mutation DeleteCampaignEvent($eventId: ID!) {
    deleteCampaignEvent(eventId: $eventId)
  }
`;

export const useCampaignEvents = () => {
  // Мутация за добавяне на събитие
  const [addEventMutation, addEventResult] = useMutation(ADD_CAMPAIGN_EVENT);
  const [updateEventMutation, updateEventResult] = useMutation(UPDATE_CAMPAIGN_EVENT);
  const [deleteEventMutation, deleteEventResult] = useMutation(DELETE_CAMPAIGN_EVENT);

  // Функция за добавяне или обновяване на събитие
  const saveEvent = async (campaignId: string, eventData: CampaignEventInput, eventId?: string) => {
    if (eventId) {
      // Ако имаме ID на събитие, обновяваме съществуващо
      return updateEventMutation({
        variables: {
          campaignId,
          eventId,
          input: eventData
        }
      });
    } else {
      // В противен случай добавяме ново събитие
      return addEventMutation({
        variables: {
          campaignId,
          input: eventData
        }
      });
    }
  };

  // Функция за изтриване на събитие
  const deleteEvent = async (campaignId: string, eventId: string) => {
    return deleteEventMutation({
      variables: {
        eventId
      }
    });
  };

  return {
    saveEvent,
    deleteEvent,
    addEventResult,
    updateEventResult,
    deleteEventResult
  };
}; 