import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  patient_id: z.string().min(1, { message: 'Please select a patient.' }),
  date: z.string().min(1, { message: 'Please select a date.' }),
  time: z.string().min(1, { message: 'Please enter a time.' }),
});

interface AddAppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (appointment: { patient_name: string; date: string; time: string }) => void;
  selectedDate: Date | undefined;
}

interface Patient {
  id: number;
  name: string;
}

export default function AddAppointmentForm({ isOpen, onClose, onAddAppointment, selectedDate }: AddAppointmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: '',
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      time: '',
    },
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching patients:', error);
    } else {
      setPatients(data || []);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const selectedPatient = patients.find(p => p.id.toString() === values.patient_id);
      if (!selectedPatient) throw new Error('Patient not found');

      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: parseInt(values.patient_id),
          patient_name: selectedPatient.name,
          date: values.date,
          time: values.time,
        }])
        .select();

      if (error) throw error;

      toast({
        title: 'Appointment added successfully',
        description: `Appointment for ${selectedPatient.name} has been scheduled.`,
      });
      onAddAppointment({
        patient_name: selectedPatient.name,
        date: values.date,
        time: values.time,
      });
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: 'Error adding appointment',
        description: 'There was an error scheduling the appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patient_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}