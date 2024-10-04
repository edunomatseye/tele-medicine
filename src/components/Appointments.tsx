import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import AddAppointmentForm from './AddAppointmentForm';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: number;
  patient_name: string;
  date: string;
  time: string;
}

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchAppointments = async (date: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date);

    if (error) throw error;
    return data || [];
  };

  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments', selectedDate?.toISOString().split('T')[0]],
    queryFn: () => fetchAppointments(selectedDate?.toISOString().split('T')[0] || ''),
    enabled: !!selectedDate,
  });

  const addAppointmentMutation = useMutation({
    mutationFn: async (newAppointment: Omit<Appointment, 'id'>) => {
      const { data, error } = await supabase
        .from('appointments')
        .insert([newAppointment])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Appointment deleted',
        description: 'The appointment has been successfully deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete appointment: ${error}`,
        variant: 'destructive',
      });
    },
  });

  const handleAddAppointment = (newAppointment: Omit<Appointment, 'id'>) => {
    addAppointmentMutation.mutate(newAppointment);
    setIsAddAppointmentOpen(false);
  };

  const handleDeleteAppointment = (id: number) => {
    deleteAppointmentMutation.mutate(id);
  };

  if (error) {
    return <div>Error loading appointments: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Appointments</h2>
        <Button onClick={() => setIsAddAppointmentOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Appointment
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Appointments for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Selected Date"}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading appointments...</p>
            ) : appointments.length > 0 ? (
              <ul className="space-y-3">
                {appointments.map((appointment: Appointment) => (
                  <li key={appointment.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium">{appointment.patient_name}</p>
                      <p className="text-sm text-muted-foreground">{appointment.time}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No appointments for this date.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <AddAppointmentForm
        isOpen={isAddAppointmentOpen}
        onClose={() => setIsAddAppointmentOpen(false)}
        onAddAppointment={handleAddAppointment}
        selectedDate={selectedDate}
      />
    </div>
  );
}