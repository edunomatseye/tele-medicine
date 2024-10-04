import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/useAuthStore';
import Appointments from '@/components/Appointments';
import PatientList from '@/components/PatientList';
import VideoConsultation from '@/components/VideoConsultation';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('appointments');
  const { toast } = useToast();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of the telemedicine app.',
      });
    } catch (error: any) {
      toast({
        title: 'Logout failed',
        description: error.message || 'An error occurred while logging out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Telemedicine Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="consultation">Video Consultation</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          <Appointments />
        </TabsContent>
        <TabsContent value="patients">
          <PatientList />
        </TabsContent>
        <TabsContent value="consultation">
          <VideoConsultation />
        </TabsContent>
      </Tabs>
    </div>
  );
}