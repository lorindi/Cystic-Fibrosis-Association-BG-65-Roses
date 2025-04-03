'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  LucideUsers,
  LucideDollarSign,
  LucideCalendarDays,
  LucideArrowUpRight,
  LucideArrowRight,
  LucidePlus,
  LucideShoppingBag,
  LucideNewspaper,
  LucideUtensils,
  LucideBookmark,
  LucideMessageSquare,
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to 65 Roses Association Admin Panel
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Export Data
          </Button>
          <Button>
            <LucidePlus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <LucideUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              +6 since last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Funds Raised
            </CardTitle>
            <LucideDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145,893 лв.</div>
            <p className="text-xs text-muted-foreground">
              +22,450 лв. since last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Campaigns
            </CardTitle>
            <LucideCalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 need your attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Store Orders
            </CardTitle>
            <LucideShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+32</div>
            <p className="text-xs text-muted-foreground">
              12 need processing
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>
              Overview of the latest donations received
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Иван Петров</TableCell>
                  <TableCell>Медицински център</TableCell>
                  <TableCell>April 2, 2024</TableCell>
                  <TableCell className="text-right">5,000 лв.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Мария Стоянова</TableCell>
                  <TableCell>Лекарства за деца</TableCell>
                  <TableCell>April 1, 2024</TableCell>
                  <TableCell className="text-right">1,200 лв.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Технологии ООД</TableCell>
                  <TableCell>Медицински център</TableCell>
                  <TableCell>March 30, 2024</TableCell>
                  <TableCell className="text-right">10,000 лв.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Георги Иванов</TableCell>
                  <TableCell>Лекарства за деца</TableCell>
                  <TableCell>March 28, 2024</TableCell>
                  <TableCell className="text-right">500 лв.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" size="sm">
              View All Donations
              <LucideArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
              Items waiting for your review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LucideNewspaper className="h-5 w-5 text-muted-foreground" />
                <span>Blog Posts</span>
              </div>
              <Badge>12</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LucideUtensils className="h-5 w-5 text-muted-foreground" />
                <span>Recipes</span>
              </div>
              <Badge>8</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LucideBookmark className="h-5 w-5 text-muted-foreground" />
                <span>Patient Stories</span>
              </div>
              <Badge>5</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LucideMessageSquare className="h-5 w-5 text-muted-foreground" />
                <span>Inquiries</span>
              </div>
              <Badge>3</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" size="sm">
              Review All Pending Items
              <LucideArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Conferences</CardTitle>
            <CardDescription>
              The next scheduled conferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Живот с муковисцидоза</h4>
                <Badge variant="outline">April 15, 2024</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Образователна конференция за пациенти и родители
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Нови терапии и лечения</h4>
                <Badge variant="outline">May 10, 2024</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Представяне на новите медикаменти и терапии
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" size="sm">
              View All Conferences
              <LucideArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Initiatives</CardTitle>
            <CardDescription>
              Current initiatives with patient enrollments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Инхалатори за пациенти</h4>
                <Badge className="bg-green-500">32 записани</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Разпределяне на инхалатори за деца с кистозна фиброза
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Закупуване на MukoClear</h4>
                <Badge className="bg-amber-500">18 записани</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Осигуряване на медикаменти за пациенти
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" size="sm">
              Manage Initiatives
              <LucideArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest activity on the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                April 3, 09:45
              </p>
              <p className="text-sm">
                <span className="font-medium">Петър Димитров</span> се регистрира като пациент
              </p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                April 2, 14:30
              </p>
              <p className="text-sm">
                <span className="font-medium">Анна Георгиева</span> публикува нова рецепта
              </p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                April 2, 11:15
              </p>
              <p className="text-sm">
                <span className="font-medium">Административен екип</span> създаде нова кампания
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" size="sm">
              View Activity Log
              <LucideArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}