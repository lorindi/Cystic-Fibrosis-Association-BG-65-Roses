/**
 * Скрипт за миграция на съществуващите инициативи към новата структура с pendingParticipants
 * 
 * Този скрипт трябва да се изпълни само веднъж след обновлението, за да инициализира
 * pendingParticipants масива за всички съществуващи инициативи.
 * 
 * Изпълнение: ts-node src/scripts/migrateInitiatives.ts
 */

import mongoose from 'mongoose';
import Initiative from '../models/initiative.model';
import dotenv from 'dotenv';

// Зареждане на променливи от средата
dotenv.config();

async function migrateInitiatives() {
  try {
    // Свързване с базата данни
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB');
    
    // Намиране на всички инициативи без pendingParticipants поле
    const initiatives = await Initiative.find({});
    
    console.log(`Found ${initiatives.length} initiatives to migrate`);
    
    let migratedCount = 0;
    
    // Обновяване на всяка инициатива
    for (const initiative of initiatives) {
      // Проверка дали pendingParticipants вече съществува
      if (!initiative.pendingParticipants) {
        // Инициализиране на pendingParticipants като празен масив
        initiative.pendingParticipants = [];
        await initiative.save();
        migratedCount++;
      }
    }
    
    console.log(`Successfully migrated ${migratedCount} initiatives`);
    
    // Затваряне на връзката с базата данни
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Изпълнение на миграцията
migrateInitiatives(); 