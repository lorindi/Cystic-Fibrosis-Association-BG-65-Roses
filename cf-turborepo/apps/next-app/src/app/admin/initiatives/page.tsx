'use client';

import React, { useState } from 'react';
import { withPermissions } from '@/lib/hoc/withPermissions';
import { UserGroup } from '@/graphql/generated/graphql';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Edit, Trash2, Eye, Filter } from 'lucide-react';

function InitiativesPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  // Тук ще бъде логиката за зареждане и управление на инициативите
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Initiatives</h1>
          <p className="text-muted-foreground">
            Manage all your initiatives and campaigns.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Initiative
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Initiatives</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
          </Button>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Тук ще показваме действителните инициативи от базата данни */}
            {[1, 2, 3, 4, 5].map((i) => (
              <InitiativeCard 
                key={i}
                title={`Example Initiative ${i}`}
                description="This is a sample initiative for demonstration purposes."
                date="May 15th, 2023"
                status={i % 2 === 0 ? "active" : "draft"}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[2, 4].map((i) => (
              <InitiativeCard 
                key={i}
                title={`Example Initiative ${i}`}
                description="This is a sample initiative for demonstration purposes."
                date="May 15th, 2023"
                status="active"
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="drafts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 3, 5].map((i) => (
              <InitiativeCard 
                key={i}
                title={`Example Initiative ${i}`}
                description="This is a sample initiative for demonstration purposes."
                date="May 15th, 2023"
                status="draft"
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="archive" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <p className="col-span-full text-center text-muted-foreground py-8">No archived initiatives found.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface InitiativeCardProps {
  title: string;
  description: string;
  date: string;
  status: 'active' | 'draft' | 'archived';
}

function InitiativeCard({ title, description, date, status }: InitiativeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <span>Created: {date}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'active' ? 'bg-green-100 text-green-800' :
            status === 'draft' ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// Използваме нашия HOC за проверка на права за достъп
// Тази страница е достъпна само за админи и потребители с група 'initiatives'
export default withPermissions(InitiativesPage, ['initiatives'], 'Initiatives Management'); 